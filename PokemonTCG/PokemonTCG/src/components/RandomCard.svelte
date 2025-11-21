<script>
  import { onMount, onDestroy } from "svelte";
  import * as d3 from "d3";

  export let data; // { cards: [...] }
  let cards = data?.cards || [];

  let dots = ".";
  let dotsInterval;
  let container;

  onMount(() => {
    dotsInterval = setInterval(() => {
      dots = dots === "..." ? "." : dots + ".";
    }, 500);

    if (cards.length > 0) drawCards();
  });

  onDestroy(() => {
    clearInterval(dotsInterval);
  });

  function drawCards() {
    if (!container) return;

    const width = container.clientWidth;
    const height = 250; // kleinere hoogte voor compacte waaier

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const cardWidth = 120;
    const cardHeight = 170;

    const centerX = width / 2;
    const centerY = height / 2 - 40; // positie van de waaier in het kleinere SVG

    cards.forEach((card, i) => {
      const offset = (i - (cards.length - 1) / 2) * 100;
      const angle = (i - (cards.length - 1) / 2) * 10;

      svg.append("image")
        .attr("href", card.image)
        .attr("width", cardWidth)
        .attr("height", cardHeight)
        .attr("x", centerX - cardWidth / 2)
        .attr("y", centerY - cardHeight / 2)
        .attr("transform", `translate(${offset}, ${Math.abs(offset)/4}) rotate(${angle}, ${centerX}, ${centerY})`)
        .style("filter", "drop-shadow(2px 2px 6px rgba(0,0,0,0.5))")
        .style("opacity", 0)
        .transition()
        .duration(800)
        .delay(i * 150)
        .style("opacity", 1);
    });
  }
</script>

<div bind:this={container} style="width: 100%; height: 300px; position: relative;">
  {#if cards.length === 0}
    <div style="text-align:center; margin-top:50px;">
      Kaarten worden geladen<span>{dots}</span>
    </div>
  {/if}
</div>
