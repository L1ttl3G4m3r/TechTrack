<script>
  export let data;
  import RandomCard from "../components/RandomCard.svelte";
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      <RandomCard {data} /> 

      <button on:click={() => window.location.href='/uitleg'}>Begin</button>

      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
