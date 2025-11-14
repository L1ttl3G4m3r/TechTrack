<script lang="ts">
  export let card: {
    id?: string;
    name: string;
    image: string;
    price?: number;
    rarity?: string;
    setName?: string;
  } | null = null;
</script>

{#if card}
  <div class="card-container">
    <img src={card.image} alt={card.name} />
    <h2>{card.name}</h2>
    <p>Set: {card.setName || "Onbekend"}</p>
    <p>Zeldzaamheid: {card.rarity || "Onbekend"}</p>
    <p>Prijs: {card.price ? `$${card.price.toFixed(2)}` : "N/A"}</p>
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
