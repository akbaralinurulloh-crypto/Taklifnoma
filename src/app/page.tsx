import Link from "next/link";
import { InvitationView } from "@/components/InvitationView";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import type { PublicInvitation } from "@/lib/types";
import { HeroDemo } from "@/components/HeroDemo";
import { backendConfigured } from "@/lib/server/tracks";

export const dynamic = "force-dynamic"; // server sozlamasi holati har so‘rovda tekshiriladi

// Faqat dizaynlarni ko'rsatish uchun namuna ma'lumot (haqiqiy taklifnoma emas).
const SAMPLE: Omit<PublicInvitation, "design"> = {
  groomName: "Aziz",
  brideName: "Madina",
  weddingAt: "2030-06-12T13:00:00.000Z",
  venueName: "Registon to‘yxonasi",
  venueAddress: "Namangan sh., Navoiy ko‘chasi 12",
  extraText: "Sizni to‘yimizda ko‘rishdan baxtiyormiz.",
  photoUrl: null,
  music: null,
};

const BENEFITS = [
  ["Telefon uchun yaratilgan", "Taklifnoma 360 px kenglikdagi ekranda ham to‘liq va o‘qiladigan ko‘rinadi."],
  ["To‘ygacha hisoblagich", "Kun, soat, daqiqa va soniya Toshkent vaqti bo‘yicha sanaladi."],
  ["Xaritada ko‘rish", "Mehmon manzil ustiga bosadi va yo‘nalish ochiladi."],
  ["Musiqa", "Yor-yor yoki o‘zingiz tanlagan kuy, mehmon xohlasa yoqadi."],
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
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const ready = backendConfigured();
  return (
    <>
      {!ready && (
        <div className="bg-saffron/20 px-4 py-2 text-center text-xs text-ink">
          Server hali ulanmagan: taklifnomani saqlash va nashr qilish vaqtincha o‘chirilgan.
        </div>
      )}

      <div aria-hidden className="h-1.5 bg-[repeating-linear-gradient(90deg,#0d7c7a_0_28px,#0f2a43_28px_56px,#f0a62b_56px_70px,#fff_70px_76px)]" />
      <header className="bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-serif text-2xl text-ink">
            <svg viewBox="0 0 24 28" aria-hidden className="h-6 w-5">
              <path d="M12 1C20 8 22 18 12 27 2 18 4 8 12 1z" fill="#0d7c7a" />
              <path d="M12 8c4 3 5 8 0 12-5-4-4-9 0-12z" fill="#f0a62b" />
            </svg>
            Taklifnoma
          </span>
          <Link href="/create" className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark">
            Taklifnoma yaratish
          </Link>
        </div>
      </header>

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
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="designs" className="font-serif text-3xl text-ink">Oltita dizayn</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Har biri o‘z kompozitsiyasi va animatsiyasiga ega. Quyida namuna ma’lumotlar bilan ko‘rsatilgan.
            </p>
          </div>
          <div className="mt-8 flex tk-strip snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
            {DESIGNS.map((d) => (
              <figure key={d} className="w-[250px] shrink-0 snap-start">
                <div aria-hidden className="pointer-events-none relative h-[430px] w-[250px] select-none overflow-hidden rounded-2xl border border-[#cfdcd9] bg-white shadow-[0_20px_40px_-24px_rgba(15,42,67,.5)]">
                  <div className="absolute left-0 top-0 w-[420px] origin-top-left scale-[0.595]">
                    <InvitationView data={{ ...SAMPLE, design: d }} />
                  </div>
                </div>
                <figcaption className="mt-3">
                  <span className="block font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                  <span className="block text-xs leading-relaxed text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
                </figcaption>
              </figure>
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
          <div className="mt-8 divide-y divide-[#cfdcd9] border-y border-[#cfdcd9]">
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

      <footer className="border-t border-[#cfdcd9] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© Taklifnoma</span>
          <nav className="flex flex-wrap gap-4" aria-label="Pastki menyu">
            {contact && (
              <a href={`mailto:${contact}`} className="underline underline-offset-4">
                Aloqa: {contact}
              </a>
            )}
            <Link href="/maxfiylik" className="underline underline-offset-4">Maxfiylik siyosati</Link>
            <Link href="/shartlar" className="underline underline-offset-4">Foydalanish shartlari</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
