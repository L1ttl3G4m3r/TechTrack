<script>
  import * as d3 from "d3";
  import { tick } from "svelte";

  export let cards = []; 
  export let onClose;

  let svgContainer;
  let containerEl;

  $: if (svgContainer && containerEl && cards?.length) {
    renderWhenReady();
  }

  async function renderWhenReady() {
    await tick();
    if (!cards?.length) return;
    renderLineChart();
  }

  function renderLineChart() {
    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();

    const width = Math.min(1000, Math.max(1000, containerEl.clientWidth - 40));
    const height = 600;
    const margin = { top: 70, right: 70, bottom: 70, left: 70 };
    svg.attr("width", width).attr("height", height);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const series = cards
      .map(c => ({
        ...c,
        history: c.history
          .filter(h => h.marketPrice != null)
          .filter(h => new Date(h.date) >= ninetyDaysAgo)
      }))
      .filter(c => c.history.length > 0);

    if (!series.length) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "var(--text-color)")
        .text("Geen historische data beschikbaar");
      return;
    }

    const allDates = series.flatMap(s => s.history.map(h => new Date(h.date)));
    const allPrices = series.flatMap(s => s.history.map(h => h.marketPrice));
    const x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(allPrices)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(series.map(s => s.name))
      .range(d3.schemeTableau10.concat(d3.schemeSet3));

    // -----------------------------
    // Achtergrond grid
    // -----------------------------
    const xAxisGrid = d3.axisBottom(x)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat('')
      .ticks(10);

    const yAxisGrid = d3.axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat('')
      .ticks(6);

    svg.append("g")
      .attr("class", "x grid")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxisGrid)
      .selectAll("line")
      .attr("stroke", "rgba(255,255,255,0.1)");

    svg.append("g")
      .attr("class", "y grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisGrid)
      .selectAll("line")
      .attr("stroke", "rgba(255,255,255,0.1)");

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
      .defined(d => d.marketPrice != null)
      .x(d => x(new Date(d.date)))
      .y(d => y(d.marketPrice))
      .curve(d3.curveMonotoneX);

    // -----------------------------
    // Lijnen tekenen
    // -----------------------------
    const cardGroups = svg.selectAll(".card-group")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "card-group");

    cardGroups.append("path")
      .datum(d => d.history)
      .attr("fill", "none")
      .attr("stroke", d => color(d[0].name))
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("d", line)
      .attr("stroke-dasharray", function() { return this.getTotalLength(); })
      .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0);

    // -----------------------------
    // Tooltip groep
    // -----------------------------
    const tooltipGroup = svg.append("g").style("display", "none");
    const tooltipRect = tooltipGroup.append("rect")
      .attr("fill", "rgba(0,0,0,0.7)")
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("y", 65);
    const tooltipName = tooltipGroup.append("text")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("font-weight", "bold")
      .attr("dy", "1em")
      .attr("y", 70);       // verschuift de naam 20px omlaag
    const tooltipPrice = tooltipGroup.append("text")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("dy", "2.5em") // onder de naam
      .attr("y", 70);      // prijs 20px lager dan de naam
    const tooltipImage = tooltipGroup.append("image")
      .attr("width", 60)
      .attr("height", 80)
      .attr("x", 0)
      .attr("y", -20)
      .attr("rx", 4)
      .attr("ry", 4);

    // -----------------------------
    // Circles & hover
    // -----------------------------
    cardGroups.each(function(card) {
      d3.select(this).selectAll("circle")
        .data(card.history)
        .enter()
        .append("circle")
        .attr("cx", d => x(new Date(d.date)))
        .attr("cy", d => y(d.marketPrice))
        .attr("r", 4)
        .attr("fill", color(card.name))
        .attr("stroke", "#000")
        .attr("stroke-width", 0.8)
        .on("mouseover", function(event, d) {
          tooltipGroup.style("display", null);
          tooltipName.text(`${card.name}`);
          tooltipPrice.text(`€${d.marketPrice.toFixed(2)}`);
          tooltipImage.attr("href", card.image);

          const nameBBox = tooltipName.node().getBBox();
          const priceBBox = tooltipPrice.node().getBBox();
          const widthRect = Math.max(nameBBox.width, priceBBox.width) + 16; // padding
          const heightRect = nameBBox.height + priceBBox.height + 16;

          tooltipRect.attr("width", widthRect)
                     .attr("height", heightRect);

          tooltipGroup.attr("transform", `translate(${x(new Date(d.date)) + 10}, ${y(d.marketPrice) - heightRect / 2})`);
        })
        .on("mouseout", () => tooltipGroup.style("display", "none"))
        .transition()
        .delay((d,i) => i * 20)
        .attr("r", 5)
        .transition()
        .duration(500)
        .attr("r", 4);
    });

    // -----------------------------
    // Titel
    // -----------------------------
    svg.append("text")
      .attr("x", (margin.left + (width - margin.right)/2))
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--card-border)")
      .attr("font-size", 20)
      .attr("font-weight", "bold")
      .text("Waardeontwikkeling van Top Pokémon Kaarten (90 dagen)");
  }
</script>

<div bind:this={containerEl} class="overlay">
  <button class="close-overlay" on:click={() => onClose?.()}>← Terug</button>
  <svg bind:this={svgContainer}></svg>
</div>
