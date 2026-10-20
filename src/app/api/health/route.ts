import { adminClient, getSupabaseEnv } from "@/lib/server/repo.supabase";

/** Xizmat holati. Sozlanmagan yoki baza ishlamasa 503 qaytaradi: "ok" faqat haqiqatan tekshirilgandan keyin. */
export async function GET() {
  const time = new Date().toISOString();
  if (!getSupabaseEnv()) {
    return Response.json({ status: "degraded", time, checks: { config: "missing", database: "not_configured" } }, { status: 503 });
  }
  try {
    const { error } = await adminClient().from("invitations").select("id", { head: true, count: "exact" }).limit(1);
    if (error) throw new Error(error.message);
    return Response.json({ status: "ok", time, checks: { config: "ok", database: "ok" } });
  } catch (e) {
    console.error("[health]", e instanceof Error ? e.message : e);
    return Response.json({ status: "degraded", time, checks: { config: "ok", database: "error" } }, { status: 503 });
  }
}
