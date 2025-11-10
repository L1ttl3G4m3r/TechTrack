import { getTopCards } from '$lib/api/server.js';

export async function load() {
  const topCards = await getTopCards();
  return { topCards };
}
