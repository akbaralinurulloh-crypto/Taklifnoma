import { whenParts } from "./when";
import type { InvitationRow } from "./repo";
import type { AssetUrls } from "./service";

/** Tahrirlash sahifasi uchun forma ko'rinishi. edit_token_hash va idempotency_key hech qachon chiqarilmaydi. */
export function editableView(row: InvitationRow, urls: AssetUrls) {
  const { date, time } = whenParts(row.wedding_at);
  return {
    slug: row.slug,
    status: row.status,
    photoPath: row.photo_path,
    photoUrl: row.photo_path ? urls.photo(row.photo_path) : null,
    gallery: (row.gallery ?? []).map((path) => ({ path, url: urls.photo(path) })),
    form: {
      groomName: row.groom_name,
      brideName: row.bride_name,
      date,
      time,
      venueName: row.venue_name,
      venueAddress: row.venue_address,
      extraText: row.extra_text ?? "",
      parents: row.parents ?? "",
      dressCode: row.dress_code ?? "",
      program: row.program ?? [],
      design: row.design,
      musicId: row.music_id,
    },
  };
}
