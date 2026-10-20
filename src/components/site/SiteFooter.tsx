import Link from "next/link";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <footer className="border-t border-[#cfe0d5] bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-muted sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm">Raqamli to‘y taklifnomalari: ma’lumotlarni kiriting, dizaynni tanlang, havolani yuboring.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Pastki menyu">
          <Link href="/dizaynlar" className="underline underline-offset-4">Dizaynlar</Link>
          <Link href="/create" className="underline underline-offset-4">Taklifnoma yaratish</Link>
          {contact && <a href={`mailto:${contact}`} className="underline underline-offset-4">Aloqa: {contact}</a>}
          <Link href="/maxfiylik" className="underline underline-offset-4">Maxfiylik siyosati</Link>
          <Link href="/shartlar" className="underline underline-offset-4">Foydalanish shartlari</Link>
        </nav>
      </div>
    </footer>
  );
}
