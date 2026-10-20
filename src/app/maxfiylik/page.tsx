import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Maxfiylik siyosati" };

export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link href="/" className="text-sm text-gold-dark underline underline-offset-4">← Bosh sahifa</Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">Maxfiylik siyosati</h1>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        Bu qoralama matn bo‘lib, yuridik ko‘rikdan o‘tmagan. Platforma ishga tushirilishidan oldin yakuniy
        tahrir talab etiladi.
      </p>
      <div className="mt-6 space-y-4 text-ink">
        <p>Biz faqat taklifnoma yaratish uchun siz kiritgan ma’lumotlarni (ismlar, sana, manzil, matn, rasm) qayta ishlaymiz.</p>
        <p>Nashr qilingan taklifnoma havolasini bilgan har bir kishi uni ko‘ra oladi. Nashr qilmagan qoralamalar ommaviy ko‘rinmaydi.</p>
        <p>Tahrirlash uchun beriladigan maxfiy havola faqat sizga tegishli: uni boshqalarga bermang.</p>
        <p>Taklifnomani istalgan vaqtda nashrdan olish yoki o‘chirish mumkin.</p>
      </div>
    </main>
  );
}
