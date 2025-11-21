import { Vibrant } from "node-vibrant/node"; // server-only

export async function extractColor(url) {
  try {
    const palette = await Vibrant.from(url).getPalette();
    const rgb = palette?.Vibrant?.rgb || [180, 180, 180];
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  } catch (err) {
    console.error("extractColor server fout:", err);
    return "rgb(180,180,180)";
  }
}
