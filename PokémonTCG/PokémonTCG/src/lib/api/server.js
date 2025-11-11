import { SECRET_API_KEY } from '$env/static/private';

// ==========================================================
// RANDOM POKÉMON KAART
// ==========================================================

const pokemonNames = [
  "Pikachu", "Charizard", "Bulbasaur", "Squirtle",
  "Eevee", "Mewtwo", "Gyarados", "Snorlax", "Celebi"
];

function getRandomPokemon() {
  const index = Math.floor(Math.random() * pokemonNames.length);
  return pokemonNames[index];
}

export async function getCardData() {
  try {
    const randomPokemon = getRandomPokemon();
    const res = await fetch(
      `https://www.pokemonpricetracker.com/api/v2/cards?search=${encodeURIComponent(randomPokemon)}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${SECRET_API_KEY}`
        }
      }
    );

    if (!res.ok) throw new Error(`API returned status ${res.status}`);

    const json = await res.json();
    const cardData = json.data?.[0] ?? null;

    const card = cardData
      ? {
          image: cardData.imageUrl,
          setName: cardData.setName,
          price: Number(cardData.marketPrice ?? cardData.price ?? 0)
        }
      : null;

    return { card };
  } catch (err) {
    console.error("Kan kaart niet laden:", err);
    return { card: null };
  }
}

// ==========================================================
// TOP POKÉMON KAARTEN
// ==========================================================

async function fetchTopCards() {
  try {
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

export async function getTopCards() {
  // Altijd vers ophalen, geen caching meer
  return await fetchTopCards();
}