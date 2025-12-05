<script>
  export let data;

  import BinderLogic from '../../components/BinderLogic.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  const { topCardsPage1 = [], topCardsPage2 = [] } = data;

  // Pokémon terms for tooltip
  const pokemonTerms = [
    { term: "set", description: "De reeks waar een kaart uitkomt, bijvoorbeeld 'Base Set' of 'Jungle'." },
    { term: "base", description: "De originele set van kaarten die in eerste instantie werden uitgebracht." },
    { term: "holo", description: "Een kaart met een glimmend oppervlak." },
    { term: "zeldzaamheid", description: "Geeft aan hoe zeldzaam een kaart is, van veel voorkomend tot zeer zeldzaam." },
    { term: "foil", description: "Een glimmende variant van een kaart, vaak verzamelbaar." },
    { term: "promo", description: "Speciale promotiekaarten die buiten reguliere sets vallen." },
    { term: "trainer", description: "Kaarten die gebruikt worden om je Pokémon te ondersteunen tijdens het spel." }
  ];

  let tooltipVisible = false;
  function toggleTooltip() {
    tooltipVisible = !tooltipVisible;
  }
</script>

<section class="binder-background">
  <header>
    <h1>Welkom bij de Pokémon Binder!</h1>
  </header>

  <article>
    <p>Hier kun je de duurste Pokémon kaarten bekijken.</p>
    <p>
      Wil je de prijsontwikkeling van deze kaarten zien? Klik dan op de 📊 knop
      om de grafieken te bekijken van de afgelopen 90 dagen.
    </p>
    <p>Klik op de ℹ️ knop om de betekenis te zien van alle Pokémon termen.</p>
  </article>

  <!-- BinderLogic with info button slot -->
  <section class="binder-logic-wrapper">
    <BinderLogic {topCardsPage1} {topCardsPage2}>
      <!-- Inject the ℹ️ info button via slot -->
      <button slot="info-button"
              aria-expanded={tooltipVisible}
              aria-controls="pokemon-terms"
              on:click={toggleTooltip}>
        ℹ️
      </button>
    </BinderLogic>

    <!-- Tooltip content -->
    <div id="pokemon-terms" hidden={!tooltipVisible} class="tooltip-content">
      <ul>
        {#each pokemonTerms as item (item.term)}
          <li><strong>{item.term}:</strong> {item.description}</li>
        {/each}
      </ul>
    </div>
  </section>

  <footer>
    <a href="/" class="pokeball-link" aria-label="Ga terug naar Home">
      <img src={pokeballImg} alt="Home" />
    </a>
  </footer>
</section>
