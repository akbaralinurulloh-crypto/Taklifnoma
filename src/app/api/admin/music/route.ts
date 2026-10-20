import { requireAdmin } from "@/lib/server/admin";
import { MAX_AUDIO_BYTES, sniffAudio } from "@/lib/server/audio";
import { getRepo, getStorage } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    if (Number(req.headers.get("content-length") ?? 0) > MAX_AUDIO_BYTES + 100_000) {
      throw new AppError(413, "too_large", "Audio hajmi 15 MB dan oshmasligi kerak.");
    }
    const form = await req.formData();
    const title = String(form.get("title") ?? "").trim();
    const file = form.get("file");
    if (!title || title.length > 120) throw new AppError(400, "validation", "Musiqa nomini kiriting (120 belgigacha).");
    // Litsenziyasiz audio joylanmasligi uchun admin buni aniq tasdiqlashi shart
    if (form.get("licenseConfirmed") !== "true") {
      throw new AppError(400, "validation", "Audio fayldan foydalanish litsenziyasi borligini tasdiqlang.");
    }
    if (!(file instanceof File) || file.size === 0) throw new AppError(400, "bad_request", "Audio fayl tanlanmagan.");
    if (file.size > MAX_AUDIO_BYTES) throw new AppError(413, "too_large", "Audio hajmi 15 MB dan oshmasligi kerak.");

    const buf = new Uint8Array(await file.arrayBuffer());
    const kind = sniffAudio(buf);
    if (!kind) throw new AppError(415, "bad_type", "Faqat MP3, OGG, WAV yoki M4A audio qabul qilinadi.");

    const path = await getStorage().uploadMusicFile(buf, kind.type, kind.ext);
    const row = await getRepo().insertMusic(title, path);
    return Response.json({ id: row.id, title: row.title }, { status: 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
