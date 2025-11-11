<script>
  import BinderGrid from '$lib/components/BinderGrid.svelte';
  import BinderOverlay from '$lib/components/BinderOverlay.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  export let data;
  let topCards = data.topCards ?? [];
  let displayedCards = [...topCards];
  let sortOption = "price";
  let showOverlay = false;

  function sortCards(option) {
    sortOption = option;
    if(option === "price") {
      displayedCards = [...topCards].sort((a, b) => b.price - a.price);
    } else if(option === "rarity") {
      const rarityOrder = ["Common","Uncommon","Rare","Rare Holo","Ultra Rare","Secret Rare"];
      displayedCards = [...topCards].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity ?? "") ?? 99;
        const bIndex = rarityOrder.indexOf(b.rarity ?? "") ?? 99;
        return aIndex - bIndex;
      });
    } else if(option === "name") {
      displayedCards = [...topCards].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  function openOverlay() { showOverlay = true; }
  function closeOverlay() { showOverlay = false; }
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

  <!-- Kaarten grid -->
  <BinderGrid cards={displayedCards} />

  <!-- Overlay -->
  {#if showOverlay}
    <BinderOverlay cards={displayedCards} on:close={closeOverlay} />
  {/if}

  <!-- Pokéball link -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
