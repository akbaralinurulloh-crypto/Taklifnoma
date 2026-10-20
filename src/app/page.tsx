import Link from "next/link";
import { InvitationView } from "@/components/InvitationView";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import type { PublicInvitation } from "@/lib/types";

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
  ["Oltita alohida dizayn", "Klassikdan hashamatligacha: har biri o‘z kompozitsiyasiga ega."],
  ["Telefonga mos", "Taklifnoma 360 px kenglikdagi ekranlarda ham to‘g‘ri ko‘rinadi."],
  ["To‘ygacha hisoblagich", "Kun, soat, daqiqa va soniya, Toshkent vaqti bo‘yicha."],
  ["Xaritada ko‘rish", "Kiritilgan manzil bo‘yicha xaritani ochuvchi havola."],
] as const;

const STEPS = [
  "Kuyov va kelin, sana, vaqt va manzilni kiriting.",
  "Juftlik rasmini tanlang.",
  "Dizayn va musiqani tanlab, jonli ko‘rinishni ko‘ring.",
  "Saqlab, nashr qiling va noyob havolani mehmonlarga yuboring.",
] as const;

const FAQ = [
  ["Taklifnomani ro‘yxatdan o‘tmasdan yaratsam bo‘ladimi?", "Ha. Tahrirlash uchun alohida maxfiy havola beriladi, ommaviy havola orqali taklifnomani o‘zgartirib bo‘lmaydi."],
  ["Musiqa qanday tanlanadi?", "Faqat litsenziyasi tasdiqlangan audio fayllar katalogidan. Katalog to‘lgunga qadar taklifnomani musiqasiz yaratish mumkin."],
  ["Mehmonlar taklifnomani qanday ochadi?", "Nashr qilingach beriladigan noyob havola orqali: ilova o‘rnatish shart emas."],
] as const;

export default function Home() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
        Platforma ishlab chiqilmoqda: saqlash va nashr qilish serverga ulangach ishga tushadi.
      </div>

      <header className="border-b border-[#e4d9c3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-serif text-2xl text-ink">Taklifnoma</span>
          <Link href="/create" className="rounded-full bg-gold-dark px-5 py-2 text-sm font-medium text-white hover:bg-gold">
            Yaratish
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">Taklifnomangizni yarating</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Raqamli to‘y taklifnomasini o‘zingiz tuzing: dizaynni tanlang, ma’lumotlarni kiriting va jonli
            ko‘rinishni ko‘ring.
          </p>
          <Link href="/create" className="mt-8 inline-block rounded-full bg-gold-dark px-8 py-3 font-medium text-white hover:bg-gold">
            Taklifnoma yaratish
          </Link>
        </section>

        <section className="bg-beige/50 py-14" aria-labelledby="designs">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="designs" className="text-center font-serif text-3xl text-ink">Oltita dizayn</h2>
            <p className="mt-2 text-center text-xs text-muted">Quyida namuna ma’lumotlar bilan ko‘rsatilgan.</p>
            <div className="mt-10 grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {DESIGNS.map((d) => (
                <figure key={d} className="w-[250px]">
                  <div aria-hidden className="pointer-events-none relative h-[430px] w-[250px] select-none overflow-hidden rounded-xl border border-[#e4d9c3] bg-white shadow-sm">
                    <div className="absolute left-0 top-0 w-[420px] origin-top-left scale-[0.595]">
                      <InvitationView data={{ ...SAMPLE, design: d }} />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center">
                    <span className="block font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                    <span className="block text-xs text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="benefits">
          <h2 id="benefits" className="text-center font-serif text-3xl text-ink">Afzalliklar</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-[#e4d9c3] bg-white p-5">
                <h3 className="font-serif text-lg text-ink">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-beige/50 py-14" aria-labelledby="how">
          <div className="mx-auto max-w-3xl px-4">
            <h2 id="how" className="text-center font-serif text-3xl text-ink">Qanday ishlaydi</h2>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-4 rounded-xl bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-dark text-sm text-white">{i + 1}</span>
                  <span className="text-ink">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="faq">
          <h2 id="faq" className="text-center font-serif text-3xl text-ink">Ko‘p beriladigan savollar</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="rounded-xl border border-[#e4d9c3] bg-white p-4">
                <summary className="cursor-pointer font-medium text-ink">{q}</summary>
                <p className="mt-2 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4d9c3] bg-white">
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
