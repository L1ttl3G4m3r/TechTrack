// src/routes/+page.server.js
import { SECRET_API_KEY } from "$env/static/private";

const CACHE_KEY = "topCardsCache";
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 uur in ms

let cachedData = null; // in-memory cache

export async function load() {
  const API_URL = "https://api.pokemontcg.io/v2/cards?pageSize=9";

  // Check of er een geldige cache is
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return { topCards: cachedData.cards };
  }

  try {
    const res = await fetch(API_URL, {
      headers: { "X-Api-Key": SECRET_API_KEY }
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();

    // Filter kaarten met marktprijs
    const cardsWithPrice = data.data.filter(c => c.tcgplayer?.prices?.normal?.market);

    // Sorteer op hoogste prijs
    cardsWithPrice.sort((a, b) => b.tcgplayer.prices.normal.market - a.tcgplayer.prices.normal.market);

    // Neem top 9 kaarten
    const topCards = cardsWithPrice.slice(0, 9);

    // Sla op in cache
    cachedData = { cards: topCards, timestamp: now };

    return { topCards };
  } catch (err) {
    console.error("API fetch failed:", err);
    return { topCards: [] }; // leeg array bij failure
  }
}
