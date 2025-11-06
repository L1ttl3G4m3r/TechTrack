<script>
  import Card from "$lib/components/Card.svelte";
  import PriceMarket from "$lib/components/PriceMarket.svelte";
  import pokeballImg from '$lib/Images/pokeball.png';
  import * as d3 from "d3";

  // Lijst van kaarten en de kaarten die getoond worden
  let expensiveCards = [];
  let displayedCards = [];
  let loading = true;
  let error = false;

  // Sorteeroptie
  let sortOption = "price";

  // Overlay voor D3 visualisatie
  let showOverlay = false;
  let svgContainer;

  // Functie die PriceMarket teruggeeft
  function handleCardsLoaded(event) {
    expensiveCards = event.detail.cards;
    error = expensiveCards.length === 0;
    sortCards(sortOption);
    loading = false;
  }

  // Sorteerfunctie
  function sortCards(option) {
    sortOption = option;

    if(option === "price") {
      displayedCards = [...expensiveCards].sort((a,b) => {
        const aPrice = a.tcgplayer?.prices?.normal?.market || 0;
        const bPrice = b.tcgplayer?.prices?.normal?.market || 0;
        return bPrice - aPrice; // Hoog naar laag
      });
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

  // Open overlay
  function openOverlay() {
    showOverlay = true;
    renderChart();
  }

  // Sluit overlay
  function closeOverlay() {
    showOverlay = false;
  }

  // Eenvoudige D3 bar chart
  function renderChart() {
    if(!displayedCards.length) return;

    const cardsWithPrice = displayedCards.filter(c => c.tcgplayer?.prices?.normal?.market);
    const data = cardsWithPrice.map(c => c.tcgplayer.prices.normal.market);
    const labels = cardsWithPrice.map(c => c.name);

    const width = 400;
    const height = 200;

    d3.select(svgContainer).selectAll("*").remove();

    const svg = d3.select(svgContainer)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);

    svg.selectAll("rect")
      .data(data)
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
</script>

<div class="binder-background">
  <h1>De Binder</h1>

  <!-- Knoppen -->
  <div class="controls">
    <button class="overlay-btn" on:click={openOverlay}>📊</button>
    <div class="sort-dropdown">
      <label for="sort">Sorteer op:</label>
      <select id="sort" bind:value={sortOption} on:change={() => sortCards(sortOption)}>
        <option value="price">Prijs: Hoog → Laag</option>
        <option value="rarity">Zeldzaamheid</option>
        <option value="name">Naam: A → Z</option>
      </select>
    </div>
  </div>

  <!-- PriceMarket component met caching en error handling -->
  <PriceMarket limit={9} on:cardsLoaded={handleCardsLoaded} />

  <!-- Kaarten grid -->
  {#if !loading && displayedCards.length > 0}
    <div class="binder-grid">
      {#each displayedCards as card}
        <Card {card} />
      {/each}
    </div>
  {:else if !loading && error}
    <p class="error">Kaarten konden niet geladen worden.</p>
  {/if}

  <!-- Overlay voor D3 -->
  {#if showOverlay}
    <div class="overlay">
      <button class="close-overlay" on:click={closeOverlay}>← Terug</button>
      <svg bind:this={svgContainer}></svg>
    </div>
  {/if}

  <!-- Pokéball navigatie altijd bovenaan -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
