import { SECRET_API_KEY } from '$env/static/private';

export const pokemonNames = [
  "Pikachu", "Charizard", "Bulbasaur", "Squirtle",
  "Eevee", "Mewtwo", "Gyarados", "Snorlax", "Celebi"
];

export function getRandomPokemon() {
  const index = Math.floor(Math.random() * pokemonNames.length);
  return pokemonNames[index];
}

// ---------------------------
// API Fetches met volledige URLs
// ---------------------------

export async function fetchCardByName(name) {
  const url = `https://www.pokemonpricetracker.com/api/v2/cards?search=${encodeURIComponent(name)}&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SECRET_API_KEY}` }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned status ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchCardByName error:", err);
    return null;
  }
}

export async function fetchTopCards(limit = 18) {
  const url = `https://www.pokemonpricetracker.com/api/v2/cards?minPrice=800&sortBy=price&sortOrder=desc&limit=${limit}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SECRET_API_KEY}` }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned status ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchTopCards error:", err);
    return null;
  }
}

export async function fetchCardHistory(tcgPlayerId, days = 90) {
  if (!tcgPlayerId) return null;
  const url = `https://www.pokemonpricetracker.com/api/v2/cards?tcgPlayerId=${tcgPlayerId}&includeHistory=true&days=${days}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SECRET_API_KEY}` }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned status ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchCardHistory error:", err);
    return null;
  }
}
