<script lang="ts">
  import * as d3 from "d3";
  import Card from '$lib/components/Card.svelte';

  function goToCollection() {
    window.location.href = "/collection";
  }
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon TCG Dashboard</h1>
      <p>Verzamel, analyseer en visualiseer je kaarten</p>
      <button on:click={goToCollection}>Ga naar mijn collectie</button>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    background-color: #8b0000;
    font-family: system-ui, sans-serif;
  }

  /* Achtergrond vult volledig scherm */
  .background {
    display: grid;
    place-items: center;
    min-height: 100vh;
    background-color: #8b0000; /* effen rood */
  }

  /* Goud-glanzende kaartbox */
  .card {
    position: relative;
    padding: 3rem;
    border-radius: 2rem;
    background: rgba(139, 0, 0, 0.6);
    border: 6px solid #ffd700;
    box-shadow: 0 0 30px #ffd700;
  }

  /* Gouden glow laag */
  .glow {
    position: absolute;
    inset: 0;
    border-radius: 2rem;
    border: 6px solid #ffea00;
    animation: glowPulse 3s ease-in-out infinite alternate;
    pointer-events: none;
  }

  /* Alle tekst gecentreerd en wit */
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

  /* Glow-animatie */
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
