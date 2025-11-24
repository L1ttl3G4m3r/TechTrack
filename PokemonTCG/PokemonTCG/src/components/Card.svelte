<script>
    /* ---------------------------------------------------------
       PROP DEFINITIE
       ---------------------------------------------------------
       De kaart die wordt doorgegeven aan dit component.
       Kan null zijn als er geen kaart beschikbaar is.
    --------------------------------------------------------- */
    export let card = null;

    /* ---------------------------------------------------------
       CONSTANTEN
       ---------------------------------------------------------
       Standaardwaarden voor onbekende velden
    --------------------------------------------------------- */
    const UNKNOWN_VALUE = "Onbekend";
    const UNKNOWN_PRICE = "N/A";

    /* ---------------------------------------------------------
       FUNCTIES
       ---------------------------------------------------------
       Formatteer de prijs, met fallback
    --------------------------------------------------------- */
    function formatPrice(value) {
        if (value === undefined || value === null) {
            return UNKNOWN_PRICE;
        }
        return "€" + value.toFixed(2);
    }

    /* ---------------------------------------------------------
       Haal een veilige stringwaarde op, met fallback
    --------------------------------------------------------- */
    function getSafeValue(value) {
        if (!value || value.trim() === "") {
            return UNKNOWN_VALUE;
        }
        return value;
    }
</script>

{#if card}
<!-- Semantische wrapper voor een enkele kaart -->
<article class="card-detail" aria-label={"Kaartinformatie: " + card.name}>
    <!-- Afbeelding en naam van de kaart -->
    <figure class="card-detail__figure">
        <img 
            class="card-detail__image" 
            src={card.image} 
            alt={"Afbeelding van de kaart " + card.name} 
        />
        <figcaption class="card-detail__caption">
            {card.name}
        </figcaption>
    </figure>

    <!-- Kaartdetails -->
    <section class="card-detail__info">
        <p class="card-detail__attribute">
            <strong class="card-detail__label">Set:</strong>
            <span class="card-detail__value">{getSafeValue(card.setName)}</span>
        </p>
        <p class="card-detail__attribute">
            <strong class="card-detail__label">Zeldzaamheid:</strong>
            <span class="card-detail__value">{getSafeValue(card.rarity)}</span>
        </p>
        <p class="card-detail__attribute">
            <strong class="card-detail__label">Prijs:</strong>
            <span class="card-detail__value">{formatPrice(card.marketPrice)}</span>
        </p>
    </section>
</article>
{:else}
<!-- Fallback indien geen kaart aanwezig -->
<p class="card-detail--empty">
    Geen kaart beschikbaar.
</p>
{/if}
