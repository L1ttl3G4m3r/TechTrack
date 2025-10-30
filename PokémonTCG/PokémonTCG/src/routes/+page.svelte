<script lang="ts">
  import * as d3 from "d3";
  import Chart from '$lib/components/Chart.svelte';

  // Hardcoded data for testing
  const cards = [
    { name: "Pikachu", value: 20 },
    { name: "Charizard", value: 50 },
    { name: "Bulbasaur", value: 30 },
    { name: "Squirtle", value: 25 },
    { name: "Mewtwo", value: 40 },
    { name: "Gengar", value: 35 },
    { name: "Eevee", value: 15 },
    { name: "Snorlax", value: 45 },
    { name: "Jigglypuff", value: 10 },
    { name: "Dragonite", value: 50 }
  ];
</script>

<h1>Welcome to PokémonTCG</h1>

<Chart {cards} />
