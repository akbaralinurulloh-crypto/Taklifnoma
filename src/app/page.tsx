import Link from "next/link";
import { HeroDemo } from "@/components/HeroDemo";
import { THEMES, type GateKind } from "@/components/invitation/themes";
import { PhonePreview } from "@/components/site/PhonePreview";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS } from "@/lib/schema";
import { sampleInvitation } from "@/lib/sample";
import { backendConfigured } from "@/lib/server/tracks";

export const dynamic = "force-dynamic"; // server sozlamasi holati har so‘rovda tekshiriladi

const GATE_LABEL: Record<GateKind, string> = {
  envelope: "Konvert",
  seal: "Mum muhr",
  heart: "Yurak",
  doors: "Darvoza",
  swipe: "Surib ochish",
  button: "Karta",
};

const FEATURES = [
  ["✉", "Ochilish marosimi", "Mehmon avval yopiq konvert, muhr yoki yurakni ko‘radi va o‘zi ochadi."],
  ["▦", "Taqvim va sanoq", "To‘y kuni taqvimda belgilanadi, kun, soat, daqiqa va soniya sanab turadi."],
  ["☰", "To‘y dasturi", "Kutib olish, nikoh, ziyofat: har bir bosqichning vaqti chiroyli chiziqda."],
  ["⌖", "Xaritada yo‘nalish", "Manzil ustiga bosilganda xarita ochiladi, adashib qolish yo‘q."],
  ["✓", "Kelaman / kelmayman", "Mehmon javobini yuboradi, siz javoblar ro‘yxatini tahrirlash sahifasida ko‘rasiz."],
  ["♫", "Musiqa", "Litsenziyasi tasdiqlangan kuy, mehmon xohlasa yoqadi."],
  ["⊕", "Taqvimga qo‘shish", "Bir bosishda to‘y mehmonning telefon taqvimiga tushadi."],
  ["❖", "Ota-ona nomidan", "Kiyim kodi va ota-ona taklif matni uchun alohida joy."],
] as const;

const STEPS = [
  ["Shablonni tanlang", "O‘nta dizayndan o‘zingizga yoqqanini tanlang: konvert, muhr, yurak yoki darvoza."],
  ["Ma’lumotlarni kiriting", "Ismlar, sana, dastur, manzil va juftlik rasmi. O‘ng tomonda taklifnoma o‘sha zahoti o‘zgaradi."],
  ["Havolani yuboring", "Saqlang va tayyor havolani WhatsApp yoki Telegram orqali mehmonlarga jo‘nating."],
] as const;

