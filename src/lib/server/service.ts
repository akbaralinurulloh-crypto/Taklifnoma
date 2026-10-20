import { hashToken, makeSlug } from "@/lib/invitation";
import { invitationInputSchema, tashkentToIso, type Design } from "@/lib/schema";
import type { PublicInvitation } from "@/lib/types";
import { AppError, notFound } from "./errors";
import type { InvitationRow, MusicRow, Repo } from "./repo";

export type AssetUrls = { photo: (path: string) => string; music: (path: string) => string };

const TOKEN_RE = /^[A-Za-z0-9_-]{43,64}$/;
const KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;
const PHOTO_RE = /^photos\/[a-f0-9-]{36}\.(jpg|png|webp)$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type Body = Record<string, unknown>;
const asBody = (raw: unknown): Body => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new AppError(400, "bad_request", "So‘rov formati noto‘g‘ri.");
  }
  return raw as Body;
};

function validationError(fields: Record<string, string>): AppError {
  return new AppError(400, "validation", "Ma’lumotlar noto‘g‘ri to‘ldirilgan. Xatolarni tuzating.", fields);
}

/** Forma maydonlarini serverda qayta tekshiradi (brauzer tekshiruviga ishonilmaydi). */
function parseFields(body: Body) {
  const parsed = invitationInputSchema.safeParse({
    groomName: body.groomName,
    brideName: body.brideName,
    date: body.date,
    time: body.time,
    venueName: body.venueName,
    venueAddress: body.venueAddress,
    extraText: typeof body.extraText === "string" ? body.extraText : undefined,
    design: body.design,
    musicId: body.musicId ?? null,
  });
  const fields: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]);
      if (!(k in fields)) fields[k] = issue.message;
    }
    throw validationError(fields);
  }
  const iso = tashkentToIso(parsed.data.date, parsed.data.time);
  if (!iso) throw validationError({ date: "Bunday sana mavjud emas" });
  return { data: parsed.data, iso };
}

async function checkMusic(repo: Repo, musicId: string | null | undefined): Promise<string | null> {
  if (!musicId) return null;
  const m = await repo.getMusic(musicId);
  if (!m || !m.is_active) throw validationError({ musicId: "Tanlangan musiqa mavjud emas" });
  return m.id;
}

/** To'y sanasi 3 oydan ko'proq o'tib ketgan bo'lsa rad etiladi (yaqinda o'tgan sana mumkin). */
export function checkNotTooOld(iso: string, now: Date) {
  const limit = new Date(now.getTime());
  limit.setUTCMonth(limit.getUTCMonth() - 3);
  if (new Date(iso).getTime() < limit.getTime()) {
    throw validationError({ date: "To‘y sanasi 3 oydan ko‘proq o‘tib ketgan bo‘lmasligi kerak" });
  }
}

function checkPhotoPath(p: unknown): string | null {
  if (p === null || p === undefined || p === "") return null;
  if (typeof p !== "string" || !PHOTO_RE.test(p)) throw validationError({ photo: "Rasm manzili noto‘g‘ri" });
  return p;
}

export async function createInvitation(repo: Repo, raw: unknown, now = new Date()) {
  const body = asBody(raw);
  const { data, iso } = parseFields(body);
  const key = body.idempotencyKey;
  const token = body.editToken;
  if (typeof key !== "string" || !KEY_RE.test(key)) throw new AppError(400, "bad_request", "So‘rov identifikatori noto‘g‘ri.");
  if (typeof token !== "string" || !TOKEN_RE.test(token)) throw new AppError(400, "bad_request", "Tahrirlash kaliti noto‘g‘ri.");
  const hash = hashToken(token);

  const replay = async (): Promise<{ row: InvitationRow; replay: true } | null> => {
    const existing = await repo.findByIdempotencyKey(key);
    if (!existing) return null;
    if (existing.edit_token_hash !== hash) throw new AppError(409, "conflict", "Bu so‘rov identifikatori allaqachon ishlatilgan.");
    return { row: existing, replay: true };
  };

  const first = await replay();
  if (first) return first;

  checkNotTooOld(iso, now);
  const musicId = await checkMusic(repo, data.musicId);
  const photoPath = checkPhotoPath(body.photoPath);

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await repo.insertInvitation({
      slug: makeSlug(data.groomName, data.brideName),
      groom_name: data.groomName,
      bride_name: data.brideName,
      wedding_at: iso,
      venue_name: data.venueName,
      venue_address: data.venueAddress,
      extra_text: data.extraText,
      photo_path: photoPath,
      design: data.design as Design,
      music_id: musicId,
      status: "published",
      edit_token_hash: hash,
      idempotency_key: key,
      published_at: now.toISOString(),
    });
    if (res.ok) return { row: res.row, replay: false as const };
    if (res.conflict === "idempotency") {
      const r = await replay(); // parallel takroriy so'rov: birinchisining natijasi qaytariladi
      if (r) return r;
    }
  }
  throw new AppError(500, "slug_failed", "Noyob havola yaratib bo‘lmadi. Qayta urinib ko‘ring.");
}

