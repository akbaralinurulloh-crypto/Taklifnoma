import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "./errors";

export const ADMIN_COOKIE = "admin_session";
const SESSION_MS = 8 * 60 * 60 * 1000;

function secret(): string | null {
  const s = process.env.ADMIN_SECRET;
  return s && s.length >= 16 ? s : null;
}

/** ADMIN_SECRET o'rnatilmagan yoki juda qisqa bo'lsa admin panel "tayyor emas" hisoblanadi. */
export function adminConfigured(): boolean {
  return secret() !== null;
}

const sha = (v: string) => createHash("sha256").update(v).digest();

export function checkAdminSecret(input: string): boolean {
  const s = secret();
  if (!s) return false;
  return timingSafeEqual(sha(input), sha(s));
}

function sign(exp: string, s: string) {
  return createHmac("sha256", s).update(`taklifnoma-admin-v1:${exp}`).digest("hex");
}

export function makeAdminSession(now = Date.now()): string {
  const s = secret();
  if (!s) throw new AppError(503, "not_configured", "Admin panel sozlanmagan.");
  const exp = String(now + SESSION_MS);
  return `${exp}.${sign(exp, s)}`;
}

export function isValidAdminSession(value: string | undefined | null, now = Date.now()): boolean {
  const s = secret();
  if (!s || !value) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  const expected = sign(exp, s);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionMaxAgeSeconds() {
  return SESSION_MS / 1000;
}

function cookieFromRequest(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Admin amallari faqat server tomonida tekshiriladi (interfeysga ishonilmaydi). */
export function requireAdmin(req: Request) {
  if (!adminConfigured()) throw new AppError(503, "not_configured", "Admin panel sozlanmagan.");
  if (!isValidAdminSession(cookieFromRequest(req, ADMIN_COOKIE))) {
    throw new AppError(401, "unauthorized", "Admin sifatida kirilmagan.");
  }
  assertSameOrigin(req);
}

/** CSRF'ga qarshi qo'shimcha himoya: Origin bo'lsa, u sayt hosti bilan bir xil bo'lishi kerak. */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (new URL(origin).host !== host) throw new Error("origin");
  } catch {
    throw new AppError(403, "forbidden", "So‘rov manbasi ruxsat etilmagan.");
  }
}
