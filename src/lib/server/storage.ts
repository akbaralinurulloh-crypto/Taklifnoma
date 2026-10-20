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
  music: (p) => publicAssetUrl(BUCKET_MUSIC, p),
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
