<script>
  import Card from './Card.svelte';

  // Exporteer de 'cards' prop zodat deze van buitenaf kan worden doorgegeven
  export let cards = [];
</script>

<!-- Controleer of er kaarten beschikbaar zijn -->
{#if cards.length > 0}
  <div class="binder-grid">
    <!-- Loop over elke kaart in de 'cards' array -->
    {#each cards as card}
      <Card {card} />
    {/each}
  </div>
{:else}
  <p>Kaarten konden niet geladen worden.</p>
{/if}
