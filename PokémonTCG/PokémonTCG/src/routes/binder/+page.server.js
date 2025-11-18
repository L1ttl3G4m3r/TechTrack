import { getTopCardsWithHistory } from '$lib/dataClean.js';

export async function load() {
  try {
    // 18 kaarten in totaal, splitst over twee "pagina's"
    const allTopCards = await getTopCardsWithHistory(18);

    const topCardsPage1 = allTopCards.slice(0, 9);
    const topCardsPage2 = allTopCards.slice(9, 18);

    return { topCardsPage1, topCardsPage2 };
  } catch (err) {
    console.error("Fout bij ophalen top kaarten voor /binder:", err);
    return { topCardsPage1: [], topCardsPage2: [] };
  }
}
