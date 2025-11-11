<script>
  import * as d3 from "d3";
  export let cards = [];
  export let onClose;

  let svgContainer;

  $: if (cards.length && svgContainer) renderChart();

  function renderChart() {
    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(cards, d => d.price)])
      .range([50, width - 50]);

    const y = d3.scaleLinear()
      .domain([0, cards.length - 1])
      .range([50, height - 50]);

    const r = d3.scaleSqrt()
      .domain([0, d3.max(cards, d => d.price)])
      .range([10, 40]);

    svg.selectAll("circle")
      .data(cards)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => x(d.price))
      .attr("cy", (d, i) => y(i))
      .attr("r", d => r(d.price))
      .attr("fill", "#ffcb05")
      .attr("stroke", "#3b4cca")
      .attr("stroke-width", 2);

    svg.selectAll("text")
      .data(cards)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("x", (d, i) => x(d.price))
      .attr("y", (d, i) => y(i) - r(d.price) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white");
  }
</script>

<div class="overlay">
  <button class="close-overlay" on:click={onClose}>← Terug</button>
  <svg bind:this={svgContainer}></svg>
</div>
