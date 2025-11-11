import { getCardData } from "$lib/api/server.js";

export async function load() {
  const data = await getCardData();
  return {
    card: data.card,
    timeLeft: data.timeLeft
  };
}
