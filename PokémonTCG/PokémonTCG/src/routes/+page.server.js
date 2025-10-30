// src/routes/+page.server.js
export async function load() {
    const API_KEY = process.env.SECRET_API_KEY; // server-only, never exposed to client
    const API_URL = "https://api.pokemontcg.io/v2/cards";

    try {
        // Fetch a batch of cards (page 1, 250 cards)
        const res = await fetch(`${API_URL}?pageSize=250`, {
            headers: {
                "X-Api-Key": API_KEY
            }
        });
        const data = await res.json();
        const cards = data.data;

        // Pick a random card
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards[randomIndex];

        return { card };
    } catch (err) {
        console.error("Error fetching Pokémon card:", err);
        return { card: null };
    }
}
