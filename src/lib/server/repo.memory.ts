// Faqat UNIT testlar uchun xotiradagi Repo. Ishlab chiqarishda ISHLATILMAYDI va haqiqiy ma'lumotlar
// bazasi testlari o'rnini bosmaydi (integratsiya testi alohida: supabase.integration.test.ts).
import { randomUUID } from "node:crypto";
import type {
  InsertResult, InvitationPatch, InvitationRow, InvitationStatus, MusicRow, NewInvitation, Repo, RsvpRow, WishRow,
} from "./repo";

export function memoryRepo(): Repo & { _invitations: InvitationRow[]; _music: MusicRow[] } {
  const invitations: InvitationRow[] = [];
  const music: MusicRow[] = [];
  const rsvps: RsvpRow[] = [];
  const wishes: WishRow[] = [];
  const now = () => new Date().toISOString();

  return {
    _invitations: invitations,
    _music: music,
    async insertInvitation(row: NewInvitation): Promise<InsertResult> {
      if (invitations.some((i) => i.slug === row.slug)) return { ok: false, conflict: "slug" };
      if (invitations.some((i) => i.idempotency_key === row.idempotency_key)) return { ok: false, conflict: "idempotency" };
      const full: InvitationRow = { ...row, id: randomUUID(), created_at: now(), updated_at: now() };
      invitations.push(full);
      return { ok: true, row: { ...full } };
    },
    async findByIdempotencyKey(key) {
      const r = invitations.find((i) => i.idempotency_key === key);
      return r ? { ...r } : null;
    },
    async findPublishedBySlug(slug) {
      const r = invitations.find((i) => i.slug === slug && i.status === "published");
      return r ? { ...r } : null;
    },
    async findByTokenHash(hash) {
      const r = invitations.find((i) => i.edit_token_hash === hash);
      return r ? { ...r } : null;
    },
    async updateInvitation(id, patch: InvitationPatch) {
      const r = invitations.find((i) => i.id === id);
      if (!r) throw new Error("topilmadi");
      Object.assign(r, patch, { updated_at: now() });
      return { ...r };
    },
    async getMusic(id) {
      return music.find((m) => m.id === id) ?? null;
    },
    async listMusic(activeOnly) {
      return music.filter((m) => !activeOnly || m.is_active);
    },
    async insertMusic(title, storagePath) {
      const m: MusicRow = { id: randomUUID(), title, storage_path: storagePath, is_active: true };
      music.push(m);
      return m;
    },
    async setMusicActive(id, active) {
      const m = music.find((x) => x.id === id);
      if (m) m.is_active = active;
    },
    async upsertRsvp(invitationId, guestName, response, guests) {
      const key = guestName.trim().toLowerCase();
      const f = rsvps.find((r) => r.invitation_id === invitationId && r.guest_name.trim().toLowerCase() === key);
      if (f) { f.response = response; f.guests = guests; }
      else rsvps.push({ id: randomUUID(), invitation_id: invitationId, guest_name: guestName, response, guests, created_at: now() });
    },
    async listRsvps(invitationId) {
      return rsvps.filter((r) => r.invitation_id === invitationId);
    },
    async insertWish(invitationId, guestName, message) {
      wishes.push({ id: randomUUID(), invitation_id: invitationId, guest_name: guestName, message, created_at: now() });
    },
    async listWishes(invitationId, limit) {
      return wishes.filter((w) => w.invitation_id === invitationId).reverse().slice(0, limit);
    },
    async listInvitations(limit) {
      return invitations.slice(0, limit).map((i) => ({ ...i }));
    },
    async countByStatus() {
      const out: Record<InvitationStatus, number> = { draft: 0, published: 0, deleted: 0 };
      for (const i of invitations) out[i.status]++;
      return out;
    },
  };
}
