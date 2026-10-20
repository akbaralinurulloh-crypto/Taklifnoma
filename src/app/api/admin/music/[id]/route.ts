import { requireAdmin } from "@/lib/server/admin";
import { getRepo } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    const body = (await req.json().catch(() => null)) as { active?: unknown } | null;
    if (!UUID.test(id) || typeof body?.active !== "boolean") {
      throw new AppError(400, "bad_request", "So‘rov noto‘g‘ri.");
    }
    await getRepo().setMusicActive(id, body.active);
    return Response.json({ id, active: body.active });
  } catch (e) {
    return toErrorResponse(e);
  }
}
