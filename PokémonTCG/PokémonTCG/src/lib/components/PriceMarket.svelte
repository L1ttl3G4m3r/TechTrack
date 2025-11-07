<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let limit = 9;

  const CACHE_KEY = "priceMarketCache";
  const CACHE_DURATION = 60 * 60 * 1000; // 1 uur in ms

  let cards = [];
  let loading = true;
  let timeLeft = 0;
  let interval;

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  async function fetchTopCards() {
    try {
      const response = await fetch(
        `https://www.pokemonpricetracker.com/api/v2/cards?sortBy=price&sortOrder=desc&limit=${limit}`
      );

      const data = await response.json();

      cards = (data.data || []).map(c => ({
        id: c.id || c.tcgPlayerId,
        name: c.name,
        image: c.imageUrl,
        setName: c.setName,
        rarity: c.rarity || "Onbekend",
        price: Number(c.marketPrice || c.price || 0)
      }));

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ cards, timestamp: Date.now() })
      );

      dispatch("cardsLoaded", { cards, timeLeft: CACHE_DURATION });
      startTimer(CACHE_DURATION);
    } catch (err) {
      console.error("Fout bij ophalen kaarten:", err);
    } finally {
      loading = false;
    }
  }

  function startTimer(initialTime) {
    clearInterval(interval);
    timeLeft = initialTime;

    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1000;
      } else {
        fetchTopCards();
      }
    }, 1000);
  }

  onMount(() => {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      cards = cached.cards;
      loading = false;
      const remaining = CACHE_DURATION - (now - cached.timestamp);
      dispatch("cardsLoaded", { cards, timeLeft: remaining });
      startTimer(remaining);
    } else {
      fetchTopCards();
    }

    return () => clearInterval(interval);
  });
</script>

{#if loading}
  <p class="loading">Kaarten worden geladen...</p>
{:else}
  <p class="loading">Nieuwe data over {formatTime(timeLeft)}</p>
{/if}

<style>
  .loading {
    color: white;
    font-weight: bold;
    text-shadow: 0 0 10px #ffd700;
  }
</style>
