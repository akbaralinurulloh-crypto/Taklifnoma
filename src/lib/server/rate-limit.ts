import { AppError } from "./errors";

// Eslatma: bu xotiradagi (har bir server nusxasi uchun alohida) cheklov. Vercel kabi serverless
// muhitda to'liq himoya uchun Vercel Firewall yoki Upstash kabi umumiy xizmat qo'shish tavsiya etiladi.
const buckets = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(req: Request, name: string, max: number, windowMs: number, now = Date.now()) {
  const key = `${name}:${clientIp(req)}`;
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    throw new AppError(429, "rate_limited", "Juda ko‘p so‘rov yuborildi. Birozdan so‘ng qayta urinib ko‘ring.");
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
}

export function resetRateLimits() {
  buckets.clear();
}
