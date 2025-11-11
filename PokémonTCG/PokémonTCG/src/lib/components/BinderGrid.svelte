<script>
  export let cards = [];
</script>

{#if cards.length > 0}
  <div class="binder-grid">
    {#each cards as card}
      <div class="card">
        <img src={card.image} alt={card.name} />
        <h3>{card.name}</h3>
        <p>{card.setName} | {card.rarity}</p>
        <p>€{card.price}</p>
      </div>
    {/each}
  </div>
{:else}
  <p>Kaarten konden niet geladen worden.</p>
{/if}
