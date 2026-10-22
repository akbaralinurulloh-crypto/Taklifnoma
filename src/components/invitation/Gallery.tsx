"use client";

import { useCallback, useEffect, useState } from "react";

/** Galereya: birinchi rasm katta, qolganlari to'r ko'rinishida. Bosilganda to'liq ekranda ochiladi (←/→/Esc bilan boshqariladi). */
export function Gallery({ urls, alt, variant = "grid" }: { urls: string[]; alt: string; variant?: "grid" | "stack" | "scroller" }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + urls.length) % urls.length)), [urls.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  if (urls.length === 0) return null;
  return (
    <>
      <div
        className={
          variant === "stack" ? "mt-6 space-y-3"
          : variant === "scroller" ? "-mx-8 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-8 pb-2"
          : "mt-6 grid grid-cols-2 gap-2"
        }
      >
        {urls.map((u, i) => {
          const wide = variant === "grid" && i === 0 && urls.length % 2 === 1;
          const cls = variant === "stack" ? "block w-full overflow-hidden" : variant === "scroller" ? "w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl" : `overflow-hidden rounded-lg ${wide ? "col-span-2" : ""}`;
          const img = variant === "stack" ? "h-72" : variant === "scroller" ? "h-80" : wide ? "h-64" : "h-44";
          const pic = (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u} alt={`${alt} ${i + 1}`} loading="lazy" className={`w-full object-cover ${img}`} />
          );
          return (
            <button key={u} type="button" onClick={() => setOpen(i)} className={cls} aria-label={`${alt} ${i + 1}/${urls.length}`}>
              {pic}
            </button>
          );
        })}
      </div>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urls[open]} alt={`${alt} ${open + 1}`} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={close} aria-label="×" className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/20 text-2xl text-white">×</button>
          {urls.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="‹" className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-2xl text-white">‹</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="›" className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-2xl text-white">›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
