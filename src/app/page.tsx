import Link from "next/link";
import { PhonePreview } from "@/components/site/PhonePreview";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { sampleInvitation } from "@/lib/sample";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import { HeroDemo } from "@/components/HeroDemo";
import { backendConfigured } from "@/lib/server/tracks";

export const dynamic = "force-dynamic"; // server sozlamasi holati har so‘rovda tekshiriladi

const BENEFITS = [
  ["Telefon uchun yaratilgan", "Taklifnoma 360 px kenglikdagi ekranda ham to‘liq va o‘qiladigan ko‘rinadi."],
  ["To‘ygacha hisoblagich", "Kun, soat, daqiqa va soniya Toshkent vaqti bo‘yicha sanaladi."],
  ["Xaritada ko‘rish", "Mehmon manzil ustiga bosadi va yo‘nalish ochiladi."],
  ["Musiqa", "Yor-yor yoki o‘zingiz tanlagan kuy, mehmon xohlasa yoqadi."],
  ["Konvert ochiladi", "Mehmon avval yopiq konvertni ko‘radi, muhrni bosganda taklifnoma ochiladi."],
  ["Taqvimga qo‘shish", "Bir bosishda to‘y sanasi mehmonning telefon taqvimiga tushadi."],
  ["Kelaman / kelmayman", "Mehmon javobini yozadi, siz javoblar ro‘yxatini tahrirlash sahifasida ko‘rasiz."],
] as const;

const STEPS = [
  ["Ma’lumotlarni kiriting", "Kuyov va kelin ismi, sana, vaqt va to‘yxona manzili."],
  ["Rasm tanlang", "Juftlik rasmini yuklang. Rasm bo‘lmasa, dizayn ismlaringizdan bezak yasaydi."],
  ["Dizayn va musiqani tanlang", "O‘ng tomondagi ko‘rinishda taklifnoma o‘sha zahoti o‘zgaradi."],
  ["Havolani yuboring", "Saqlang va tayyor havolani WhatsApp yoki Telegram orqali mehmonlarga jo‘nating."],
] as const;

const FAQ = [
  ["Taklifnomani ro‘yxatdan o‘tmasdan yaratsam bo‘ladimi?", "Ha. Tahrirlash uchun alohida maxfiy havola beriladi, ommaviy havola orqali taklifnomani o‘zgartirib bo‘lmaydi."],
  ["Musiqa qanday tanlanadi?", "Faqat litsenziyasi tasdiqlangan audio fayllar katalogidan. Katalog to‘lgunga qadar taklifnomani musiqasiz yaratish mumkin."],
  ["Mehmonlar taklifnomani qanday ochadi?", "Nashr qilingach beriladigan noyob havola orqali: ilova o‘rnatish shart emas."],
] as const;

export default function Home() {
  const ready = backendConfigured();
  return (
    <>
      {!ready && (
        <div className="bg-saffron/20 px-4 py-2 text-center text-xs text-ink">
          Server hali ulanmagan: taklifnomani saqlash va nashr qilish vaqtincha o‘chirilgan.
        </div>
      )}

      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-16">
          <HeroDemo>
            <h1 className="max-w-2xl font-serif text-[clamp(2.3rem,5.4vw,3.8rem)] leading-[1.05] tracking-tight text-ink">
              Taklifnomangiz mehmonlar telefonida ochiladi
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Ismlar, sana va manzilni kiriting, dizaynni tanlang. Tayyor havolani WhatsApp yoki Telegram orqali yuboring.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/create" className="rounded-full bg-gold-dark px-8 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark">
                Taklifnoma yaratish
              </Link>
              <span className="text-sm text-muted">Ro‘yxatdan o‘tish shart emas.</span>
            </div>
          </HeroDemo>
        </section>

        <section className="bg-beige/70 py-16" aria-labelledby="designs">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-4">
            <div>
              <h2 id="designs" className="font-serif text-3xl text-ink">O‘nta dizayn</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Har biri o‘z kompozitsiyasi va animatsiyasiga ega. Bosing va to‘liq ko‘ring.
              </p>
            </div>
            <Link href="/dizaynlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">
              Barcha dizaynlarni ko‘rish
            </Link>
          </div>
          <div className="tk-strip mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
            {DESIGNS.map((d) => (
              <div key={d} className="w-[250px] shrink-0 snap-start">
                <PhonePreview data={sampleInvitation(d)} href={`/namuna/${d}`} label={`${DESIGN_LABELS[d]} namunasini ochish`} />
                <span className="mt-3 block font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                <span className="block text-xs leading-relaxed text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="how">
          <h2 id="how" className="font-serif text-3xl text-ink">Qanday ishlaydi</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="relative border-t-2 border-gold-dark pt-4">
                <span aria-hidden className="font-serif text-5xl leading-none text-gold/40">{i + 1}</span>
                <h3 className="mt-3 font-serif text-xl text-ink">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-ink py-16 text-white" aria-labelledby="benefits">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="benefits" className="font-serif text-3xl">Mehmon nimani ko‘radi</h2>
            <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {BENEFITS.map(([t, d]) => (
                <div key={t} className="border-l-2 border-saffron pl-5">
                  <dt className="font-serif text-xl">{t}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-white/75">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq">
          <h2 id="faq" className="font-serif text-3xl text-ink">Ko‘p beriladigan savollar</h2>
          <div className="mt-8 divide-y divide-[#cfe0d5] border-y border-[#cfe0d5]">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-gold-dark">
                  <span className="mr-2 inline-block text-gold-dark transition-transform group-open:rotate-45">+</span>
                  {q}
                </summary>
                <p className="mt-2 pl-5 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
