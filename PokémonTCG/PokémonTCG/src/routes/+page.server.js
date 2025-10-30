// src/routes/+page.server.js
export async function load() {
  const API_KEY = process.env.SECRET_API_KEY;
  const API_URL = "https://api.pokemontcg.io/v2/cards";

  // fallback local card in case the API is down
  const fallbackCard = {
    name: "Pikachu",
    images: { large: "https://images.pokemontcg.io/base1/58_hires.png" },
    tcgplayer: { prices: { normal: { market: 20 } } }
  };

  try {
    const res = await fetch(`${API_URL}?pageSize=20`, {
      headers: { "X-Api-Key": API_KEY }
    });

    if (!res.ok) {
      console.warn("API returned non-OK status:", res.status);
      return { card: fallbackCard };
    }

    const data = await res.json();
    const cards = data.data;

    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards[randomIndex];

    return { card };
  } catch (err) {
    console.error("Error fetching Pokémon card:", err);
    return { card: fallbackCard };
  }
}
