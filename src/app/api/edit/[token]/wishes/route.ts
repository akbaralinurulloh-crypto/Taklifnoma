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
    const wishes = await repo.listWishes(row.id, 200);
    return Response.json({ wishes: wishes.map((w) => ({ guestName: w.guest_name, message: w.message, createdAt: w.created_at })) });
  } catch (e) {
    return toErrorResponse(e);
  }
}
