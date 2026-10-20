import type { Design } from "@/lib/schema";

export type InvitationStatus = "draft" | "published" | "deleted";

export type InvitationRow = {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  wedding_at: string;
  venue_name: string;
  venue_address: string;
  extra_text: string | null;
  photo_path: string | null;
  design: Design;
  music_id: string | null;
  status: InvitationStatus;
  edit_token_hash: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type NewInvitation = Omit<InvitationRow, "id" | "created_at" | "updated_at">;
export type InvitationPatch = Partial<
  Pick<
    InvitationRow,
    | "groom_name" | "bride_name" | "wedding_at" | "venue_name" | "venue_address"
    | "extra_text" | "photo_path" | "design" | "music_id" | "status" | "published_at"
  >
>;

export type MusicRow = { id: string; title: string; storage_path: string; is_active: boolean };
export type RsvpRow = {
  id: string;
  invitation_id: string;
  guest_name: string;
  response: "yes" | "no";
  created_at: string;
};

export type InsertResult =
  | { ok: true; row: InvitationRow }
  | { ok: false; conflict: "slug" | "idempotency" };

/** Ma'lumotlar bazasi bilan ishlash chegarasi. Servis mantiqi faqat shu interfeysga tayanadi. */
export interface Repo {
  insertInvitation(row: NewInvitation): Promise<InsertResult>;
  findByIdempotencyKey(key: string): Promise<InvitationRow | null>;
  findPublishedBySlug(slug: string): Promise<InvitationRow | null>;
  findByTokenHash(hash: string): Promise<InvitationRow | null>;
  updateInvitation(id: string, patch: InvitationPatch): Promise<InvitationRow>;
  getMusic(id: string): Promise<MusicRow | null>;
  listMusic(activeOnly: boolean): Promise<MusicRow[]>;
  insertMusic(title: string, storagePath: string): Promise<MusicRow>;
  setMusicActive(id: string, active: boolean): Promise<void>;
  upsertRsvp(invitationId: string, guestName: string, response: "yes" | "no"): Promise<void>;
  listRsvps(invitationId: string): Promise<RsvpRow[]>;
  listInvitations(limit: number): Promise<InvitationRow[]>;
  countByStatus(): Promise<Record<InvitationStatus, number>>;
}
