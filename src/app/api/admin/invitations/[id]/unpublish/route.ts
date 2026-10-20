import { requireAdmin } from "@/lib/server/admin";
import { getRepo } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { adminUnpublish } from "@/lib/server/service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await ctx.params;
    if (!UUID.test(id)) throw new AppError(400, "bad_request", "Identifikator noto‘g‘ri.");
    const row = await adminUnpublish(getRepo(), id);
    return Response.json({ id: row.id, status: row.status });
  } catch (e) {
    return toErrorResponse(e);
  }
}
