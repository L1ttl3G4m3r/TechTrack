<script>
  import Card from "$lib/components/Card.svelte";
  import PriceMarket from "$lib/components/PriceMarket.svelte";
  import pokeballImg from '$lib/Images/pokeball.png';
  import * as d3 from "d3";

  let expensiveCards = [];
  let displayedCards = [];
  let loading = true;
  let error = false;

  let sortOption = "price";
  let showOverlay = false;
  let svgContainer;
  let timeLeft = 0;

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Ontvang kaarten van PriceMarket
  function handleCardsLoaded(event) {
    expensiveCards = event.detail.cards;
    timeLeft = event.detail.timeLeft;
    error = expensiveCards.length === 0;
    sortCards(sortOption);
    loading = false;
  }

  // Sorteerfunctie
  function sortCards(option) {
    sortOption = option;

    if (option === "price") {
      displayedCards = [...expensiveCards].sort((a, b) => b.price - a.price);
    } else if (option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...expensiveCards].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity);
        const bIndex = rarityOrder.indexOf(b.rarity);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      });
    } else if (option === "name") {
      displayedCards = [...expensiveCards].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // Overlay functies
  function openOverlay() {
    showOverlay = true;
    renderChart();
  }

  function closeOverlay() {
    showOverlay = false;
  }

  function renderChart() {
    if (!displayedCards.length) return;

    const data = displayedCards.map(c => c.price);
    const labels = displayedCards.map(c => c.name);

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
      .attr("x", d => x(d) + x.bandwidth() / 2)
      .attr("y", height + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white");
  }
</script>

<div class="binder-background">
  <h1>De Binder</h1>

  <!-- Timer -->
  <p>Nieuwe data over {formatTime(timeLeft)}</p>

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

  <!-- PriceMarket haalt kaarten op -->
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
  {:else}
    <p>Kaarten worden geladen...</p>
  {/if}

  {#if showOverlay}
    <div class="overlay">
      <button class="close-overlay" on:click={closeOverlay}>← Terug</button>
      <svg bind:this={svgContainer}></svg>
    </div>
  {/if}

  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
