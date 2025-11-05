<script>
  import { onMount } from "svelte";

  let randomCard = null;
  let dots = "."; // voor de puntjes animatie

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
      }
    } catch (err) {
      console.error("Kan kaart niet laden:", err);
    }
  }

  function goToCollection() {
    window.location.href = "/collection";
  }

  onMount(() => {
    fetchRandomCard();

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
        <!-- Alleen de afbeelding -->
        <img src={randomCard.images.large} alt="Pokémon kaart" class="card-image" />
      {:else}
        <p>Een willekeurige kaart wordt geladen<span class="dots">{dots}</span></p>
      {/if}

      <button on:click={goToCollection}>Begin</button>
      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    background-color: #8b0000;
    font-family: system-ui, sans-serif;
  }

  .background {
    display: grid;
    place-items: center;
    min-height: 100vh;
  }

  .card {
    position: relative;
    padding: 3rem;
    border-radius: 2rem;
    background: rgba(139, 0, 0, 0.6);
    border: 6px solid #ffd700;
    box-shadow: 0 0 30px #ffd700;
  }

  .glow {
    position: absolute;
    inset: 0;
    border-radius: 2rem;
    border: 6px solid #ffea00;
    animation: glowPulse 3s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .text-content {
    display: grid;
    place-items: center;
    text-align: center;
    color: white;
    gap: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .text-content h1 {
    font-size: 3rem;
    font-weight: bold;
    text-shadow: 0 0 10px #ffd700;
    margin: 0;
  }

  .text-content p {
    font-size: 1.5rem;
    text-shadow: 0 0 10px #ffd700;
    margin: 0;
  }

  .text-content #copyright {
    font-size: 1rem;
    text-shadow: 0 0 10px #ffd700;
    margin: 0;
  }

  .dots {
    margin-left: 0.5rem;
    display: inline-block;
    min-width: 1.5rem;
  }

  .text-content button {
    background-color: white;
    color: #b00000;
    font-weight: 600;
    font-size: 1rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px #ffd700;
  }

  .text-content button:hover {
    background-color: #ffd700;
    color: black;
  }

  .card-image {
    max-width: 150px;   /* kleinere kaart */
    max-height: 220px;
    border-radius: 8px;
  }

  @keyframes glowPulse {
    0% {
      box-shadow: 0 0 20px #ffd700, 0 0 40px #ffea00;
      opacity: 0.9;
    }
    50% {
      box-shadow: 0 0 40px #ffe066, 0 0 80px #ffea00;
      opacity: 1;
    }
    100% {
      box-shadow: 0 0 20px #ffd700, 0 0 40px #ffea00;
      opacity: 0.9;
    }
  }
</style>
