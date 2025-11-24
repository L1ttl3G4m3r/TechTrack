<script>
  import BinderGrid from './BinderGrid.svelte';
  import BinderOverlay from './BinderOverlay.svelte';

  // Kaarten van pagina 1 en 2
  export let topCardsPage1 = [];
  export let topCardsPage2 = [];

  // Huidige pagina en getoonde kaarten
  let currentPage = 1;
  let displayedCards = topCardsPage1.slice();

  // Huidige sorteermethode
  let sortOption = "marketPrice";

  // Overlay zichtbaar of niet
  let showOverlay = false;

  // Sorteer de weergegeven kaarten op basis van de gekozen optie
  function sortCards(option) {
    sortOption = option;

    let cardsToSort = currentPage === 1 ? topCardsPage1 : topCardsPage2;

    if (option === "marketPrice") {
      displayedCards = cardsToSort.slice().sort(sortByMarketPrice);
    } else if (option === "rarity") {
      displayedCards = cardsToSort.slice().sort(sortByRarity);
    } else if (option === "name") {
      displayedCards = cardsToSort.slice().sort(sortByName);
    }
  }

  // Sorteerfunctie op marktprijs (hoog → laag)
  function sortByMarketPrice(a, b) {
    return (b.marketPrice || 0) - (a.marketPrice || 0);
  }

  // Sorteerfunctie op zeldzaamheid
  function sortByRarity(a, b) {
    const order = ["Common", "Uncommon", "Rare", "Rare Holo", "Ultra Rare", "Secret Rare"];
    let indexA = order.indexOf(a.rarity || "");
    let indexB = order.indexOf(b.rarity || "");
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  }

  // Sorteerfunctie op naam (A → Z)
  function sortByName(a, b) {
    return (a.name || "").localeCompare(b.name || "");
  }

  // Overlay tonen
  function openOverlay() {
    showOverlay = true;
  }

  // Overlay sluiten
  function closeOverlay() {
    showOverlay = false;
  }

  // Ga naar een andere pagina (1 of 2)
  function goToPage(page) {
    if (page < 1 || page > 2) return;

    currentPage = page;
    displayedCards = page === 1 ? topCardsPage1.slice() : topCardsPage2.slice();
    sortCards(sortOption);
  }

  // Zorg dat kaarten automatisch gesorteerd worden bij laden of als sortOption verandert
  $: sortCards(sortOption);
</script>

<div class="binder-logic">
  <!-- Controls: overlay knop en sort dropdown -->
  <div class="controls">
    <button class="overlay-btn" on:click={openOverlay} aria-label="Toon overlay">📊</button>

    <div class="sort-dropdown">
      <label for="sort">Sorteer op:</label>
      <select id="sort" bind:value={sortOption} on:change={() => sortCards(sortOption)}>
        <option value="marketPrice">Prijs: Hoog → Laag</option>
        <option value="rarity">Zeldzaamheid</option>
        <option value="name">Naam: A → Z</option>
      </select>
    </div>
  </div>

  <!-- Grid van kaarten -->
  <BinderGrid cards={displayedCards} />

  <!-- Overlay tonen als showOverlay true is -->
  {#if showOverlay}
    <BinderOverlay cards={displayedCards} onClose={closeOverlay} />
  {/if}

  <!-- Paginering -->
  <div class="pagination" role="navigation" aria-label="Paginering">
    <button class="arrow" on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Vorige pagina">◀</button>
    <span class="page-number">{currentPage} / 2</span>
    <button class="arrow" on:click={() => goToPage(currentPage + 1)} disabled={currentPage === 2} aria-label="Volgende pagina">▶</button>
  </div>
</div>
