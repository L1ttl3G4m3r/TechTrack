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
  <img src={randomCard.image} alt={randomCard.setName} class="card-image" />
{:else}
  <p>Een willekeurige kaart wordt geladen<span class="dots">{dots}</span></p>
{/if}
