<script>
  export let data;
  let randomCard = data?.card;
  let dots = ".";
  let dotsInterval;

  import { onMount, onDestroy } from "svelte";

  onMount(() => {
    dotsInterval = setInterval(() => {
      dots = dots === "..." ? "." : dots + ".";
    }, 500);
  });

  onDestroy(() => {
    clearInterval(dotsInterval);
  });
</script>

{#if randomCard}
  <div>
    <div></div>
    <img src={randomCard.image} alt="Random Pokémon" />
  </div>
{:else}
  <p>
    Een willekeurige kaart wordt geladen<span class="dots">{dots}</span>
  </p>
{/if}
