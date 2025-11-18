import { getRandomPokemon, fetchCardByName, fetchTopCards, fetchCardHistory } from '$lib/dataFetch.js';

// ---------------------------
// FUNCTIE: kies een willekeurige Pokémon kaart
// ---------------------------
export async function getRandomCard() {
  const name = getRandomPokemon();

  // Haal de kaartdata op van de API
  const json = await fetchCardByName(name);
  console.log("Random card raw JSON:", json);

  // Pak de eerste kaart uit de response
  const card = json?.data?.[0] ?? null;
  if (!card) return null;

  // Retourneer alleen de afbeelding van de kaart
  return {
    image: card.imageUrl
  };
}

// ---------------------------
// FUNCTIE: haal de top kaarten op
// ---------------------------
export async function getTopCards(limit = 1) {
  const json = await fetchTopCards(limit);
  console.log("Top cards raw JSON:", json);

  // Map de data naar een eenvoudiger formaat
  const cards = (json?.data || []).map(card => ({
    id: card.id,
    tcgPlayerId: card.tcgPlayerId,
    name: card.name,
    image: card.imageUrl,
    setName: card.setName,
    rarity: card.rarity ?? 'Onbekend',
    marketPrice: Number(card.prices?.market ?? 0)
  }));

  console.log("Top cards mapped:", cards);
  return cards;
}

// ---------------------------
// FUNCTIE: haal prijs-geschiedenis op per kaart
// Alleen "Near Mint" conditie wordt gebruikt
// ---------------------------
export async function getCardHistory(card, days = 3) {
  if (!card?.tcgPlayerId) return [];

  const json = await fetchCardHistory(card.tcgPlayerId, days);

  // Pak alleen de Near Mint geschiedenis
  const conditions = json?.data?.priceHistory?.conditions;
  const nearMintHistory = conditions?.["Near Mint"]?.history;

  if (!nearMintHistory) {
    console.warn(`No Near Mint history for ${card.name}`);
    return [];
  }

  // Map naar een eenvoudiger formaat: datum + prijs
  const historyPoints = nearMintHistory.map(point => ({
    date: point.date,
    marketPrice: Number(point.market ?? 0)
  }));

  console.log(`History for ${card.name}:`, historyPoints);
  return historyPoints;
}

// ---------------------------
// FUNCTIE: combineer top kaarten met hun prijs-geschiedenis
// ---------------------------
export async function getTopCardsWithHistory(limit = 18, days = 90) {
  // Haal eerst de top kaarten op
  const topCards = await getTopCards(limit);

  // Voeg de Near Mint prijs-geschiedenis toe aan elke kaart
  const cardsWithHistory = await Promise.all(
    topCards.map(async card => {
      const history = await getCardHistory(card, days);
      return { ...card, history };
    })
  );

  return cardsWithHistory;
}
