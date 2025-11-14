import { getRandomPokemon, fetchCardByName, fetchTopCards, fetchCardHistory } from '$lib/dataFetch.js';

// ---------------------------
// RANDOM CARD
// ---------------------------
export async function getRandomCard() {
  const name = getRandomPokemon();
  const json = await fetchCardByName(name);

  console.log("Random card raw JSON:", json);

  const cardData = json?.data?.[0] ?? null;
  if (!cardData) return null;

  // Alleen de image teruggeven
  return {
    image: cardData.imageUrl
  };
}

// ---------------------------
// TOP CARDS
// ---------------------------
export async function getTopCards(limit = 18) {
  const json = await fetchTopCards(limit);

  console.log("Top cards raw JSON:", json);

  const cards = (json?.data || []).map(c => ({
    id: c.id,
    tcgPlayerId: c.tcgPlayerId,
    name: c.name,
    image: c.imageUrl,
    setName: c.setName,
    rarity: c.rarity ?? 'Onbekend',
    marketPrice: Number(c.prices?.market ?? 0) // aangepast
  }));

  console.log("Top cards mapped:", cards);
  return cards;
}

// ---------------------------
// HISTORY PER CARD
// ---------------------------
export async function getCardHistory(card, days = 90) {
  if (!card?.tcgPlayerId) return [];

  const json = await fetchCardHistory(card.tcgPlayerId, days);

  console.log(`History raw JSON for card ${card.name}:`, json);

  const historyRaw = json?.data?.[0]?.priceHistory || [];

  return historyRaw
    .map(h => ({
      date: new Date(h.date),
      marketPrice: Number(h.market ?? 0) // gebruik h.market
    }))
    .filter(h => h.date);

    console.log(`Mapped history for card ${card.name}:`, history);
    return history;
}

// ---------------------------
// COMBINED TOP CARDS + HISTORY
// ---------------------------
export async function getTopCardsWithHistory(limit = 18, days = 90) {
  const topCards = await getTopCards(limit);

  const cardsWithHistory = await Promise.all(
    topCards.map(async card => {
      const history = await getCardHistory(card, days);
      return { ...card, history };
    })
  );

  console.log("Top cards with history:", cardsWithHistory);
  return cardsWithHistory;
}
