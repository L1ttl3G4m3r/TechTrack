<script>
  import * as d3 from "d3";
  export let cards = []; // data uit +page.svelte
  export let onClose;

  let svgContainer;
  let chartType = 'line'; // 'line' of 'bar'

  $: if (svgContainer && cards.length) renderChart();

  function renderChart() {
    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    svg.attr("width", width).attr("height", height);

    if (chartType === 'line') renderLineChart(svg, cards, width, height);
    else renderBarChart(svg, cards, width, height);
  }

  function renderLineChart(svg, data, width, height) {
    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([50, width - 50]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([height - 50, 50]);

    const line = d3.line()
      .x((d,i) => x(i))
      .y(d => y(d.price));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ffcb05")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d,i) => x(i))
      .attr("cy", d => y(d.price))
      .attr("r", 5)
      .attr("fill", "#3b4cca");
  }

  function renderBarChart(svg, data, width, height) {
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([50, width - 50])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([height - 50, 50]);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.price))
      .attr("width", x.bandwidth())
      .attr("height", d => height - 50 - y(d.price))
      .attr("fill", "#ffcb05");

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.price)
      .attr("x", d => x(d.name) + x.bandwidth()/2)
      .attr("y", d => y(d.price) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");
  }

  function toggleChart() {
    chartType = chartType === 'line' ? 'bar' : 'line';
    renderChart();
  }
</script>

<div class="overlay">
  <button class="close-overlay" on:click={onClose}>← Terug</button>
  <button class="overlay-btn" on:click={toggleChart} style="position:absolute; top:1rem; right:1rem;">
    {chartType === 'line' ? 'Bar Chart' : 'Line Chart'}
  </button>
  <svg bind:this={svgContainer}></svg>
</div>
