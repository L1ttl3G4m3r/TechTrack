<script>
  import * as d3 from "d3";
  import { tick } from "svelte";

  export let cards = [];       // Kaarten met historie en afbeeldingen
  export let onClose;          // Functie om de overlay te sluiten

  let svgContainer;            // Referentie naar SVG element
  let containerEl;             // Referentie naar container div

  // =======================
  // LAAD DOMINANTE KLEUREN
  // =======================
  async function preloadColors() {
    for (const card of cards) {
      if (!card._dominantColor) {
        card._dominantColor = await extractColor(card.image);
      }
    }
    await tick();              // Wacht tot DOM geüpdatet is
    renderChart();             // Render de grafiek na kleur-extractie
  }

  // Reactieve call: laad kleuren zodra kaarten beschikbaar zijn
  $: if (cards?.length) preloadColors();

  // =======================
  // RENDER DE GRAFIEK
  // =======================
  function renderChart() {
    if (!svgContainer || !cards.length) return;

    const svg = d3.select(svgContainer);
    svg.selectAll("*").remove();  // Wis vorige inhoud

    const width = Math.min(1000, Math.max(600, containerEl.clientWidth - 40));
    const height = 600;
    const margin = { top: 70, right: 70, bottom: 70, left: 70 };

    svg.attr("width", width).attr("height", height);

    // =======================
    // FILTER DATA (LAATSTE 90 DAGEN)
    // =======================
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const series = cards
      .map(c => ({
        ...c,
        history: c.history
          .filter(h => h.marketPrice && h.date)
          .filter(h => new Date(h.date) >= cutoff)
      }))
      .filter(c => c.history.length);

    if (!series.length) return; // Stop als geen data beschikbaar is

    // =======================
    // SCHAALEN
    // =======================
    const allDates = series.flatMap(s => s.history.map(h => new Date(h.date)));
    const allPrices = series.flatMap(s => s.history.map(h => h.marketPrice));

    const x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(allPrices)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // =======================
    // GRID LINES
    // =======================
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(-(height - margin.top - margin.bottom)).tickFormat(""))
      .selectAll("line").attr("stroke", "rgba(255,255,255,0.15)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat(""))
      .selectAll("line").attr("stroke", "rgba(255,255,255,0.15)");

    // =======================
    // AXES
    // =======================
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b %d")))
      .selectAll("text")
      .attr("transform", "rotate(-25)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // =======================
    // LINE GENERATOR
    // =======================
    const lineGen = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.marketPrice))
      .curve(d3.curveMonotoneX);

    // =======================
    // GROEPEN PER KAART
    // =======================
    const groups = svg.selectAll(".cardGroup")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "cardGroup");

    // =======================
    // PATHS + ANIMATIE
    // =======================
    groups.append("path")
      .attr("fill", "none")
      .attr("stroke", d => d._dominantColor)
      .attr("stroke-width", 2.5)
      .attr("opacity", 0.9)
      .attr("d", d => lineGen(d.history))
      .attr("stroke-dasharray", function () { return this.getTotalLength(); })
      .attr("stroke-dashoffset", function () { return this.getTotalLength(); })
      .transition().duration(1500).ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // =======================
    // TOOLTIP
    // =======================
    const tooltip = svg.append("g").style("display", "none");

    const tipRect = tooltip.append("rect")
      .attr("fill", "rgba(0,0,0,0.7)")
      .attr("rx", 6).attr("ry", 6)
      .attr("stroke", "white").attr("stroke-width", 1)
      .attr("y", 65);

    const tipName = tooltip.append("text")
      .attr("fill", "white").attr("font-size", 14).attr("font-weight", "bold").attr("dy", "1em").attr("y", 70);

    const tipPrice = tooltip.append("text")
      .attr("fill", "white").attr("font-size", 14).attr("dy", "2.5em").attr("y", 70);

    const tipImage = tooltip.append("image")
      .attr("x", 0).attr("y", -20).attr("width", 60).attr("height", 80).attr("rx", 4).attr("ry", 4);

    // =======================
    // CIRCLES + HOVER EFFECT
    // =======================
    groups.each(function(card) {
      d3.select(this).selectAll("circle")
        .data(card.history)
        .enter()
        .append("circle")
        .attr("cx", d => x(new Date(d.date)))
        .attr("cy", d => y(d.marketPrice))
        .attr("r", 4)
        .attr("fill", card._dominantColor)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.8)
        .attr("opacity", 0.9)
        .on("mouseover", function(event, d) {
          tooltip.style("display", null);
          tipName.text(card.name);
          tipPrice.text(`€${d.marketPrice.toFixed(2)}`);
          tipImage.attr("href", card.image);

          const w = Math.max(tipName.node().getBBox().width, tipPrice.node().getBBox().width) + 18;
          const h = tipName.node().getBBox().height + tipPrice.node().getBBox().height + 18;
          tipRect.attr("width", w).attr("height", h);
          tooltip.attr("transform", `translate(${x(new Date(d.date)) + 10}, ${y(d.marketPrice) - h/2})`);

          svg.selectAll(".cardGroup path")
            .transition().duration(180)
            .attr("stroke-width", s => s === card ? 4.5 : 2.5)
            .attr("opacity", s => s === card ? 1 : 0.5);

          svg.selectAll(".cardGroup circle")
            .transition().duration(180)
            .attr("opacity", s => s === card ? 1 : 0.5);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
          svg.selectAll(".cardGroup path")
            .transition().duration(250)
            .attr("stroke-width", 2.5)
            .attr("opacity", 0.9);

          svg.selectAll(".cardGroup circle")
            .transition().duration(250)
            .attr("opacity", 0.9);
        });
    });

    // =======================
    // GRAFIEK TITEL
    // =======================
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--card-border)")
      .attr("font-size", 20)
      .attr("font-weight", "bold")
      .text("Waardeontwikkeling (90 dagen)");
  }
</script>

<div bind:this={containerEl} class="overlay">
  <button class="close-overlay" on:click={() => onClose?.()}>← Terug</button>
  <svg bind:this={svgContainer}></svg>
</div>
