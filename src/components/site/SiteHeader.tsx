import Link from "next/link";

import { NAV as LINKS } from "@/lib/site-content";

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-serif text-2xl text-ink">
      <svg viewBox="0 0 24 28" aria-hidden className="h-6 w-5">
        <path d="M12 1C20 8 22 18 12 27 2 18 4 8 12 1z" fill="#e11d63" />
        <path d="M12 8c4 3 5 8 0 12-5-4-4-9 0-12z" fill="#fff" fillOpacity=".85" />
      </svg>
      Taklifnoma
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <div aria-hidden className="h-1 bg-gradient-to-r from-[#e11d63] via-[#ff7a9c] to-[#ffb36b]" />
      <header className="sticky top-0 z-30 border-b border-[#f3d3dc]/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" aria-label="Taklifnoma: bosh sahifa"><Logo /></Link>
          <nav className="hidden items-center gap-6 text-sm text-ink sm:flex" aria-label="Asosiy menyu">
            {LINKS.map(([h, t]) => (
              <Link key={h} href={h} className="underline-offset-8 hover:underline">{t}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <details className="relative sm:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[#e8b7c5] px-3 py-2 text-sm text-ink marker:content-none">Menyu</summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#f3d3dc] bg-white p-2 shadow-lg">
                {LINKS.map(([h, t]) => (
                  <Link key={h} href={h} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-beige">{t}</Link>
                ))}
              </div>
            </details>
            <Link href="/create" className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark">
              Yaratish
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
