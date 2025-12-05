<script>
  export let data;
  import RandomCard from "../components/RandomCard.svelte";

    import { onMount } from 'svelte';

  onMount(() => {
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.top = '0';
    glow.style.left = '0';
    glow.style.width = '200px';
    glow.style.height = '200px';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 80%)';
    glow.style.transform = 'translate(0, 0)';
    glow.style.transition = 'transform 0.05s ease, opacity 0.3s ease';
    glow.style.opacity = '0';
    glow.style.zIndex = '0';

    document.body.appendChild(glow);

    const onMouseMove = (e) => {
      glow.style.opacity = '1';
      glow.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
      // -100 to center glow on cursor (half of 200px)
    };

    document.body.addEventListener('mousemove', onMouseMove);

    return () => {
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeChild(glow);
    };
  });
</script>

<div class="background">
  <main class="card">
    <div class="glow"></div>

    <div class="text-content">
      <h1>Pokémon Datavisualisatie</h1>
      <p>Analyseer en visualiseer Pokémon kaarten</p>

      <RandomCard {data} /> 

      <button on:click={() => window.location.href='/uitleg'}>Begin</button>

      <p id="copyright">Gemaakt door: Kaylee Hoek</p>
    </div>
  </main>
</div>
