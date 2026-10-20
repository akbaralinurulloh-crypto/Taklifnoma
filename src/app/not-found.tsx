import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-serif text-6xl text-gold">404</p>
      <h1 className="mt-4 font-serif text-2xl text-ink">Taklifnoma topilmadi</h1>
      <p className="mt-2 text-sm text-muted">
        Havola noto‘g‘ri yozilgan, taklifnoma o‘chirilgan yoki nashrdan olingan bo‘lishi mumkin. Havolani yuborgan
        kishidan tekshirib ko‘rishni so‘rang.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-gold-dark px-6 py-2 text-sm text-white hover:bg-gold">
        Bosh sahifaga qaytish
      </Link>
    </main>
  );
}
