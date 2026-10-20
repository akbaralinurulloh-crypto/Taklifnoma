import { ADMIN_COOKIE, adminConfigured, assertSameOrigin, checkAdminSecret, makeAdminSession, sessionMaxAgeSeconds } from "@/lib/server/admin";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(req: Request) {
  try {
    if (!adminConfigured()) throw new AppError(503, "not_configured", "Admin panel sozlanmagan: ADMIN_SECRET (kamida 16 belgi) o‘rnatilmagan.");
    assertSameOrigin(req);
    rateLimit(req, "admin-login", 5, 10 * 60_000);
    const body = (await req.json().catch(() => null)) as { secret?: unknown } | null;
    if (typeof body?.secret !== "string" || !checkAdminSecret(body.secret)) {
      throw new AppError(401, "unauthorized", "Maxfiy kalit noto‘g‘ri.");
    }
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": `${ADMIN_COOKIE}=${encodeURIComponent(makeAdminSession())}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionMaxAgeSeconds()}${secure}`,
      },
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
