"use client";

import { useEffect, useRef } from "react";

/** O'qish chizig'i: sahifa bo'ylab pastga tushgan sari yuqoridagi chiziq to'lib boradi. */
export function ScrollBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const upd = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    on();
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0" ref={ref} style={{ background: "linear-gradient(90deg,var(--accent),var(--accent2))" }} />;
}

/** Ekranga tegilganda (tugmalardan tashqari) mavzuga mos zarrachalar sochiladi. */
export function TapBurst({ symbols, colors }: { symbols: string[]; colors: string[] }) {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("button,a,input,textarea,select,label,[role=dialog]")) return;
      for (let i = 0; i < 9; i++) {
        const el = document.createElement("span");
        const ang = (Math.PI * 2 * i) / 9 + Math.random() * 0.6;
        const dist = 50 + Math.random() * 60;
        el.textContent = symbols[i % symbols.length];
        el.setAttribute("aria-hidden", "true");
        Object.assign(el.style, {
          position: "fixed", left: `${e.clientX}px`, top: `${e.clientY}px`, zIndex: "58", pointerEvents: "none",
          fontSize: `${12 + Math.random() * 14}px`, color: colors[i % colors.length], lineHeight: "1",
          transition: "transform .9s cubic-bezier(.15,.7,.3,1), opacity .9s ease", opacity: "1", transform: "translate(-50%,-50%) scale(.4)",
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.style.transform = `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist - 20}px)) scale(1.1) rotate(${Math.round(Math.random() * 120 - 60)}deg)`;
          el.style.opacity = "0";
        }));
        setTimeout(() => el.remove(), 1000);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [symbols, colors]);
  return null;
}
