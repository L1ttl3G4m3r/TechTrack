<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let limit = 9; // aantal kaarten dat we terug willen sturen

  let cards = [];
  let loading = true;

  async function fetchTopCards() {
    try {
      // Haal een set kaarten op (bijv. eerste 100 kaarten)
      const response = await fetch("https://api.pokemontcg.io/v2/cards?pageSize=100&page=1");
      const data = await response.json();

      // Filter kaarten die een marktprijs hebben
      const cardsWithPrice = data.data.filter(c => c.tcgplayer?.prices?.normal?.market);

      // Sorteer op hoogste prijs
      cardsWithPrice.sort((a, b) => b.tcgplayer.prices.normal.market - a.tcgplayer.prices.normal.market);

      // Neem de eerste 'limit' kaarten
      cards = cardsWithPrice.slice(0, limit);

      // Stuur de kaarten door naar de parent component
      dispatch("cardsLoaded", { cards });
    } catch (err) {
      console.error("Kon kaarten niet laden:", err);
    } finally {
      loading = false;
    }
  }

  onMount(fetchTopCards);
</script>

{#if loading}
  <p class="loading">Kaarten worden geladen...</p>
{/if}

<style>
  .loading {
    color: white;
    font-weight: bold;
    text-shadow: 0 0 10px #ffd700;
  }
</style>
