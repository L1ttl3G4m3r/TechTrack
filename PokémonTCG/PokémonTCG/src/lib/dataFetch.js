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
      { headers: { Authorization: `Bearer ${SECRET_API_KEY}` } }
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
// HISTORIE VAN TOPKAARTEN (90 dagen) – ALLEEN MARKET PRICE
// ==========================================================

export async function getTopCardsHistory(limit = 18) {
  try {
    const topCards = await fetchTopCards(limit);

    const historyPromises = topCards.map(async card => {
      if (!card.tcgPlayerId) {
        console.warn(`Geen tcgPlayerId voor kaart ${card.name}, history wordt overgeslagen.`);
        return { ...card, history: [] };
      }

      try {
        const url = `https://www.pokemonpricetracker.com/api/v2/cards?tcgPlayerId=${card.tcgPlayerId}&includeHistory=true&days=90`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${SECRET_API_KEY}` } });

        if (!res.ok) {
          console.warn(`Geen history voor kaart ${card.name} (status ${res.status})`);
          return { ...card, history: [] };
        }

        const json = await res.json();

        // Hier log je alle data voor debug
        console.log("Kaartdata inclusief history:", JSON.stringify(json, null, 2));

        const history = (json.data?.[0]?.priceHistory || [])
          .map(h => ({
            date: new Date(h.date),
            marketPrice: Number(h.marketPrice ?? 0)
          }))
          .filter(h => h.date !== null);

        return { ...card, history };
      } catch (err) {
        console.error(`Fout bij ophalen history voor kaart ${card.name} (tcgPlayerId ${card.tcgPlayerId}):`, err);
        return { ...card, history: [] };
      }
    });

    return await Promise.all(historyPromises);
  } catch (err) {
    console.error('Fout bij ophalen geschiedenis:', err);
    return [];
  }
}

// ==========================================================
// TOP POKÉMON KAARTEN
// ==========================================================

async function fetchTopCards(limit = 18) {
  try {
    const res = await fetch(
      `https://www.pokemonpricetracker.com/api/v2/cards?minPrice=800&sortBy=price&sortOrder=desc&limit=${limit}`,
      { headers: { Authorization: `Bearer ${SECRET_API_KEY}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API returned status ${res.status}: ${text}`);
    }

    const json = await res.json();

    return (json.data || []).map(c => ({
      id: c.id,                  // interne API ID
      tcgPlayerId: c.tcgPlayerId,
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
  return await fetchTopCards();
}
