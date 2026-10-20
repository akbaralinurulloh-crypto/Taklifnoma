import type { MetadataRoute } from "next";
import { DESIGNS } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (!base) return [];
  const paths = ["/", "/dizaynlar", "/create", "/maxfiylik", "/shartlar", ...DESIGNS.map((d) => `/namuna/${d}`)];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
