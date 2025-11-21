<script lang="ts">
  export let card: {
    id?: string;          // Optioneel: uniek ID van de kaart
    name: string;
    image: string;
    marketPrice?: number;
    rarity?: string;
    setName?: string;
  } | null = null;

  // Fallbackwaarden voor onbekende gegevens
  const UNKNOWN = "Onbekend";
  const NO_PRICE = "N/A";
</script>

{#if card}
  <!-- Semantische wrapper voor een enkele kaart -->
  <article aria-label={`Kaart: ${card.name}`}>
    
    <!-- Afbeelding van de kaart -->
    <figure>
      <img src={card.image} alt={card.name} />
      <figcaption>{card.name}</figcaption>
    </figure>

    <!-- Kaartdetails -->
    <section>
      <p><strong>Set:</strong> {card.setName || UNKNOWN}</p>
      <p><strong>Zeldzaamheid:</strong> {card.rarity || UNKNOWN}</p>
      <p><strong>Prijs:</strong> {card.marketPrice !== undefined ? `€${card.marketPrice.toFixed(2)}` : NO_PRICE}</p>
    </section>

  </article>
{:else}
  <p>Geen kaart beschikbaar.</p>
{/if}
