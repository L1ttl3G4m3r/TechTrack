<script>
  import BinderGrid from '$lib/components/BinderGrid.svelte';
  import BinderOverlay from '$lib/components/BinderOverlay.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  export let data;
  let topCardsPage1 = data.topCardsPage1 ?? [];
  let topCardsPage2 = data.topCardsPage2 ?? [];
  let currentPage = 1;

  let displayedCards = [...topCardsPage1];
  let sortOption = "price";
  let showOverlay = false;

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

  function openOverlay() { showOverlay = true; }
  function closeOverlay() { showOverlay = false; }

  function goToPage(page) {
    if(page < 1 || page > 2) return;
    currentPage = page;
    displayedCards = page === 1 ? [...topCardsPage1] : [...topCardsPage2];
    sortCards(sortOption);
  }
</script>

<div class="binder-background">
  <h1>De Binder</h1>

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

  <BinderGrid cards={displayedCards} />

  {#if showOverlay}
    <BinderOverlay cards={displayedCards} on:close={closeOverlay} />
  {/if}

  <!-- Paginering onderaan -->
  <div class="pagination">
    <button class="arrow" on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀</button>
    <span class="page-number">{currentPage} / 2</span>
    <button class="arrow" on:click={() => goToPage(currentPage + 1)} disabled={currentPage === 2}>▶</button>
  </div>

  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
