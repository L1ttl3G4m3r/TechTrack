<script>
  import * as d3 from "d3";
  import { tick } from "svelte";

  export let cards = []; // kaarten met history van getCardHistory
  export let onClose;

  let svgContainer;
  let containerEl;

  // Wacht tot DOM klaar is
  $: if (svgContainer && containerEl && cards?.length) {
    renderWhenReady();
  }

  async function renderWhenReady() {
    await tick();
    if (!cards?.length) return;
    renderMultiLineChart();
  }

  function renderMultiLineChart() {
    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();

    const width = Math.min(1000, Math.max(600, containerEl.clientWidth - 40));
    const height = 520;
    const margin = { top: 70, right: 180, bottom: 70, left: 70 };
    svg.attr("width", width).attr("height", height);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Gebruik alleen kaarten met history
    const series = cards
      .map(card => ({ ...card, history: card.history }))
      .filter(card => card.history?.length > 0);

    if (!series.length) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text-color)")
        .text("Geen historische data beschikbaar");
      return;
    }

    const x = d3.scaleTime()
      .domain([ninetyDaysAgo, new Date()])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s.history, h => h.marketPrice))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(series.map(s => s.name))
      .range(d3.schemeTableau10.concat(d3.schemeSet3));

    // Assen
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b %d")))
      .selectAll("text")
      .attr("transform", "rotate(-25)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.marketPrice))
      .curve(d3.curveMonotoneX);

    // Tooltip groep
    const tooltipGroup = svg.append("g").style("display", "none");
    const tooltipRect = tooltipGroup.append("rect")
      .attr("fill", "black")
      .attr("opacity", 0.8)
      .attr("rx", 4)
      .attr("ry", 4);
    const tooltipText = tooltipGroup.append("text")
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("dy", "1em");
    const tooltipImage = tooltipGroup.append("image")
      .attr("width", 50)
      .attr("height", 70)
      .attr("x", 0)
      .attr("y", -70);

    // Lijnen tekenen
    const lines = svg.selectAll(".serie")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "serie");

    lines.append("path")
      .attr("d", d => line(d.history))
      .attr("fill", "none")
      .attr("stroke", d => color(d.name))
      .attr("stroke-width", 2)
      .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 3);
        tooltipGroup.style("display", null);
      })
      .on("mousemove", function(event, d) {
        const last = d.history[d.history.length - 1];
        tooltipText.text(`${d.name}: €${last.marketPrice.toFixed(2)}`);
        tooltipImage.attr("href", d.image);
        const bbox = tooltipText.node().getBBox();
        tooltipRect.attr("width", bbox.width + 8).attr("height", bbox.height + 80);
        tooltipGroup.attr("transform", `translate(${event.offsetX + 10}, ${event.offsetY - 20})`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 2);
        tooltipGroup.style("display", "none");
      });

    // Circles op laatste punt
    lines.append("circle")
      .attr("r", 4)
      .attr("cx", d => x(d.history[d.history.length - 1].date))
      .attr("cy", d => y(d.history[d.history.length - 1].marketPrice))
      .attr("fill", d => color(d.name))
      .attr("stroke", "#000")
      .attr("stroke-width", 0.6)
      .on("mouseover", function(event, d) {
        const last = d.history[d.history.length - 1];
        tooltipText.text(`${d.name}: €${last.marketPrice.toFixed(2)}`);
        tooltipImage.attr("href", d.image);
        const bbox = tooltipText.node().getBBox();
        tooltipRect.attr("width", bbox.width + 8).attr("height", bbox.height + 80);
        tooltipGroup.attr("transform", `translate(${event.offsetX + 10}, ${event.offsetY - 20})`)
                    .style("display", null);
      })
      .on("mouseout", () => tooltipGroup.style("display", "none"));

    // Titel
    svg.append("text")
      .attr("x", (margin.left + (width - margin.right)/2))
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--card-border)")
      .attr("font-size", 18)
      .text("Waardeontwikkeling van Top Pokémon Kaarten (90 dagen)");
  }
</script>

<div bind:this={containerEl} class="overlay">
  <button class="close-overlay" on:click={() => onClose?.()}>← Terug</button>
  <svg bind:this={svgContainer}></svg>
</div>
