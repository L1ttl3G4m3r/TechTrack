import { getTopCards } from '$lib/api/server.js';

export const load = async () => {
  // Haal 18 kaarten op via de bestaande functie
  const allTopCards = await getTopCards();

  // Verdeel in 2 pagina's van 9 kaarten
  const page1 = allTopCards.slice(0, 9);
  const page2 = allTopCards.slice(9, 18);

  return {
    topCardsPage1: page1,
    topCardsPage2: page2
  };
};
