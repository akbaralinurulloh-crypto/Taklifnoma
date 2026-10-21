import { randomUUID } from "node:crypto";
import { AppError } from "./errors";
import { adminClient } from "./repo.supabase";
import type { AssetUrls } from "./service";

const BUCKET_PHOTOS = "invitation-photos";
const BUCKET_MUSIC = "music";

export function publicAssetUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}

export const defaultUrls: AssetUrls = {
  photo: (p) => publicAssetUrl(BUCKET_PHOTOS, p),
  // 'builtin/<nom>.mp3' — loyiha ichidagi tayyor treklar (public/music), qolganlari Supabase omboridan
  music: (p) => (p.startsWith("builtin/") ? `/music/${p.slice(8)}` : publicAssetUrl(BUCKET_MUSIC, p)),
};

const PHOTO_EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

export async function uploadPhoto(buf: Uint8Array, type: keyof typeof PHOTO_EXT): Promise<string> {
  const path = `photos/${randomUUID()}.${PHOTO_EXT[type]}`;
  const { error } = await adminClient().storage.from(BUCKET_PHOTOS).upload(path, buf, { contentType: type, upsert: false });
  if (error) {
    console.error("[storage] rasm yuklanmadi:", error.message);
    throw new AppError(502, "upload_failed", "Rasmni saqlashda xato yuz berdi. Qayta urinib ko‘ring.");
  }
  return path;
}

/** Almashtirilgan yoki o'chirilgan taklifnomaning rasmini tozalash. Xato bo'lsa asosiy amal buzilmaydi. */
export async function removePhoto(path: string | null | undefined): Promise<void> {
  if (!path) return;
  try {
    const { error } = await adminClient().storage.from(BUCKET_PHOTOS).remove([path]);
    if (error) console.error("[storage] rasm o‘chirilmadi:", error.message);
  } catch (e) {
    console.error("[storage] rasm o‘chirishda istisno:", e instanceof Error ? e.message : e);
  }
}

export async function uploadMusicFile(buf: Uint8Array, contentType: string, ext: string): Promise<string> {
  const path = `tracks/${randomUUID()}.${ext}`;
  const { error } = await adminClient().storage.from(BUCKET_MUSIC).upload(path, buf, { contentType, upsert: false });
  if (error) {
    console.error("[storage] audio yuklanmadi:", error.message);
    throw new AppError(502, "upload_failed", "Audio faylni saqlashda xato yuz berdi.");
  }
  return path;
}

const MUSIC_EXT = new Set(["mp3", "ogg", "wav", "m4a"]);
export const MUSIC_PATH_RE = /^tracks\/[a-f0-9-]{36}\.(mp3|ogg|wav|m4a)$/;

/**
 * Katta audio fayllar Vercel so'rov hajmi cheklovidan (~4.5 MB) o'tmasligi uchun brauzer faylni to'g'ridan-to'g'ri
 * Supabase omboriga yuklaydi. Server faqat bir martalik imzolangan manzil beradi.
 */
export async function createMusicUpload(ext: string): Promise<{ path: string; uploadUrl: string }> {
  if (!MUSIC_EXT.has(ext)) throw new AppError(415, "bad_type", "Faqat MP3, OGG, WAV yoki M4A audio qabul qilinadi.");
  const path = `tracks/${randomUUID()}.${ext}`;
  const { data, error } = await adminClient().storage.from(BUCKET_MUSIC).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[storage] yuklash manzili yaratilmadi:", error?.message);
    throw new AppError(502, "upload_failed", "Yuklash manzilini yaratib bo‘lmadi. Supabase sozlamalarini tekshiring.");
  }
  return { path, uploadUrl: data.signedUrl };
}

/** Yuklangan faylni serverda o'qib tekshirish uchun (tur baytlardan aniqlanadi, hajm o'lchanadi). */
export async function readMusicFile(path: string): Promise<Uint8Array | null> {
  const { data, error } = await adminClient().storage.from(BUCKET_MUSIC).download(path);
  if (error || !data) return null;
  return new Uint8Array(await data.arrayBuffer());
}

export async function removeMusicFile(path: string): Promise<void> {
  try {
    await adminClient().storage.from(BUCKET_MUSIC).remove([path]);
  } catch (e) {
    console.error("[storage] audio o‘chirilmadi:", e instanceof Error ? e.message : e);
  }
}
