// Faqat server tomonida ishlatiladi (node:crypto). Brauzer kodi "@/lib/schema" dan import qilsin.
import { createHash, randomBytes } from "node:crypto";

export * from "./schema";

const SLUG_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function translit(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ʻʼ’‘'`]/g, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
}

/** aziz-madina-k7p2 ko'rinishidagi slug. Noyoblik bazadagi UNIQUE cheklov bilan kafolatlanadi. */
export function makeSlug(groom: string, bride: string): string {
  const bytes = randomBytes(4);
  let suffix = "";
  for (const b of bytes) suffix += SLUG_ALPHABET[b % SLUG_ALPHABET.length];
  const parts = [translit(groom), translit(bride), suffix].filter(Boolean);
  return parts.join("-");
}

/** Bir martalik tahrirlash tokeni: ochiq qiymat foydalanuvchiga, faqat hash bazaga. */
export function makeEditToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
