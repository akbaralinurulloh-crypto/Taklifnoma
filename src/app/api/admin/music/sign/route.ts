import { requireAdmin } from "@/lib/server/admin";
import { getStorage } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";

/** 1-qadam: brauzer faylni to'g'ridan-to'g'ri omborga yuklashi uchun bir martalik manzil beradi. */
export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const body = (await req.json().catch(() => null)) as { ext?: unknown } | null;
    const ext = typeof body?.ext === "string" ? body.ext.toLowerCase() : "";
    if (!ext) throw new AppError(400, "bad_request", "Fayl turi aniqlanmadi.");
    if (!["mp3", "ogg", "wav", "m4a"].includes(ext)) throw new AppError(415, "bad_type", "Faqat MP3, OGG, WAV yoki M4A audio qabul qilinadi.");
    return Response.json(await getStorage().createMusicUpload(ext));
  } catch (e) {
    return toErrorResponse(e);
  }
}
