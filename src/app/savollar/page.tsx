import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FAQ } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Ko‘p beriladigan savollar",
  description: "Taklifnoma yaratish, tahrirlash, musiqa va mehmon javoblari haqida savol-javoblar.",
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="st-hero-bg">
          <div className="mx-auto max-w-3xl px-4 pb-6 pt-14">
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">Ko‘p beriladigan savollar</h1>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 pb-20 pt-4">
          <div className="divide-y divide-[#f3d3dc] border-y border-[#f3d3dc]">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                  <span className="mr-2 inline-block text-gold-dark transition-transform group-open:rotate-45">+</span>{q}
                </summary>
                <p className="mt-2 pl-5 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/create" className="inline-block rounded-full bg-saffron px-9 py-3.5 font-medium text-white hover:bg-[#b81a58]">Taklifnoma yaratish</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
