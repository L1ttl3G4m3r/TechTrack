<script>
  export let data;

  import BinderLogic from '../../components/BinderLogic.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  // Data is al klaar voor gebruik
  const { topCardsPage1 = [], topCardsPage2 = [] } = data;
</script>

<div class="binder-background">
  <h1>Welkom bij de Pokémon Binder!</h1>
  <p>
    Hier kun je de duurste Pokémon kaarten bekijken.<br><br>
    Wil je de prijsontwikkeling van deze kaarten zien?<br>
    Klik dan op de 📊 knop om de grafieken te bekijken van de afgelopen 90 dagen.<br><br>
  </p>

  <BinderLogic {topCardsPage1} {topCardsPage2} />

  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
