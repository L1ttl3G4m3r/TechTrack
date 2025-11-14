<script>
  import BinderLogic from '../../components/BinderLogic.svelte';
  import pokeballImg from '$lib/Images/pokeball.png';

  // Data komt van de load-functie in +page.server.js
  export let data;

  // Zet de kaarten van pagina 1 en 2 netjes klaar
  const topCardsPage1 = data.topCardsPage1?.map(c => ({
    ...c,
    marketPrice: Number(c.marketPrice ?? 0),
    // Zorg dat de geschiedenis goed wordt omgezet
    history: (c.history || []).map(h => ({
      date: new Date(h.date),
      marketPrice: Number(h.marketPrice ?? 0)
    }))
  })) ?? [];

  const topCardsPage2 = data.topCardsPage2?.map(c => ({
    ...c,
    marketPrice: Number(c.marketPrice ?? 0),
    history: (c.history || []).map(h => ({
      date: new Date(h.date),
      marketPrice: Number(h.marketPrice ?? 0)
    }))
  })) ?? [];
</script>

<div class="binder-background">
  <!-- Introductie tekst -->
  <h1>Welkom bij de Pokémon Binder!</h1>
  <p>
    Hier kun je de duurste Pokémon kaarten bekijken.<br><br>
    Wil je de prijsontwikkeling van deze kaarten zien?<br>
    Klik dan op de 📊 knop om de grafieken te bekijken van de afgelopen 90 dagen.<br><br>
  </p>

  <!-- BinderLogic component: regelt grid, overlay, sortering en paginering -->
  <BinderLogic {topCardsPage1} {topCardsPage2} />

  <!-- Pokéball link naar homepagina -->
  <a href="/" class="pokeball-link">
    <img src={pokeballImg} alt="Home" />
  </a>
</div>
