import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Foydalanish shartlari" };

export default function Terms() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link href="/" className="text-sm text-gold-dark underline underline-offset-4">← Bosh sahifa</Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">Foydalanish shartlari</h1>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        Bu qoralama matn bo‘lib, yuridik ko‘rikdan o‘tmagan. Platforma ishga tushirilishidan oldin yakuniy
        tahrir talab etiladi.
      </p>
      <div className="mt-6 space-y-4 text-ink">
        <p>Taklifnomaga faqat o‘zingizga tegishli yoki foydalanish huquqingiz bo‘lgan matn va rasmlarni joylang.</p>
        <p>Qonunga zid, haqoratli yoki boshqalarning huquqlarini buzuvchi kontent joylash taqiqlanadi.</p>
        <p>Qoidalarni buzgan taklifnomalar nashrdan olinishi mumkin.</p>
      </div>
    </main>
  );
}
