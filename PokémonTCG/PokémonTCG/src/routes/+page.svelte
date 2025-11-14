<script>
  export let data; // deze komt van load() in +page.server.js
  import RandomCard from "../components/RandomCard.svelte";
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      <!-- RandomCard component ontvangt de opgehaalde data -->
      <RandomCard {data} /> 

      <button on:click={() => window.location.href='/binder'}>Begin</button>
      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
