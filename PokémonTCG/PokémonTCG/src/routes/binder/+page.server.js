// src/routes/binder/+page.server.js
import { SECRET_API_KEY } from '$env/static/private';

const CACHE_DURATION = 60 * 60 * 1000; // 1 uur
let cachedTopCards = null;

async function fetchTopCards() {
  try {
    // Exact de URL zoals jij wilt
    const res = await fetch(
      `https://www.pokemonpricetracker.com/api/v2/cards?minPrice=1500&sortBy=price&sortOrder=desc&limit=9`,
      {
        headers: { Authorization: `Bearer ${SECRET_API_KEY}` }
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned status ${res.status}: ${text}`);
    }

    const json = await res.json();

    return (json.data || []).map(c => ({
      id: c.id || c.tcgPlayerId,
      name: c.name,
      image: c.imageUrl,
      setName: c.setName,
      rarity: c.rarity || 'Onbekend',
      price: Number(c.prices?.market ?? 0)
    }));
  } catch (err) {
    console.error('Fout bij ophalen top kaarten:', err);
    return [];
  }
}

export async function load() {
  const now = Date.now();
  let topCards = [];

  // Cache check
  if (!cachedTopCards || now - cachedTopCards.timestamp >= CACHE_DURATION) {
    topCards = await fetchTopCards();
    cachedTopCards = { cards: topCards, timestamp: now };
  } else {
    topCards = cachedTopCards.cards;
  }

  return { topCards };
}
