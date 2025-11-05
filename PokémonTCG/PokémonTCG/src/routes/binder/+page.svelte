<script>
  import Card from "$lib/components/Card.svelte";
  import PriceMarket from "$lib/components/PriceMarket.svelte";
  import pokeballImg from "$lib/Images/pokeball.png";
  import * as d3 from "d3";

  // Lijst van kaarten en de kaarten die getoond worden
  let expensiveCards = [];
  let displayedCards = [];
  let loading = true;

  // Sorteeroptie
  let sortOption = "price";

  // Overlay voor D3 visualisatie
  let showOverlay = false;
  let svgContainer;

  // Functie die PriceMarket teruggeeft
  function handleCardsLoaded(event) {
    expensiveCards = event.detail.cards;
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

    // Alleen kaarten met prijs
    const cardsWithPrice = displayedCards.filter(c => c.tcgplayer?.prices?.normal?.market);
    const data = cardsWithPrice.map(c => c.tcgplayer.prices.normal.market);
    const labels = cardsWithPrice.map(c => c.name);

    const width = 400;
    const height = 200;

    // Maak SVG leeg
    d3.select(svgContainer).selectAll("*").remove();

    const svg = d3.select(svgContainer)
      .attr("width", width)
      .attr("height", height);

    // Schalen
    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);

    // Bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(labels[i]))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d))
      .attr("fill", "#ffd700");

    // Optioneel: x-as labels
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
  <!-- Pokéball navigatie -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>

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

  <!-- PriceMarket component -->
  <PriceMarket limit={9} on:cardsLoaded={handleCardsLoaded} />

  <!-- Kaarten grid -->
  {#if !loading && displayedCards.length > 0}
    <div class="binder-grid">
      {#each displayedCards as card}
        <Card {card} />
      {/each}
    </div>
  {:else if !loading}
    <p class="error">Kaarten konden niet geladen worden.</p>
  {/if}

  <!-- Overlay voor D3 -->
  {#if showOverlay}
    <div class="overlay">
      <button class="close-overlay" on:click={closeOverlay}>← Terug</button>
      <svg bind:this={svgContainer}></svg>
    </div>
  {/if}
</div>

<style>
  :global(body) { margin:0; font-family: system-ui, sans-serif; background-color: #8b0000; }

  .binder-background {
    display: flex; flex-direction: column; align-items: center; padding: 2rem;
    min-height: 100vh; color:white; position: relative;
    background: linear-gradient(to right, #a30000 0%, #a30000 35%, #8b0000 35%, #8b0000 65%, #a30000 65%, #a30000 100%);
  }

  .pokeball-link { position:absolute; top:1rem; left:1rem; width:50px; height:50px; }
  .pokeball-link img { width:100%; height:100%; cursor:pointer; transition: transform 0.2s; }
  .pokeball-link img:hover { transform: scale(1.2); }

  h1 { font-size:3rem; text-shadow:0 0 10px #ffd700; margin-bottom:1rem; }

  .controls { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }

  .overlay-btn {
    background:#ffd700; border:none; padding:0.5rem 1rem; border-radius:0.5rem;
    font-size:1.2rem; cursor:pointer; font-weight:bold; box-shadow:0 0 5px #ffd700;
  }
  .overlay-btn:hover { background:#fff; }

  .sort-dropdown { display:flex; align-items:center; gap:0.5rem; }
  select { padding:0.4rem 0.6rem; border-radius:0.5rem; border:none; font-weight:bold; cursor:pointer; }

  .binder-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; justify-items:center; width:80%; margin-top:2rem; }

  .error { font-size:1.5rem; color:#ffd700; text-shadow:0 0 10px #b8860b; margin-top:2rem; }

  /* Overlay styling */
  .overlay {
    position:fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center;
    flex-direction:column; z-index:1000;
  }

  .close-overlay {
    position:absolute; top:1rem; left:1rem; background:#ffd700; border:none; padding:0.5rem 1rem; border-radius:0.5rem; cursor:pointer;
    font-weight:bold; box-shadow:0 0 5px #ffd700;
  }
  .close-overlay:hover { background:#fff; }

  svg { width:400px; height:200px; }
</style>
