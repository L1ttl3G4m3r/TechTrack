<script lang="ts">
  export let card: {
    id?: string;
    name: string;
    image: string;
    marketPrice?: number;
    rarity?: string;
    setName?: string;
  } | null = null;
</script>

{#if card}
  <div class="card">
    <div></div>
    <img src={card.image} alt={card.name} />
    <h2>{card.name}</h2>
    <p>Set: {card.setName || "Onbekend"}</p>
    <p>Zeldzaamheid: {card.rarity || "Onbekend"}</p>
    <p>Prijs: {card.marketPrice ? `$${card.marketPrice.toFixed(2)}` : "N/A"}</p>
  </div>
{:else}
  <p>No card available.</p>
{/if}
