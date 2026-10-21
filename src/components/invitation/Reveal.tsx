"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Ekranga kirganda silliq paydo bo'lish. JS bo'lmasa yoki animatsiya o'chiq bo'lsa kontent oddiy ko'rinadi
 * (yashirish faqat brauzerda, element kuzatuvga olingandan keyin yoqiladi).
 */
export function Reveal({ as = "div", kind = "up", className = "", children, enabled = true }: { as?: "div" | "section"; kind?: "up" | "left" | "zoom"; className?: string; children: ReactNode; enabled?: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const visibleNow = rect.top < window.innerHeight * 0.9;
    const t = setTimeout(() => {
      setArmed(true);
      if (visibleNow) setShown(true);
    }, 0);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [enabled]);

  const Tag = as;
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`${className} ${armed ? "iv-rv" : ""} ${armed && shown ? "iv-rv-in" : ""}`.trim()} data-rv={kind}>
      {children}
    </Tag>
  );
}
