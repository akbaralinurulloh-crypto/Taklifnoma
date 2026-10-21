import Link from "next/link";

import { NAV as LINKS } from "@/lib/site-content";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 font-serif text-2xl ${light ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 36 26" aria-hidden className="h-6 w-8">
        <rect x="1" y="1" width="34" height="24" rx="3.5" fill={light ? "#fff" : "#1b2a5c"} />
        <path d="M2 3l16 12L34 3" fill="none" stroke="#c8963e" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="18" cy="15" r="3.4" fill="#c8963e" className="st-seal" />
      </svg>
      Taklifnoma
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <div aria-hidden className="h-1 bg-gradient-to-r from-[#1b2a5c] via-[#c8963e] to-[#1b2a5c]" />
      <header className="sticky top-0 z-30 border-b border-[#e6dcc6]/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" aria-label="Taklifnoma: bosh sahifa"><Logo /></Link>
          <nav className="hidden items-center gap-6 text-sm text-ink sm:flex" aria-label="Asosiy menyu">
            {LINKS.map(([h, t]) => (
              <Link key={h} href={h} className="underline-offset-8 hover:underline">{t}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <details className="relative sm:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[#d3c3a0] px-3 py-2 text-sm text-ink marker:content-none">Menyu</summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#e6dcc6] bg-white p-2 shadow-lg">
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
