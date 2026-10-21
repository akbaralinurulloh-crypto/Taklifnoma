import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppError, notConfigured } from "./errors";
import type {
  InsertResult, InvitationPatch, InvitationRow, InvitationStatus, MusicRow, NewInvitation, Repo, RsvpRow, WishRow,
} from "./repo";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

let cached: SupabaseClient | null = null;

/** Faqat server tomonida: service-role kaliti hech qachon brauzerga chiqmaydi. */
export function adminClient(): SupabaseClient {
  const env = getSupabaseEnv();
  if (!env) throw notConfigured();
  cached ??= createClient(env.url, env.serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}

function dbError(error: { message: string }): never {
  console.error("[db]", error.message);
  throw new AppError(500, "db_error", "Ma’lumotlar bazasi bilan ishlashda xato yuz berdi. Qayta urinib ko‘ring.");
}

export function supabaseRepo(): Repo {
  const db = () => adminClient();
  return {
    async insertInvitation(row: NewInvitation): Promise<InsertResult> {
      const { data, error } = await db().from("invitations").insert(row).select().single();
      if (error) {
        if (error.code === "23505") {
          const text = `${error.message} ${error.details ?? ""}`;
          return { ok: false, conflict: text.includes("idempotency") ? "idempotency" : "slug" };
        }
        dbError(error);
      }
      return { ok: true, row: data as InvitationRow };
    },
    async findByIdempotencyKey(key) {
      const { data, error } = await db().from("invitations").select("*").eq("idempotency_key", key).maybeSingle();
      if (error) dbError(error);
      return (data as InvitationRow | null) ?? null;
    },
    async findPublishedBySlug(slug) {
      const { data, error } = await db()
        .from("invitations").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) dbError(error);
      return (data as InvitationRow | null) ?? null;
    },
    async findByTokenHash(hash) {
      const { data, error } = await db().from("invitations").select("*").eq("edit_token_hash", hash).maybeSingle();
      if (error) dbError(error);
      return (data as InvitationRow | null) ?? null;
    },
    async updateInvitation(id, patch: InvitationPatch) {
      const { data, error } = await db().from("invitations").update(patch).eq("id", id).select().single();
      if (error) dbError(error);
      return data as InvitationRow;
    },
    async getMusic(id) {
      const { data, error } = await db().from("music_tracks").select("id,title,storage_path,is_active").eq("id", id).maybeSingle();
      if (error) dbError(error);
      return (data as MusicRow | null) ?? null;
    },
    async listMusic(activeOnly) {
      let q = db().from("music_tracks").select("id,title,storage_path,is_active").order("created_at");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) dbError(error);
      return (data as MusicRow[]) ?? [];
    },
    async insertMusic(title, storagePath) {
      const { data, error } = await db()
        .from("music_tracks").insert({ title, storage_path: storagePath }).select("id,title,storage_path,is_active").single();
      if (error) dbError(error);
      return data as MusicRow;
    },
    async setMusicActive(id, active) {
      const { error } = await db().from("music_tracks").update({ is_active: active }).eq("id", id);
      if (error) dbError(error);
    },
    async upsertRsvp(invitationId, guestName, response, guests) {
      // Bir xil ism (katta-kichik harfga e'tiborsiz) uchun javob yangilanadi: yagona indeks 0002 migratsiyada.
      const { data: existing, error: e1 } = await db()
        .from("rsvps").select("id,guest_name").eq("invitation_id", invitationId);
      if (e1) dbError(e1);
      const key = guestName.trim().toLowerCase();
      const found = (existing ?? []).find((r: { id: string; guest_name: string }) => r.guest_name.trim().toLowerCase() === key);
      if (found) {
        const { error } = await db().from("rsvps").update({ response, guests }).eq("id", found.id);
        if (error) dbError(error);
        return;
      }
      const { error } = await db().from("rsvps").insert({ invitation_id: invitationId, guest_name: guestName, response, guests });
      if (error && error.code !== "23505") dbError(error);
    },
    async listRsvps(invitationId) {
      const { data, error } = await db()
        .from("rsvps").select("*").eq("invitation_id", invitationId).order("created_at", { ascending: false });
      if (error) dbError(error);
      return (data as RsvpRow[]) ?? [];
    },
    async insertWish(invitationId, guestName, message) {
      const { error } = await db().from("wishes").insert({ invitation_id: invitationId, guest_name: guestName, message });
      if (error) dbError(error);
    },
    async listWishes(invitationId, limit) {
      const { data, error } = await db()
        .from("wishes").select("*").eq("invitation_id", invitationId).order("created_at", { ascending: false }).limit(limit);
      if (error) dbError(error);
      return (data as WishRow[]) ?? [];
    },
    async listInvitations(limit) {
      const { data, error } = await db().from("invitations").select("*").order("created_at", { ascending: false }).limit(limit);
      if (error) dbError(error);
      return (data as InvitationRow[]) ?? [];
    },
    async countByStatus() {
      const out: Record<InvitationStatus, number> = { draft: 0, published: 0, deleted: 0 };
      for (const s of Object.keys(out) as InvitationStatus[]) {
        const { count, error } = await db().from("invitations").select("id", { count: "exact", head: true }).eq("status", s);
        if (error) dbError(error);
        out[s] = count ?? 0;
      }
      return out;
    },
  };
}
