import { MAX_PHOTO_BYTES, sniffImageType } from "@/lib/schema";
import { getStorage } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { defaultUrls } from "@/lib/server/storage";

export async function POST(req: Request) {
  try {
    rateLimit(req, "photos", 40, 10 * 60_000);
    const len = Number(req.headers.get("content-length") ?? 0);
    if (len > MAX_PHOTO_BYTES + 100_000) throw new AppError(413, "too_large", "Rasm hajmi 8 MB dan oshmasligi kerak.");
    if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      throw new AppError(400, "bad_request", "Rasm fayl sifatida yuborilishi kerak.");
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) throw new AppError(400, "bad_request", "Rasm tanlanmagan.");
    if (file.size > MAX_PHOTO_BYTES) throw new AppError(413, "too_large", "Rasm hajmi 8 MB dan oshmasligi kerak.");

    const buf = new Uint8Array(await file.arrayBuffer());
    const type = sniffImageType(buf); // haqiqiy tur fayl baytlaridan aniqlanadi, nomi/MIME'ga ishonilmaydi
    if (!type) throw new AppError(415, "bad_type", "Faqat JPG, PNG yoki WebP rasm yuklash mumkin.");

    const path = await getStorage().uploadPhoto(buf, type);
    return Response.json({ path, url: defaultUrls.photo(path) }, { status: 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
