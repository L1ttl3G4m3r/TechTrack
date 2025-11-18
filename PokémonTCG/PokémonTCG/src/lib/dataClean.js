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
export async function getTopCards(limit = 1) {
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
// HISTORY PER CARD (alleen Near Mint)
// ---------------------------
export async function getCardHistory(card, days = 3) {
  if (!card?.tcgPlayerId) return [];

  const json = await fetchCardHistory(card.tcgPlayerId, days);

  // Pak alleen de Near Mint history
  const conditions = json?.data?.priceHistory?.conditions;
  const nearMintHistory = conditions?.["Near Mint"]?.history;

  if (!nearMintHistory) {
    console.warn(`No Near Mint history for ${card.name}`);
    return [];
  }

  // Map alleen de date en marketPrice
  const historyPoints = nearMintHistory.map(point => ({
    date: point.date,
    marketPrice: Number(point.market ?? 0)
  }));

  // Alleen de return loggen
  console.log(`History for ${card.name}:`, historyPoints);

  return historyPoints;
}

// ---------------------------
// COMBINED TOP CARDS + HISTORY
// ---------------------------
export async function getTopCardsWithHistory(limit = 18, days = 90) {
  const topCards = await getTopCards(limit);

  const cardsWithHistory = await Promise.all(
    topCards.map(async card => {
      const history = await getCardHistory(card, days);
      return { ...card, history }; // history toegevoegd
    })
  );

  return cardsWithHistory;
}
