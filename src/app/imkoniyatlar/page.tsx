import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FEATURES } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Imkoniyatlar",
  description: "Taklifnomadagi barcha imkoniyatlar: ochilish marosimi, musiqa, galereya, javoblar, tilaklar kitobi, QR-kod.",
};

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="st-hero-bg">
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-14">
            <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">Taklifnomadagi imkoniyatlar</h1>
            <p className="mt-3 max-w-xl text-muted">Mehmonga qulay, sizga oson: hammasi bitta havolada.</p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([icon, t, d]) => (
              <li key={t} className="st-card rounded-2xl border border-[#e6dcc6] bg-white p-6 shadow-sm">
                <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3ead6] text-xl text-gold-dark">{icon}</span>
                <h2 className="mt-4 font-serif text-xl text-ink">{t}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Link href="/create" className="inline-block rounded-full bg-saffron px-9 py-3.5 font-medium text-white shadow-sm hover:bg-[#0f1a3a]">Hoziroq yaratish</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
