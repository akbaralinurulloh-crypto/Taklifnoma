import { getRepo, getStorage } from "@/lib/server/deps";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";
import { deleteInvitation, getForEdit, updateInvitation } from "@/lib/server/service";
import { defaultUrls } from "@/lib/server/storage";
import { editableView } from "@/lib/server/views";

type Ctx = { params: Promise<{ token: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    rateLimit(req, "edit-token", 60, 10 * 60_000); // tokenni taxmin qilishga qarshi
    const { token } = await ctx.params;
    const row = await getForEdit(getRepo(), token);
    return Response.json(editableView(row, defaultUrls));
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    rateLimit(req, "edit-token", 60, 10 * 60_000);
    const { token } = await ctx.params;
    const body = await req.json().catch(() => {
      throw new AppError(400, "bad_request", "So‘rov formati noto‘g‘ri.");
    });
    const { row, removedPhoto, removedGallery } = await updateInvitation(getRepo(), token, body);
    await getStorage().removePhoto(removedPhoto); // almashtirilgan rasmning keraksiz fayli tozalanadi
    for (const p of removedGallery) await getStorage().removePhoto(p);
    return Response.json(editableView(row, defaultUrls));
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    rateLimit(req, "edit-token", 60, 10 * 60_000);
    const { token } = await ctx.params;
    const { removedPhoto, removedGallery } = await deleteInvitation(getRepo(), token);
    await getStorage().removePhoto(removedPhoto);
    for (const p of removedGallery) await getStorage().removePhoto(p);
    return Response.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e);
  }
}
