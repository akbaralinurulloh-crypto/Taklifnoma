// HAQIQIY Supabase'ga qarshi integratsiya testi. Kalitlar bo'lmasa BLOKLANGAN: test o'tkazib yuboriladi
// (o'tdi deb hisoblanmaydi). Ishga tushirish: .env.local to'ldirilgach `npm run test:integration`.
import { createClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";
import { makeEditToken } from "@/lib/invitation";
import { supabaseRepo } from "./repo.supabase";
import { createInvitation, deleteInvitation, getPublicBySlug, submitRsvp, updateInvitation } from "./service";
import { defaultUrls } from "./storage";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = Boolean(URL && ANON && SERVICE);

describe.skipIf(!enabled)("Supabase integratsiyasi (haqiqiy baza)", () => {
  const repo = enabled ? supabaseRepo() : (null as never);
  const anon = enabled ? createClient(URL!, ANON!, { auth: { persistSession: false } }) : (null as never);
  const token = makeEditToken().token;
  const key = `it-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  let slug = "";
  let id = "";

  const fields = {
    groomName: "Test", brideName: "Integratsiya", date: "2099-05-20", time: "18:30",
    venueName: "Zal", venueAddress: "Namangan", design: "zarrin",
  };

  afterAll(async () => {
    if (id) await repo.updateInvitation(id, { status: "deleted" });
  });

  it("taklifnoma bazaga yoziladi va qayta o'qiladi", async () => {
    const { row } = await createInvitation(repo, { ...fields, idempotencyKey: key, editToken: token });
    slug = row.slug;
    id = row.id;
    const pub = await getPublicBySlug(repo, slug, defaultUrls);
    expect(pub).toMatchObject({ groomName: "Test", design: "zarrin", weddingAt: "2099-05-20T13:30:00.000Z" });
  });

  it("takroriy so'rov dublikat yaratmaydi (UNIQUE cheklov)", async () => {
    const again = await createInvitation(repo, { ...fields, idempotencyKey: key, editToken: token });
    expect(again.replay).toBe(true);
    expect(again.row.id).toBe(id);
  });

  it("RLS: anon nashr qilingan qatorni o'qiydi, lekin maxfiy ustunlarni (edit_token_hash) o'qiy olmaydi", async () => {
    const ok = await anon.from("invitations").select("slug,groom_name").eq("slug", slug).maybeSingle();
    expect(ok.error).toBeNull();
    expect(ok.data?.groom_name).toBe("Test");
    const secret = await anon.from("invitations").select("edit_token_hash").eq("slug", slug);
    expect(secret.error).not.toBeNull(); // ustun GRANT qilinmagan
    const star = await anon.from("invitations").select("*").eq("slug", slug);
    expect(star.error).not.toBeNull();
  });

  it("RLS: anon yoza olmaydi (insert/update/delete)", async () => {
    const ins = await anon.from("invitations").insert({ slug: "hack-hack-1234" });
    expect(ins.error).not.toBeNull();
    const upd = await anon.from("invitations").update({ groom_name: "Hack" }).eq("slug", slug).select();
    expect(upd.error !== null || (upd.data ?? []).length === 0).toBe(true);
    const del = await anon.from("invitations").delete().eq("slug", slug).select();
    expect(del.error !== null || (del.data ?? []).length === 0).toBe(true);
    const still = await getPublicBySlug(repo, slug, defaultUrls);
    expect(still?.groomName).toBe("Test");
  });

  it("RLS: anon rsvps jadvalini o'qiy olmaydi", async () => {
    const r = await anon.from("rsvps").select("*");
    expect(r.error !== null || (r.data ?? []).length === 0).toBe(true);
  });

  it("tahrirlash ommaviy sahifada aks etadi; RSVP saqlanadi", async () => {
    await updateInvitation(repo, token, { ...fields, venueName: "Yangi zal" });
    expect((await getPublicBySlug(repo, slug, defaultUrls))?.venueName).toBe("Yangi zal");
    await submitRsvp(repo, slug, { guestName: "Ali", response: "yes" });
    await submitRsvp(repo, slug, { guestName: "ali", response: "no" });
    const list = await repo.listRsvps(id);
    expect(list).toHaveLength(1);
    expect(list[0].response).toBe("no");
  });

  it("o'chirilgach ommaviy sahifa yopiladi", async () => {
    await deleteInvitation(repo, token);
    expect(await getPublicBySlug(repo, slug, defaultUrls)).toBeNull();
    const viaAnon = await anon.from("invitations").select("slug").eq("slug", slug).maybeSingle();
    expect(viaAnon.data).toBeNull();
  });
});
