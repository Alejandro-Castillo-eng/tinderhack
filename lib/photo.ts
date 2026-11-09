import { AVATAR_EMOJIS, AVATAR_GRADIENTS } from "./constants";

export function randomAvatar(): string {
  const [a, b] = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
  const e = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
  return `grad:${a},${b},${e}`;
}

export function parseGradient(src: string): { from: string; to: string; emoji: string } | null {
  if (!src.startsWith("grad:")) return null;
  const [from, to, ...rest] = src.slice(5).split(",");
  return { from, to, emoji: rest.join(",") };
}

/** Reduce la foto a máx. 900 px y JPEG para que quepa en localStorage. */
export async function fileToPhoto(file: File, max = 900): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.8);
}
