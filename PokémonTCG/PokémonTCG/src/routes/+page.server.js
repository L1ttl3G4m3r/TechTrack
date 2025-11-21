import { getRandomCard } from '$lib/dataClean.js';

export async function load() {
  const promises = Array.from({ length: 5 }, () => getRandomCard());
  const cards = (await Promise.all(promises)).filter(Boolean);

  return { cards };
}
