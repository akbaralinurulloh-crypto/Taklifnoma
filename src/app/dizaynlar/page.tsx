import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PhonePreview } from "@/components/site/PhonePreview";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import { sampleInvitation } from "@/lib/sample";

export const metadata: Metadata = {
  title: "Taklifnoma dizaynlari",
  description: "O‘nta alohida to‘y taklifnomasi dizayni: klassik, milliy, Registon, yulduzli tun va boshqalar.",
};

export default function DesignsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-6 pt-12">
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">O‘nta dizayn</h1>
          <p className="mt-3 max-w-xl text-muted">
            Har birining o‘z tuzilmasi, ranglari va animatsiyasi bor. Namunani to‘liq ochib ko‘ring yoki darhol shu dizaynda yarating.
          </p>
        </section>
        <section className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 px-4 pb-20 pt-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Dizaynlar ro‘yxati">
          {DESIGNS.map((d) => (
            <article key={d} id={d} className="flex flex-col items-center sm:items-start">
              <PhonePreview data={sampleInvitation(d)} width={300} height={520} href={`/namuna/${d}`} label={`${DESIGN_LABELS[d]} namunasini ochish`} />
              <h2 className="mt-4 font-serif text-2xl text-ink">{DESIGN_LABELS[d]}</h2>
              <p className="mt-1 max-w-[300px] text-sm leading-relaxed text-muted">{DESIGN_DESCRIPTIONS[d]}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/namuna/${d}`} className="rounded-full border border-[#b7cdbf] px-4 py-2 text-sm text-ink hover:border-ink">Namunani ko‘rish</Link>
                <Link href={`/create?dizayn=${d}`} className="rounded-full bg-gold-dark px-4 py-2 text-sm text-white hover:bg-ink">Shu dizaynda yaratish</Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
