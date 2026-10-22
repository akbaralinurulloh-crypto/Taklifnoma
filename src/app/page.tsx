import Link from "next/link";
import { HeroDemo } from "@/components/HeroDemo";
import { THEMES, type GateKind } from "@/components/invitation/themes";
import { PhonePreview } from "@/components/site/PhonePreview";
import { Logo, SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import { sampleInvitation } from "@/lib/sample";
import { backendConfigured } from "@/lib/server/tracks";
import { FAQ, FEATURES, STEPS } from "@/lib/site-content";

export const dynamic = "force-dynamic"; // server sozlamasi holati har so‘rovda tekshiriladi

const GATE_LABEL: Record<GateKind, string> = {
  envelope: "Konvert", seal: "Mum muhr", heart: "Yurak", doors: "Darvoza", swipe: "Surib ochish", button: "Karta",
};

const btn = "inline-block rounded-full px-8 py-3.5 font-medium shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function Home() {
  const ready = backendConfigured();
  return (
    <>
      {!ready && (
        <div className="bg-gold/25 px-4 py-2 text-center text-xs text-ink">
          Server hali ulanmagan: taklifnomani saqlash va nashr qilish vaqtincha o‘chirilgan.
        </div>
      )}
      <SiteHeader />

      <main className="flex-1">
        {/* 1. Hero */}
        <section className="st-hero-bg">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:pt-16">
            <HeroDemo>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-gold-dark">
                <span aria-hidden>✉</span> Yaratish bepul · ro‘yxatdan o‘tish shart emas
              </p>
              <h1 className="mt-5 max-w-2xl font-serif text-[clamp(2.3rem,5.4vw,3.8rem)] leading-[1.05] tracking-tight text-ink">
                Taklifnoma konvert kabi ochiladi
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Ismlar, sana va dasturni kiriting, dizaynni tanlang va havolani WhatsApp yoki Telegram orqali yuboring.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/create" className={`${btn} bg-saffron text-white hover:bg-ink`}>Hoziroq yaratish</Link>
                <Link href="/dizaynlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">Shablonlarni ko‘rish</Link>
              </div>
            </HeroDemo>
          </div>
        </section>

        {/* 2. Qora-ko'k lenta: ko'rsatkichlar */}
        <section aria-label="Qisqacha" className="bg-ink text-white">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/15 px-4 py-6 text-center sm:grid-cols-4">
            {[["15", "nafis dizayn"], ["2", "til: o‘zbek, rus"], ["♫", "dizaynga mos musiqa"], ["0 so‘m", "yaratish bepul"]].map(([n, l]) => (
              <li key={l} className="px-2"><p className="font-serif text-3xl text-gold">{n}</p><p className="text-xs text-white/70">{l}</p></li>
            ))}
          </ul>
        </section>

        {/* 3. Shablonlar: gorizontal karusel */}
        <section className="py-16" aria-labelledby="designs">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.25em] text-gold-dark">Shablonlar</p>
              <h2 id="designs" className="mt-2 font-serif text-3xl text-ink">Yonga suring va tanlang</h2>
            </div>
            <Link href="/dizaynlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">Hammasini ko‘rish</Link>
          </div>
          <ul className="st-scroll mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
            {DESIGNS.map((d) => (
              <li key={d} className="st-card flex w-[190px] shrink-0 snap-start flex-col items-center rounded-2xl bg-white p-3 text-center shadow-sm">
                <PhonePreview data={sampleInvitation(d)} width={170} height={300} href={`/namuna/${d}`} label={`${DESIGN_LABELS[d]} namunasini ochish`} />
                <span className="mt-3 font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                <span className="mt-1 rounded-full bg-beige px-3 py-0.5 text-[11px] text-gold-dark">{GATE_LABEL[THEMES[d].gate]}</span>
                <span className="mt-2 text-xs leading-relaxed text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Bento: imkoniyatlar */}
        <section className="bg-beige py-16" aria-labelledby="features">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[.25em] text-gold-dark">Imkoniyatlar</p>
                <h2 id="features" className="mt-2 font-serif text-3xl text-ink">Taklifnomada nimalar bor</h2>
              </div>
              <Link href="/imkoniyatlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">Hammasi</Link>
            </div>
            <ul className="mt-10 grid auto-rows-[minmax(150px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.slice(0, 7).map(([icon, t, d], i) => (
                <li
                  key={t}
                  className={`st-card rounded-3xl p-6 ${
                    i === 0 ? "relative overflow-hidden bg-ink text-white sm:col-span-2 lg:row-span-2" : i === 4 ? "bg-saffron text-white lg:col-span-2" : "border border-[#e6dcc6] bg-white"
                  }`}
                >
                  <span aria-hidden className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${i === 0 || i === 4 ? "bg-white/15 text-gold" : "bg-beige text-gold-dark"}`}>{icon}</span>
                  <h3 className={`mt-4 font-serif ${i === 0 ? "text-3xl" : "text-xl"}`}>{t}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${i === 0 || i === 4 ? "text-white/80" : "text-muted"}`}>{d}</p>
                  {i === 0 && <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-4 text-[11rem] leading-none text-gold/20">✉</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Qadamlar: vaqt chizig'i */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16" aria-labelledby="how-t">
          <p className="text-xs font-medium uppercase tracking-[.25em] text-gold-dark">Uch qadam</p>
          <h2 id="how-t" className="mt-2 font-serif text-3xl text-ink">Qanday ishlaydi</h2>
          <ol className="relative mt-12 grid gap-10 sm:grid-cols-3">
            <span aria-hidden className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-gold/60 sm:block" />
            {STEPS.map(([t, d], i) => (
              <li key={t} className="relative text-center">
                <span aria-hidden className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink font-serif text-2xl text-gold ring-8 ring-[#faf6ee]">{i + 1}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{t}</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 6. Mehmonlar paneli */}
        <section className="bg-ink py-16 text-white" aria-labelledby="guests">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.25em] text-gold">Mehmonlar</p>
              <h2 id="guests" className="mt-2 font-serif text-3xl">Javoblar bir joyda</h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/80">
                Har mehmon ismini yozib “kelaman” yoki “kelmayman” deydi, necha kishi kelishini ham yuboradi va tilak qoldiradi.
                Hammasi sizning maxfiy sahifangizda ro‘yxat bo‘lib turadi.
              </p>
              <Link href="/create" className={`${btn} mt-6 bg-gold text-ink hover:bg-white`}>Boshlash</Link>
            </div>
            <div className="rounded-3xl bg-white p-6 text-ink shadow-xl" aria-label="Namuna ko‘rinishi">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[["32", "keladi"], ["5", "kelolmaydi"], ["71", "jami kishi"]].map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-beige py-3"><p className="font-serif text-2xl text-gold-dark">{n}</p><p className="text-[11px] text-muted">{l}</p></div>
                ))}
              </div>
              <ul className="mt-4 divide-y divide-[#ece3cf] text-sm">
                {[["Jasur Karimov", "Keladi"], ["Dilnoza Aliyeva", "Keladi"], ["Bobur Rashidov", "Kelolmaydi"]].map(([n, r]) => (
                  <li key={n} className="flex items-center justify-between py-3">
                    <span>{n}</span>
                    <span className={`rounded-full px-3 py-0.5 text-xs ${r === "Keladi" ? "bg-beige text-gold-dark" : "bg-[#fff1d6] text-[#8a5a00]"}`}>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted">Namuna ma’lumot</p>
            </div>
          </div>
        </section>

        {/* 7. Savollar: ikki ustun */}
        <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-16 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq-t">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.25em] text-gold-dark">Savollar</p>
            <h2 id="faq-t" className="mt-2 font-serif text-3xl text-ink">Ko‘p beriladigan savollar</h2>
            <Link href="/savollar" className="mt-4 inline-block text-sm font-medium text-gold-dark underline underline-offset-4">Barcha savollar</Link>
          </div>
          <div className="divide-y divide-[#e6dcc6] border-y border-[#e6dcc6]">
            {FAQ.slice(0, 5).map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-gold">
                  <span className="mr-2 inline-block text-gold-dark transition-transform group-open:rotate-45">+</span>{q}
                </summary>
                <p className="mt-2 pl-5 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 8. Yakuniy chaqiriq */}
        <section className="bg-saffron py-16 text-center text-white">
          <div className="flex justify-center"><Logo light /></div>
          <h2 className="mx-auto mt-6 max-w-xl px-4 font-serif text-3xl">To‘yingizga taklifnomani bugun tayyorlang</h2>
          <Link href="/create" className={`${btn} mt-7 bg-gold text-ink hover:bg-white`}>Hoziroq yaratish</Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
