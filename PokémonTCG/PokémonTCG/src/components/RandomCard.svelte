<script>
  export let data;
  let randomCard = data?.card;     // Pak de kaart uit de data

  // -----------------------
  // Loading animatie (drie puntjes)
  // -----------------------
  let dots = ".";                   // Start met één punt
  let dotsInterval;                 // Interval ID voor de animatie

  import { onMount, onDestroy } from "svelte";

  onMount(() => {
    dotsInterval = setInterval(() => {
      // Wissel tussen "." ".." "..." 
      dots = dots === "..." ? "." : dots + ".";
    }, 500); // elke 500ms
  });

  // Stop interval bij destroy
  onDestroy(() => {
    clearInterval(dotsInterval);
  });
</script>

{#if randomCard}
  <!-- Als kaart beschikbaar is, toon afbeelding -->
  <article aria-label="Willekeurige Pokémon kaart">
    <img src={randomCard.image} alt="Random Pokémon" />
  </article>
{:else}
  <p>
    Een willekeurige kaart wordt geladen<span>{dots}</span>
  </p>
{/if}
