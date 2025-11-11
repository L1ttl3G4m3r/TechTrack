<script>
  import BinderLogic from '$lib/components/BinderLogic.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  export let data;

  // Data ophalen vanuit load function
  let topCardsPage1 = data.topCardsPage1 ?? [];
  let topCardsPage2 = data.topCardsPage2 ?? [];
</script>

<div class="binder-background">
  <!-- Statistische content -->
  <h1>Welkom bij de Pokémon Binder!</h1>
  <p>Hier kun je de duurste Pokémon kaarten bekijken.<br><br>
    Wil je de geschiedenis en statistieken bijhouden van jouw duurste kaarten?<br>
    Klik dan op de 📊 knop voor alle duidelijke info.<br><br></p>

  <!-- BinderLogic component: alle logica voor grid, overlay, sortering en paginering -->
  <BinderLogic {topCardsPage1} {topCardsPage2} />

  <!-- Pokéball link -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
