import { getRepo } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { listPublicWishes, submitWish } from "@/lib/server/service";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    rateLimit(req, "wishes-read", 120, 10 * 60_000);
    const { slug } = await ctx.params;
    return Response.json({ wishes: await listPublicWishes(getRepo(), slug) });
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    rateLimit(req, "wishes", 10, 10 * 60_000);
    const { slug } = await ctx.params;
    const body = await req.json().catch(() => {
      throw new AppError(400, "bad_request", "So‘rov formati noto‘g‘ri.");
    });
    await submitWish(getRepo(), slug, body);
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
