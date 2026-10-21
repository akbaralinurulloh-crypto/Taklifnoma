import Link from "next/link";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const col = "mt-3 space-y-2";
  const a = "hover:text-gold-dark hover:underline underline-offset-4";
  return (
    <footer className="border-t border-[#f3d3dc] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-muted md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs leading-relaxed">Raqamli to‘y taklifnomalari: ma’lumotlarni kiriting, dizaynni tanlang, havolani yuboring.</p>
        </div>
        <nav aria-label="Mahsulot">
          <h3 className="font-medium text-ink">Mahsulot</h3>
          <ul className={col}>
            <li><Link href="/dizaynlar" className={a}>Dizaynlar</Link></li>
            <li><Link href="/imkoniyatlar" className={a}>Imkoniyatlar</Link></li>
            <li><Link href="/create" className={a}>Taklifnoma yaratish</Link></li>
          </ul>
        </nav>
        <nav aria-label="Yordam">
          <h3 className="font-medium text-ink">Yordam</h3>
          <ul className={col}>
            <li><Link href="/savollar" className={a}>Ko‘p beriladigan savollar</Link></li>
            <li><Link href="/#how" className={a}>Qanday ishlaydi</Link></li>
            {contact && <li><a href={`mailto:${contact}`} className={a}>Aloqa: {contact}</a></li>}
          </ul>
        </nav>
        <nav aria-label="Huquqiy">
          <h3 className="font-medium text-ink">Huquqiy</h3>
          <ul className={col}>
            <li><Link href="/maxfiylik" className={a}>Maxfiylik siyosati</Link></li>
            <li><Link href="/shartlar" className={a}>Foydalanish shartlari</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
