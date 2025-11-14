import { getRandomCard } from '$lib/dataClean.js';

export async function load() {
  const card = await getRandomCard();
  console.log("Random Card from server:", card);
  return { card };
}
