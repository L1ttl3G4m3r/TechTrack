<script>
  export let data;
  let randomCard = data.card;
  let timeLeft = data.timeLeft;

  import { onMount, onDestroy } from "svelte";
  let dots = ".";

  let dotsInterval;

  onMount(() => {
    dotsInterval = setInterval(() => {
      if (dots === ".") dots = "..";
      else if (dots === "..") dots = "...";
      else dots = ".";
    }, 500);
  });

  onDestroy(() => {
    clearInterval(dotsInterval);
  });
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      {#if randomCard}
        <img src={randomCard.image} alt={randomCard.name} class="card-image" />
      {:else}
        <p>Een willekeurige kaart wordt geladen<span class="dots">{dots}</span></p>
      {/if}

      <button on:click={() => window.location.href='/binder'}>Begin</button>
      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
