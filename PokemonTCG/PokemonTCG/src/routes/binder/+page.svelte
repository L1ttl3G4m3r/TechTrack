<script>
  export let data;

  import BinderLogic from '../../components/BinderLogic.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  const { topCardsPage1 = [], topCardsPage2 = [] } = data;

  const pokemonTerms = [
    { term: "set", description: "De reeks waar een kaart uitkomt, bijvoorbeeld 'Base Set' of 'Jungle'." },
    { term: "base", description: "De originele set van kaarten die in eerste instantie werden uitgebracht." },
    { term: "holo", description: "Een kaart met een glimmend oppervlak." },
    { term: "zeldzaamheid", description: "Geeft aan hoe zeldzaam een kaart is, van veel voorkomend tot zeer zeldzaam." },
    { term: "foil", description: "Een glimmende variant van een kaart, vaak verzamelbaar." },
    { term: "promo", description: "Speciale promotiekaarten die buiten reguliere sets vallen." },
    { term: "trainer", description: "Kaarten die gebruikt worden om je Pokémon te ondersteunen tijdens het spel." }
  ];

  // Bind dit aan hidden attribuut voor toggling
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
    <p>
      Hier kun je de duurste Pokémon kaarten bekijken.<br><br>
      Wil je de prijsontwikkeling van deze kaarten zien?<br>
      Klik dan op de 📊 knop om de grafieken te bekijken van de afgelopen 90 dagen.<br><br>
      Klik op de ℹ️ knop om de betekenis te zien van alle Pokémon termen.<br><br>
    </p>

    <div>
      <button aria-label="Pokémon termen uitleg" on:click={toggleTooltip}>
        ℹ️
      </button>

      <!-- Tooltip staat altijd in DOM, toggle via hidden -->
      <div hidden={!tooltipVisible}>
        <ul>
          {#each pokemonTerms as item (item.term)}
            <li><strong>{item.term}:</strong> {item.description}</li>
          {/each}
        </ul>
      </div>
    </div>
  </article>

  <br>
  <section>
    <BinderLogic {topCardsPage1} {topCardsPage2} />
  </section>

  <footer>
    <a href="/" class="pokeball-link" aria-label="Ga terug naar Home">
      <img src={pokeballImg} alt="Home" />
    </a>
  </footer>
</section>
