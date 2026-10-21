import { requireAdmin } from "@/lib/server/admin";
import { MAX_AUDIO_BYTES, sniffAudio } from "@/lib/server/audio";
import { getRepo, getStorage } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { MUSIC_PATH_RE } from "@/lib/server/storage";

/** 2-qadam: yuklangan fayl serverda tekshiriladi (haqiqiy audio, hajm), so'ng katalogga qo'shiladi. */
export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const body = (await req.json().catch(() => null)) as { title?: unknown; path?: unknown; licenseConfirmed?: unknown } | null;
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const path = typeof body?.path === "string" ? body.path : "";
    if (!MUSIC_PATH_RE.test(path)) throw new AppError(400, "bad_request", "Fayl manzili noto‘g‘ri.");
    const storage = getStorage();
    const reject = async (status: number, code: string, msg: string): Promise<never> => {
      await storage.removeMusicFile(path); // noto'g'ri fayl omborda qolib ketmasin
      throw new AppError(status, code, msg);
    };
    if (!title || title.length > 120) return await reject(400, "validation", "Musiqa nomini kiriting (120 belgigacha).");
    if (body?.licenseConfirmed !== true) return await reject(400, "validation", "Audio fayldan foydalanish litsenziyasi borligini tasdiqlang.");

    const bytes = await storage.readMusicFile(path);
    if (!bytes) throw new AppError(404, "not_found", "Yuklangan fayl omborda topilmadi. Qayta yuklab ko‘ring.");
    if (bytes.length > MAX_AUDIO_BYTES) return await reject(413, "too_large", "Audio hajmi 15 MB dan oshmasligi kerak.");
    const kind = sniffAudio(bytes);
    if (!kind) return await reject(415, "bad_type", "Bu haqiqiy MP3, OGG, WAV yoki M4A audio emas.");
    if (!path.endsWith(`.${kind.ext}`)) return await reject(415, "bad_type", "Fayl kengaytmasi tarkibiga mos kelmadi.");

    const row = await getRepo().insertMusic(title, path);
    return Response.json({ id: row.id, title: row.title }, { status: 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
