import { getRepo } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { submitRsvp } from "@/lib/server/service";

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    rateLimit(req, "rsvp", 20, 10 * 60_000);
    const { slug } = await ctx.params;
    const body = await req.json().catch(() => {
      throw new AppError(400, "bad_request", "So‘rov formati noto‘g‘ri.");
    });
    await submitRsvp(getRepo(), slug, body);
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    return toErrorResponse(e);
  }
}