const FAQ = [
  ["Taklifnomani ro‘yxatdan o‘tmasdan yaratsam bo‘ladimi?", "Ha. Tahrirlash uchun alohida maxfiy havola beriladi, ommaviy havola orqali taklifnomani o‘zgartirib bo‘lmaydi."],
  ["Musiqa qanday tanlanadi?", "Faqat litsenziyasi tasdiqlangan audio fayllar katalogidan. Katalog to‘lgunga qadar taklifnomani musiqasiz yaratish mumkin."],
  ["Mehmonlar taklifnomani qanday ochadi?", "Nashr qilingach beriladigan noyob havola orqali: ilova o‘rnatish shart emas. Avval konvert (yoki muhr) ko‘rinadi, bosilganda taklifnoma ochiladi."],
  ["Yaratgandan keyin o‘zgartirsam bo‘ladimi?", "Ha. Maxfiy tahrirlash havolasi orqali ismlar, sana, dastur va dizaynni istalgan vaqt o‘zgartirasiz, havola o‘zgarmaydi."],
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
            <p className="inline-block rounded-full bg-[#e8f3ec] px-4 py-1.5 text-xs font-medium tracking-wide text-gold-dark">
              Yaratish bepul · ro‘yxatdan o‘tish shart emas
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-[clamp(2.3rem,5.4vw,3.8rem)] leading-[1.05] tracking-tight text-ink">
              Raqamli to‘y taklifnomasi: konvert ochiladi, mehmon tabriklaydi
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Ismlar, sana va dasturni kiriting, shablonni tanlang va havolani WhatsApp yoki Telegram orqali yuboring.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/create" className="rounded-full bg-saffron px-8 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-[#d4561c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark">
                Hoziroq yaratish
              </Link>
              <Link href="/dizaynlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">Shablonlarni ko‘rish</Link>
            </div>
          </HeroDemo>
        </section>

        <section className="bg-[#f1f7f3] py-16" aria-labelledby="designs">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="designs" className="font-serif text-3xl text-ink">Mashhur shablonlar</h2>
                <p className="mt-2 max-w-md text-sm text-muted">Har birining o‘z rangi va ochilish usuli bor. Bosing va mehmon ko‘radigandek ko‘ring.</p>
              </div>
              <Link href="/dizaynlar" className="text-sm font-medium text-gold-dark underline underline-offset-4">Hammasini ko‘rish</Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {DESIGNS.map((d) => (
                <li key={d} className="flex flex-col items-center text-center">
                  <PhonePreview data={sampleInvitation(d)} width={170} height={300} href={`/namuna/${d}`} label={`${DESIGN_LABELS[d]} namunasini ochish`} />
                  <span className="mt-3 font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                  <span className="mt-1 rounded-full bg-white px-3 py-0.5 text-[11px] text-gold-dark shadow-sm">{GATE_LABEL[THEMES[d].gate]}</span>
                  <span className="mt-2 max-w-[190px] text-xs leading-relaxed text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="features">
          <h2 id="features" className="font-serif text-3xl text-ink">Taklifnomada nimalar bor</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(([icon, t, d]) => (
              <li key={t} className="rounded-2xl border border-[#cfe0d5] bg-white p-5 shadow-sm">
                <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f3ec] text-xl text-gold-dark">{icon}</span>
                <h3 className="mt-4 font-serif text-xl text-ink">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-ink py-16 text-white" aria-labelledby="guests">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 id="guests" className="font-serif text-3xl">Mehmonlar javobi bir joyda</h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/80">
                Har mehmon taklifnoma ichida ismini yozib “kelaman” yoki “kelmayman” deydi. Javoblar sizning maxfiy tahrirlash
                sahifangizda ro‘yxat bo‘lib turadi: kim kelishi, kim kelolmasligi bir qarashda ko‘rinadi.
              </p>
              <Link href="/create" className="mt-6 inline-block rounded-full bg-saffron px-7 py-3 text-sm font-medium text-white hover:bg-[#d4561c]">Boshlash</Link>
            </div>
            <div className="rounded-2xl bg-white p-5 text-ink shadow-xl" aria-label="Namuna ko‘rinishi">
              <p className="text-xs uppercase tracking-widest text-muted">Javoblar ro‘yxati (namuna)</p>
              <ul className="mt-3 divide-y divide-[#e3eee7] text-sm">
                {[["Jasur Karimov", "Keladi"], ["Dilnoza Aliyeva", "Keladi"], ["Bobur Rashidov", "Kelolmaydi"]].map(([n, r]) => (
                  <li key={n} className="flex items-center justify-between py-3">
                    <span>{n}</span>
                    <span className={`rounded-full px-3 py-0.5 text-xs ${r === "Keladi" ? "bg-[#e8f3ec] text-gold-dark" : "bg-[#fde8dc] text-[#b24213]"}`}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="how">
          <h2 id="how" className="font-serif text-3xl text-ink">Qanday ishlaydi</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="relative border-t-2 border-saffron pt-4">
                <span aria-hidden className="font-serif text-5xl leading-none text-saffron/40">{i + 1}</span>
                <h3 className="mt-3 font-serif text-xl text-ink">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16" aria-labelledby="faq">
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

        <section className="bg-[#e8f3ec] py-14 text-center">
          <h2 className="font-serif text-3xl text-ink">To‘yingizga taklifnomani bugun tayyorlang</h2>
          <Link href="/create" className="mt-6 inline-block rounded-full bg-saffron px-9 py-3.5 font-medium text-white hover:bg-[#d4561c]">Hoziroq yaratish</Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
