<script>
  import BinderGrid from '$lib/components/BinderGrid.svelte';
  import BinderOverlay from '$lib/components/BinderOverlay.svelte';

  export let topCardsPage1 = [];
  export let topCardsPage2 = [];

  let currentPage = 1;
  let displayedCards = [...topCardsPage1];
  let sortOption = "price";
  let showOverlay = false;

  // Sorteerfunctie
  function sortCards(option) {
    sortOption = option;
    const cards = currentPage === 1 ? topCardsPage1 : topCardsPage2;

    if(option === "price") {
      displayedCards = [...cards].sort((a, b) => b.price - a.price);
    } else if(option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...cards].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity ?? "") ?? 99;
        const bIndex = rarityOrder.indexOf(b.rarity ?? "") ?? 99;
        return aIndex - bIndex;
      });
    } else if(option === "name") {
      displayedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // Overlay functies
  function openOverlay() { showOverlay = true; }
  function closeOverlay() { showOverlay = false; }

  // Paginering
  function goToPage(page) {
    if(page < 1 || page > 2) return;
    currentPage = page;
    displayedCards = page === 1 ? [...topCardsPage1] : [...topCardsPage2];
    sortCards(sortOption);
  }
</script>

<div class="binder-logic">
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

  <!-- Kaarten grid -->
  <BinderGrid cards={displayedCards} />

  <!-- Overlay -->
  {#if showOverlay}
    <BinderOverlay cards={displayedCards} on:close={closeOverlay} />
  {/if}

  <!-- Paginering -->
  <div class="pagination">
    <button class="arrow" on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀</button>
    <span class="page-number">{currentPage} / 2</span>
    <button class="arrow" on:click={() => goToPage(currentPage + 1)} disabled={currentPage === 2}>▶</button>
  </div>
</div>