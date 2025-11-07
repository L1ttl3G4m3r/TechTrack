// src/routes/+page.server.js
import { SECRET_API_KEY } from "$env/static/private";

const CACHE_DURATION = 60 * 60 * 1000; // 1 uur
let cachedCard = null;

// Optioneel: lijst van Pokémon namen voor random selectie
const pokemonNames = [
  "Pikachu", "Charizard", "Bulbasaur", "Squirtle",
  "Eevee", "Mewtwo", "Gyarados", "Snorlax"
  // ...meer namen toevoegen voor grotere variatie
];

function getRandomPokemon() {
  const index = Math.floor(Math.random() * pokemonNames.length);
  return pokemonNames[index];
}

export async function load() {
  const now = Date.now();

  if (cachedCard && now - cachedCard.timestamp < CACHE_DURATION) {
    return {
      card: cachedCard.card,
      timeLeft: CACHE_DURATION - (now - cachedCard.timestamp)
    };
  }

  try {
    const randomPokemon = getRandomPokemon();

    const res = await fetch(
      `https://www.pokemonpricetracker.com/api/v2/cards?search=${encodeURIComponent(randomPokemon)}&limit=1`,
      {
        headers: {
          "Authorization": `Bearer ${SECRET_API_KEY}`
        }
      }
    );

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    const cardData = json.data?.[0] ?? null;

    let card = null;
    if (cardData) {
      card = {
        image: cardData.imageUrl,
        setName: cardData.setName,
        price: Number(cardData.marketPrice ?? cardData.price ?? 0)
      };
    }

    cachedCard = { card, timestamp: now };

    return {
      card,
      timeLeft: CACHE_DURATION
    };
  } catch (err) {
    console.error("Kan kaart niet laden:", err);
    return {
      card: null,
      timeLeft: CACHE_DURATION
    };
  }
}
