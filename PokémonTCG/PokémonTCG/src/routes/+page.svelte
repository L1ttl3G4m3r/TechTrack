<script>
  import { onMount } from "svelte";

  let randomCard = null;
  let dots = "."; // voor de puntjes animatie

  const CACHE_KEY = "randomCardData";
  const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 uur in milliseconden

  async function fetchRandomCard() {
    try {
      // Eerst totale aantal kaarten ophalen
      const metaResp = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=1`);
      const metaData = await metaResp.json();
      const totalCards = metaData.totalCount;

      // Kies een random index
      const pageSize = 1;
      const randomIndex = Math.floor(Math.random() * totalCards);
      const page = Math.floor(randomIndex / pageSize) + 1;

      // Haal de kaart op van de random pagina
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${page}`
      );
      const data = await response.json();
      const card = data.data[0];

      if (card && card.images?.large) {
        randomCard = card;
        // Opslaan in localStorage met timestamp
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          card: randomCard,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error("Kan kaart niet laden:", err);
    }
  }

  onMount(() => {
    // Check cache
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      randomCard = cachedData.card;
    } else {
      fetchRandomCard();
    }

    // Animatie voor de puntjes
    const interval = setInterval(() => {
      if (dots === ".") dots = "..";
      else if (dots === "..") dots = "...";
      else dots = ".";
    }, 500);

    return () => clearInterval(interval);
  });
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      {#if randomCard}
        <img src={randomCard.images.large} alt="Pokémon kaart" class="card-image" />
      {:else}
        <p>Een willekeurige kaart wordt geladen<span class="dots">{dots}</span></p>
      {/if}

      <button on:click={() => window.location.href='/binder'}>Begin</button>
      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
