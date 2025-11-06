<script>
  import Card from "$lib/components/Card.svelte";
  import pokeballImg from '$lib/Images/pokeball.png';
  import * as d3 from "d3";

  const CACHE_KEY = "topCards";
  const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 uur

  let expensiveCards = [];
  let displayedCards = [];
  let loading = true;
  let error = false;

  let sortOption = "price";
  let showOverlay = false;
  let svgContainer;

  async function fetchTopCards() {
    loading = true;
    error = false;

    // Check cache
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      expensiveCards = cached.cards;
      sortCards(sortOption);
      loading = false;
      return;
    }

    try {
      const res = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=tcgplayer.prices.market:[1 TO *]&pageSize=9&orderBy=-tcgplayer.prices.market&select=id,name,tcgplayer.prices,images,rarity`,
        {
          headers: { "X-Api-Key": import.meta.env.API_KEY }
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      expensiveCards = data.data || [];

      if (expensiveCards.length === 0) {
        error = true;
      } else {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ cards: expensiveCards, timestamp: now }));
      }

      sortCards(sortOption);
    } catch (err) {
      console.error(err);
      error = true;
    } finally {
      loading = false;
    }
  }

  function sortCards(option) {
    sortOption = option;

    if(option === "price") {
      displayedCards = [...expensiveCards].sort(
        (a,b) => (b.tcgplayer?.prices?.normal?.market || 0) - (a.tcgplayer?.prices?.normal?.market || 0)
      );
    } else if(option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...expensiveCards].sort((a,b) => {
        const aIndex = rarityOrder.indexOf(a.rarity) !== -1 ? rarityOrder.indexOf(a.rarity) : 99;
        const bIndex = rarityOrder.indexOf(b.rarity) !== -1 ? rarityOrder.indexOf(b.rarity) : 99;
        return aIndex - bIndex;
      });
    } else if(option === "name") {
      displayedCards = [...expensiveCards].sort((a,b) => a.name.localeCompare(b.name));
    }
  }

  function openOverlay() {
    showOverlay = true;
    renderChart();
  }

  function closeOverlay() {
    showOverlay = false;
  }

  function renderChart() {
    if(!displayedCards.length) return;

    const cardsWithPrice = displayedCards.filter(c => c.tcgplayer?.prices?.normal?.market);
    const dataValues = cardsWithPrice.map(c => c.tcgplayer.prices.normal.market);
    const labels = cardsWithPrice.map(c => c.name);

    const width = 400;
    const height = 200;

    d3.select(svgContainer).selectAll("*").remove();
    const svg = d3.select(svgContainer).attr("width", width).attr("height", height);

    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(dataValues)]).range([height, 0]);

    svg.selectAll("rect")
      .data(dataValues)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(labels[i]))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d))
      .attr("fill", "#ffd700");

    svg.selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", d => x(d) + x.bandwidth()/2)
      .attr("y", height + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white");
  }

  // Fetch kaarten bij mount
  import { onMount } from "svelte";
  onMount(fetchTopCards);
</script>

<div class="binder-background">
  <h1>De Binder</h1>

  <div class="controls">
    <button class="overlay-btn" on:click={openOverlay}>📊</button>
    <label for="sortSelect">Sorteer op:</label>
    <select id="sortSelect" bind:value={sortOption} on:change={() => sortCards(sortOption)}>
      <option value="price">Prijs: Hoog → Laag</option>
      <option value="rarity">Zeldzaamheid</option>
      <option value="name">Naam: A → Z</option>
    </select>
  </div>

  {#if loading}
    <p>Kaarten worden geladen...</p>
  {:else if error}
    <p class="error">Kaarten konden niet geladen worden.</p>
  {:else}
    <div class="binder-grid">
      {#each displayedCards as card}
        <Card {card} />
      {/each}
    </div>
  {/if}

  {#if showOverlay}
    <div class="overlay">
      <button on:click={closeOverlay}>← Terug</button>
      <svg bind:this={svgContainer}></svg>
    </div>
  {/if}

  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
