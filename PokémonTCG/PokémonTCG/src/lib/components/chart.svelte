<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Expect an array of { name, value }
  export let cards: { name: string; value: number }[] = [];

  let svg;

  onMount(() => {
    if (!cards.length) return;

    const width = 500;
    const height = 500;

    // Clear previous content if any
    d3.select(svg).selectAll("*").remove();

    const svgEl = d3.select(svg)
      .attr("width", width)
      .attr("height", height);

    // Scale for bubble sizes
    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(cards, d => d.value) || 10])
      .range([15, 60]);

    // Force simulation for bubble layout
    const simulation = d3.forceSimulation(cards)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => sizeScale(d.value) + 5))
      .stop(); // stop automatic ticking to avoid long load times

    // Manually run simulation for a fixed number of steps to position bubbles
    for (let i = 0; i < 120; ++i) simulation.tick();

    // Draw circles
    svgEl.selectAll("circle")
      .data(cards)
      .join("circle")
      .attr("r", d => sizeScale(d.value))
      .attr("cx", d => d.x!)
      .attr("cy", d => d.y!)
      .attr("fill", "steelblue")
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

    // Draw labels
    svgEl.selectAll("text")
      .data(cards)
      .join("text")
      .text(d => d.name)
      .attr("x", d => d.x!)
      .attr("y", d => d.y!)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("pointer-events", "none");
  });
</script>

<svg bind:this={svg}></svg>

<style>
  svg {
    display: block;
    margin: 2rem auto;
    border: 1px solid #ddd;
    background: #f9f9f9;
    border-radius: 8px;
  }
</style>
