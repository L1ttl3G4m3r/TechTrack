import { SECRET_API_KEY } from '$env/static/private';

// ---------------------------
// Lijst met bekende Pokémon-namen
// ---------------------------
export const pokemonNames = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Eevee",
  "Mewtwo",
  "Gyarados",
  "Snorlax",
  "Celebi"
];

// ---------------------------
// Hulpfunctie: kies een willekeurige Pokémon
// ---------------------------
export function getRandomPokemon() {
  const randomIndex = Math.floor(Math.random() * pokemonNames.length);
  return pokemonNames[randomIndex];
}

// ---------------------------
// Algemene fetch helper
// ---------------------------
// Voert een GET-request uit naar de API en retourneert JSON
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${SECRET_API_KEY}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}

// ---------------------------
// API-functies
// ---------------------------

// Haal één Pokémon-kaart op op basis van de naam
export async function fetchCardByName(name) {
  const encodedName = encodeURIComponent(name);
  const url = `https://www.pokemonpricetracker.com/api/v2/cards?search=${encodedName}&limit=5`;
  return await fetchFromAPI(url);
}

// Haal de top kaarten op met een minimale prijs
export async function fetchTopCards(limit = 18) {
  const url = `https://www.pokemonpricetracker.com/api/v2/cards?minPrice=800&sortBy=price&sortOrder=desc&limit=${limit}`;
  return await fetchFromAPI(url);
}

// Haal de prijs-geschiedenis van een kaart op basis van TCGPlayer ID
export async function fetchCardHistory(tcgPlayerId, days = 90) {
  if (!tcgPlayerId) return null;

  const url = `https://www.pokemonpricetracker.com/api/v2/cards?tcgPlayerId=${tcgPlayerId}&includeHistory=true&days=${days}`;
  return await fetchFromAPI(url);
}
