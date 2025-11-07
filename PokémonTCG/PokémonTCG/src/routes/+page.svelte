<script>
  export let data;
  let randomCard = data.card;
  let timeLeft = data.timeLeft;

  import { onMount, onDestroy } from "svelte";
  let dots = ".";

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  let dotsInterval;
  let timerInterval;

  onMount(() => {
    dotsInterval = setInterval(() => {
      if (dots === ".") dots = "..";
      else if (dots === "..") dots = "...";
      else dots = ".";
    }, 500);

    timerInterval = setInterval(() => {
      if (timeLeft > 0) timeLeft -= 1000;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(dotsInterval);
    clearInterval(timerInterval);
  });
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      {#if randomCard}
        <img src={randomCard.image} alt="Pokémon kaart" class="card-image" />
        <p>{randomCard.setName}</p>
        <p>Huidige prijs: ${randomCard.price}</p>
        <p>Nieuwe kaart over: {formatTime(timeLeft)}<span class="dots">{dots}</span></p>
      {:else}
        <p>Een willekeurige kaart wordt geladen<span class="dots">{dots}</span></p>
      {/if}

      <button on:click={() => window.location.href='/binder'}>Begin</button>
      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
