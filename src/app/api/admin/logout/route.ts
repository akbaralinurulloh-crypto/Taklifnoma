import { ADMIN_COOKIE, assertSameOrigin } from "@/lib/server/admin";
import { toErrorResponse } from "@/lib/server/errors";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