export function rowToPublic(row: InvitationRow, music: MusicRow | null, urls: AssetUrls): PublicInvitation {
  return {
    groomName: row.groom_name,
    brideName: row.bride_name,
    weddingAt: row.wedding_at,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    extraText: row.extra_text,
    photoUrl: row.photo_path ? urls.photo(row.photo_path) : null,
    design: row.design,
    music: music && music.is_active ? { title: music.title, url: urls.music(music.storage_path) } : null,
  };
}

/** Faqat nashr qilingan taklifnomani qaytaradi. Qoralama va o'chirilganlar uchun null. */
export async function getPublicBySlug(repo: Repo, slug: string, urls: AssetUrls): Promise<PublicInvitation | null> {
  if (slug.length > 80 || !SLUG_RE.test(slug)) return null;
  const row = await repo.findPublishedBySlug(slug);
  if (!row) return null;
  const music = row.music_id ? await repo.getMusic(row.music_id) : null;
  return rowToPublic(row, music, urls);
}

export async function getForEdit(repo: Repo, token: string): Promise<InvitationRow> {
  if (!TOKEN_RE.test(token)) throw notFound();
  const row = await repo.findByTokenHash(hashToken(token));
  if (!row || row.status === "deleted") throw notFound();
  return row;
}

export async function updateInvitation(repo: Repo, token: string, raw: unknown, now = new Date()) {
  const row = await getForEdit(repo, token);
  const body = asBody(raw);
  const { data, iso } = parseFields(body);
  if (iso !== row.wedding_at) checkNotTooOld(iso, now);
  const musicId = await checkMusic(repo, data.musicId);

  let photoPath = row.photo_path;
  if ("photoPath" in body) photoPath = checkPhotoPath(body.photoPath);

  const updated = await repo.updateInvitation(row.id, {
    groom_name: data.groomName,
    bride_name: data.brideName,
    wedding_at: iso,
    venue_name: data.venueName,
    venue_address: data.venueAddress,
    extra_text: data.extraText,
    design: data.design as Design,
    music_id: musicId,
    photo_path: photoPath,
  });
  const removedPhoto = row.photo_path && row.photo_path !== photoPath ? row.photo_path : null;
  return { row: updated, removedPhoto };
}

export async function deleteInvitation(repo: Repo, token: string) {
  const row = await getForEdit(repo, token);
  await repo.updateInvitation(row.id, { status: "deleted" });
  return { removedPhoto: row.photo_path };
}

export async function submitRsvp(repo: Repo, slug: string, raw: unknown) {
  const body = asBody(raw);
  const name = typeof body.guestName === "string" ? body.guestName.trim() : "";
  const response = body.response;
  const fields: Record<string, string> = {};
  if (!name) fields.guestName = "Ismingizni kiriting";
  else if (name.length > 80) fields.guestName = "Ism 80 belgidan oshmasligi kerak";
  if (response !== "yes" && response !== "no") fields.response = "Javobni tanlang";
  if (Object.keys(fields).length) throw validationError(fields);

  if (slug.length > 80 || !SLUG_RE.test(slug)) throw notFound();
  const row = await repo.findPublishedBySlug(slug);
  if (!row) throw notFound();
  await repo.upsertRsvp(row.id, name, response as "yes" | "no");
}

/** Admin: taklifnomani nashrdan olish (egasi buni qaytara olmaydi: tahrirlash 'status'ni o'zgartirmaydi). */
export async function adminUnpublish(repo: Repo, id: string) {
  return repo.updateInvitation(id, { status: "draft" });
}
