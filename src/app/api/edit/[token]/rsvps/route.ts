import { getRepo } from "@/lib/server/deps";
import { toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { getForEdit } from "@/lib/server/service";

export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    rateLimit(req, "edit-token", 60, 10 * 60_000);
    const { token } = await ctx.params;
    const repo = getRepo();
    const row = await getForEdit(repo, token);
    const rsvps = await repo.listRsvps(row.id);
    return Response.json({
      rsvps: rsvps.map((r) => ({ guestName: r.guest_name, response: r.response, guests: r.guests ?? 1, createdAt: r.created_at })),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
