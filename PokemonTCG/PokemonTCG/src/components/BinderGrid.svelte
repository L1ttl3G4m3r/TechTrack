<script>
  import Card from './Card.svelte';
  export let cards = [];

  /* Functie om te controleren of er kaarten beschikbaar zijn */
  function hasCards() {
    return cards && cards.length > 0;
  }
</script>

<!-- Controleer of er kaarten beschikbaar zijn -->
{#if hasCards()}
  <div class="binder-grid" role="list">
    <!-- Loop over elke kaart en render de Card component -->
    {#each cards as card, index}
      <Card card={card} key={index} />
    {/each}
  </div>
{:else}
  <p>Kaarten konden niet geladen worden.</p>
{/if}
