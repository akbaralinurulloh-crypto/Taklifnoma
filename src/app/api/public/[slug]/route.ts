import { getRepo } from "@/lib/server/deps";
import { notFound, toErrorResponse } from "@/lib/server/errors";
import { getPublicBySlug } from "@/lib/server/service";
import { defaultUrls } from "@/lib/server/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await ctx.params;
    const data = await getPublicBySlug(getRepo(), slug, defaultUrls);
    if (!data) throw notFound();
    return Response.json(data);
  } catch (e) {
    return toErrorResponse(e);
  }
}
