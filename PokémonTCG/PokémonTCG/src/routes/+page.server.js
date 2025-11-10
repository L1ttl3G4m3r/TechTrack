import { getCardData } from '$lib/api/server.js';

export async function load() {
  const { card, timeLeft } = await getCardData();
  return { card, timeLeft };
}
