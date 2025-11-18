<script>
  import BinderGrid from './BinderGrid.svelte';
  import BinderOverlay from './BinderOverlay.svelte';

  // Exporteer props voor kaarten op pagina 1 en 2
  export let topCardsPage1 = [];
  export let topCardsPage2 = [];

  // Huidige pagina en kaarten die getoond worden
  let currentPage = 1;
  let displayedCards = [...topCardsPage1];

  let sortOption = "marketPrice";

  // Overlay zichtbaar of niet
  let showOverlay = false;

  /**
   * Sorteer de kaarten op basis van de gekozen optie
   * @param {string} option - Sorteeroptie
   */
  function sortCards(option) {
    sortOption = option;

    // Kies kaarten van de huidige pagina
    const cards = currentPage === 1 ? topCardsPage1 : topCardsPage2;

    // Sorteer op basis van gekozen optie
    if (option === "marketPrice") {
      displayedCards = [...cards].sort(
        (a, b) => (b.marketPrice ?? 0) - (a.marketPrice ?? 0)
      );
    } else if (option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...cards].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity ?? "") ?? 99;
        const bIndex = rarityOrder.indexOf(b.rarity ?? "") ?? 99;
        return aIndex - bIndex;
      });
    } else if (option === "name") {
      displayedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /** Toon overlay */
  function openOverlay() { showOverlay = true; }

  /** Sluit overlay */
  function closeOverlay() { showOverlay = false; }

  /**
   * Ga naar een andere pagina
   * @param {number} page - Paginanummer (1 of 2)
   */
  function goToPage(page) {
    if (page < 1 || page > 2) return; // Beperk tot pagina 1 of 2
    currentPage = page;
    displayedCards = page === 1 ? [...topCardsPage1] : [...topCardsPage2];
    sortCards(sortOption); // Zorg dat sortering behouden blijft
  }

  // Automatisch sorteren bij laden of als sortOption verandert
  $: sortCards(sortOption);
</script>

<div class="binder-logic">
  <!-- Controls: overlay knop en sort dropdown -->
  <div class="controls">
    <!-- Overlay knop -->
    <button class="overlay-btn" on:click={openOverlay}>📊</button>

    <!-- Sort dropdown -->
    <div class="sort-dropdown">
      <label for="sort">Sorteer op:</label>
      <select
        id="sort"
        bind:value={sortOption}
        on:change={() => sortCards(sortOption)}
      >
        <option value="marketPrice">Prijs: Hoog → Laag</option>
        <option value="rarity">Zeldzaamheid</option>
        <option value="name">Naam: A → Z</option>
      </select>
    </div>
  </div>

  <!-- Grid van kaarten -->
  <BinderGrid cards={displayedCards} />

  <!-- Overlay component, alleen zichtbaar als showOverlay true is -->
  {#if showOverlay}
    <BinderOverlay cards={displayedCards} onClose={closeOverlay} />
  {/if}

  <!-- Paginering -->
  <div class="pagination">
    <button
      class="arrow"
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      ◀
    </button>

    <span class="page-number">{currentPage} / 2</span>

    <button
      class="arrow"
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === 2}
    >
      ▶
    </button>
  </div>
</div>
