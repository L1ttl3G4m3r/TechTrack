<script lang="ts">
  export let card: { name: string; images: { large: string }; tcgplayer?: { prices?: any } } | null = null;
</script>

{#if card}
  <div class="card-container">
    <img src={card.images.large} alt={card.name} />
    <h2>{card.name}</h2>
    {#if card.tcgplayer?.prices?.normal?.market}
      <p>Price: ${card.tcgplayer.prices.normal.market}</p>
    {:else}
      <p>Price: N/A</p>
    {/if}
  </div>
{:else}
  <p>No card available.</p>
{/if}

<style>
  .card-container {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    display: inline-block;
    background: #f8f9fa;
  }

  img {
    max-width: 200px;
    border-radius: 8px;
  }

  h2 {
    margin: 0.5rem 0;
  }

  p {
    font-weight: bold;
    margin: 0.25rem 0;
  }
</style>
