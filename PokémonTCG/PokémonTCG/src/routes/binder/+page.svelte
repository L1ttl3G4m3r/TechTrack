<script>
  import Card from "$lib/components/Card.svelte";
  import pokeballImg from '$lib/Images/pokeball.png';
  import * as d3 from "d3";

  export let data;

  // Server-side data van +page.server.js
  let topCards = data.topCards ?? [];
  let displayedCards = [...topCards];

  let sortOption = "price";
  let showOverlay = false;
  let svgContainer;

  // Sorteerfunctie: prijs, zeldzaamheid, naam
  function sortCards(option) {
    sortOption = option;

    if (option === "price") {
      displayedCards = [...topCards].sort((a, b) => b.price - a.price);
    } else if (option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...topCards].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity ?? "") !== -1 ? rarityOrder.indexOf(a.rarity ?? "") : 99;
        const bIndex = rarityOrder.indexOf(b.rarity ?? "") !== -1 ? rarityOrder.indexOf(b.rarity ?? "") : 99;
        return aIndex - bIndex;
      });
    } else if (option === "name") {
      displayedCards = [...topCards].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // Overlay functies (D3 bubble chart)
  function openOverlay() {
    showOverlay = true;
    renderChart();
  }

  function closeOverlay() {
    showOverlay = false;
  }

  function renderChart() {
    if (!displayedCards.length) return;

    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(displayedCards, d => d.price)])
      .range([50, width - 50]);

    const y = d3.scaleLinear()
      .domain([0, displayedCards.length - 1])
      .range([50, height - 50]);

    const r = d3.scaleSqrt()
      .domain([0, d3.max(displayedCards, d => d.price)])
      .range([10, 40]);

    // Bubble chart
    svg.selectAll("circle")
      .data(displayedCards)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => x(d.price))
      .attr("cy", (d, i) => y(i))
      .attr("r", d => r(d.price))
      .attr("fill", "#ffcb05")
      .attr("stroke", "#3b4cca")
      .attr("stroke-width", 2);

    // Optioneel: naam labels boven de cirkels
    svg.selectAll("text")
      .data(displayedCards)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("x", (d, i) => x(d.price))
      .attr("y", (d, i) => y(i) - r(d.price) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white");
  }
</script>

<div class="binder-background">
  <h1>De Binder</h1>

  <!-- Controls -->
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

  <!-- Kaarten grid 3x3 -->
  {#if displayedCards.length > 0}
    <div class="binder-grid">
      {#each displayedCards as card}
        <div class="card">
          <img src={card.image} alt={card.name} />
          <h3>{card.name}</h3>
          <p>{card.setName} | {card.rarity}</p>
          <p>€{card.price}</p>
        </div>
      {/each}
    </div>
  {:else}
    <p>Kaarten konden niet geladen worden.</p>
  {/if}

  <!-- Overlay -->
  {#if showOverlay}
    <div class="overlay">
      <button class="close-overlay" on:click={closeOverlay}>← Terug</button>
      <svg bind:this={svgContainer}></svg>
    </div>
  {/if}

  <!-- Pokéball link naar homepage -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
