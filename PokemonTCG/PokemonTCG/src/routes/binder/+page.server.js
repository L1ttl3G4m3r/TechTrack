import { getTopCardsWithHistory } from '$lib/dataClean.js';
import { extractColor } from '$lib/server/extractColor.js';

export async function load() {
  try {
    const allTopCards = await getTopCardsWithHistory(18);

    for (const card of allTopCards) {
      card._dominantColor = await extractColor(card.image);
    }

    const topCardsPage1 = allTopCards.slice(0, 9);
    const topCardsPage2 = allTopCards.slice(9, 18);

    return { topCardsPage1, topCardsPage2 };
  } catch (err) {
    console.error("Fout bij ophalen top kaarten voor /binder:", err);
    return { topCardsPage1: [], topCardsPage2: [] };
  }
}
