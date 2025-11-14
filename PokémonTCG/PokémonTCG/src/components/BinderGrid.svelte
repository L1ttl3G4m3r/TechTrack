<script>
  import Card from './Card.svelte';
  export let cards = [];
</script>

{#if cards.length > 0}
  <div class="binder-grid">
    {#each cards as card}
      <Card {card} />
    {/each}
  </div>
{:else}
  <p>Kaarten konden niet geladen worden.</p>
{/if}
