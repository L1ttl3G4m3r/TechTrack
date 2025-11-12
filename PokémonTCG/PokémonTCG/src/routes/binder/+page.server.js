import { getTopCardsHistory } from '$lib/api/server.js';

export const load = async () => {
  try {
    // Haal top 18 kaarten inclusief 90 dagen marketPrice history
    const allTopCards = await getTopCardsHistory(18);

    // Zorg dat marketPrice een Number is en datum een Date object
    const allCards = allTopCards.map(card => ({
      ...card,
      marketPrice: Number(card.marketPrice ?? 0),
      history: (card.history || []).map(h => ({
        date: new Date(h.date),
        marketPrice: Number(h.marketPrice ?? 0)
      }))
    }));

    // Verdeel in twee pagina's van 9 kaarten
    const topCardsPage1 = allCards.slice(0, 9);
    const topCardsPage2 = allCards.slice(9, 18);

    return {
      topCardsPage1,
      topCardsPage2
    };
  } catch (err) {
    console.error("Fout bij laden top kaarten:", err);
    return {
      topCardsPage1: [],
      topCardsPage2: []
    };
  }
};
