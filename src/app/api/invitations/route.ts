import { getRepo } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { createInvitation } from "@/lib/server/service";

export async function POST(req: Request) {
  try {
    rateLimit(req, "create", 10, 60 * 60_000);
    if (Number(req.headers.get("content-length") ?? 0) > 50_000) {
      throw new AppError(413, "too_large", "So‘rov juda katta.");
    }
    const body = await req.json().catch(() => {
      throw new AppError(400, "bad_request", "So‘rov formati noto‘g‘ri.");
    });
    const { row, replay } = await createInvitation(getRepo(), body);
    // Faqat serverda saqlangan (bazadan qaytgan) qiymatlar javobga yoziladi
    return Response.json({ slug: row.slug, path: `/i/${row.slug}`, replay }, { status: replay ? 200 : 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
