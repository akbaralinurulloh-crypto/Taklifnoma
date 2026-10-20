export const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

/** Audio turini fayl boshidagi baytlar bo'yicha aniqlaydi. */
export function sniffAudio(b: Uint8Array): { type: string; ext: string } | null {
  if (b.length >= 3 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return { type: "audio/mpeg", ext: "mp3" }; // ID3
  if (b.length >= 2 && b[0] === 0xff && (b[1] & 0xe0) === 0xe0) return { type: "audio/mpeg", ext: "mp3" }; // MPEG frame
  if (b.length >= 4 && b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53) return { type: "audio/ogg", ext: "ogg" };
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x41 && b[10] === 0x56 && b[11] === 0x45) {
    return { type: "audio/wav", ext: "wav" };
  }
  if (b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return { type: "audio/mp4", ext: "m4a" };
  return null;
}
