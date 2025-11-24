<script>
    import { onMount, onDestroy } from "svelte";
    import * as d3 from "d3";

    // -------------------------------
    // Props & lokale state
    // -------------------------------
    export let data;
    let cards = data?.cards || [];

    let dots = ".";
    let dotsInterval = null;
    let container = null;

    // -------------------------------
    // INITIALISATIE
    // -------------------------------
    onMount(() => {
        startDotsAnimation();
        if (cards.length > 0) {
            drawCards();
        }
    });

    onDestroy(() => {
        stopDotsAnimation();
    });

    // -------------------------------
    // DOTS LOADING ANIMATIE
    // -------------------------------
    function startDotsAnimation() {
        dotsInterval = setInterval(() => {
            dots = dots === "..." ? "." : dots + ".";
        }, 500);
    }

    function stopDotsAnimation() {
        if (dotsInterval) clearInterval(dotsInterval);
    }

    // -------------------------------
    // REACTIEVE HERTEKENING (wanneer cards wijzigen)
    // -------------------------------
    $: if (cards && container) {
        d3.select(container).select("svg").remove();
        if (cards.length > 0) drawCards();
    }

    // -------------------------------
    // D3 TEKENFUNCTIE
    // -------------------------------
    function drawCards() {
        if (!container) return;

        const width = container.clientWidth;
        const height = 250;

        // verwijder eventueel oude SVG
        d3.select(container).select("svg").remove();

        const svg = d3.select(container)
            .append("svg")
            .attr("class", "fan-svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const cardWidth = 120;
        const cardHeight = 170;
        const centerX = width / 2;
        const centerY = height / 2 - 40;

        cards.forEach((card, index) => {
            drawSingleCard(svg, card, index, cards.length, centerX, centerY, cardWidth, cardHeight);
        });
    }

    // -------------------------------
    // TEKEN EEN ENKELE KAART
    // -------------------------------
    function drawSingleCard(svg, card, index, totalCards, centerX, centerY, cardWidth, cardHeight) {
        const midpoint = (totalCards - 1) / 2;
        const offset = (index - midpoint) * 90;
        const angle = (index - midpoint) * 10;
        const verticalCompensation = Math.abs(offset) / 6;

        // Voeg afbeelding direct toe, zonder animatie of extra class
        svg.append("image")
            .attr("href", card.image)
            .attr("width", cardWidth)
            .attr("height", cardHeight)
            .attr("x", centerX - cardWidth / 2)
            .attr("y", centerY - cardHeight / 2)
            .attr("transform", `translate(${offset}, ${verticalCompensation}) rotate(${angle}, ${centerX}, ${centerY})`)
            .attr("opacity", 1); // direct zichtbaar
    }
</script>

<!-- -------------------------------
     FAN CONTAINER
------------------------------- -->
<div class="fan-container" bind:this={container}>
    {#if cards.length === 0}
        <div class="fan-loading">
            <span class="fan-loading__text">Kaarten worden geladen</span>
            <span class="fan-loading__dots">{dots}</span>
        </div>
    {/if}
</div>
