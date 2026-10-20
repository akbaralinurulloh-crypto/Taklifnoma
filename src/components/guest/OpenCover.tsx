"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Phase = "closed" | "opening" | "open";

const d = (s: string) => ({ ["--d" as string]: s }) as CSSProperties;

/**
 * Mehmon sahifasining qopqog'i: muhrni bosganda taklifnoma ochiladi.
 * Taklifnoma matni sahifada doim bor, qopqoq faqat ustidan yopib turadi.
 * JS ishlamasa qopqoq yashiriladi.
 */
export function OpenCover({ groom, bride, children }: { groom: string; bride: string; children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    if (phase !== "closed") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  function open() {
    setPhase("opening");
    window.scrollTo(0, 0);
    setTimeout(() => setPhase("open"), 900);
  }

  const monogram = `${groom.trim().charAt(0)}${bride.trim().charAt(0)}`.toUpperCase();

  return (
    <>
      {children}
      {phase !== "open" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Taklifnomani ochish"
          className={`tk-cover fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#1f6f54,#0f2a23_70%)] px-6 text-center text-[#fdf7e8] transition-all duration-[900ms] ease-in-out ${
            phase === "opening" ? "pointer-events-none -translate-y-full opacity-0" : ""
          }`}
        >
          <noscript>
            <style>{".tk-cover{display:none!important}"}</style>
          </noscript>
          <p className="tk-fade text-[11px] uppercase tracking-[0.45em] text-[#f6c9a8]">Sizga taklifnoma</p>
          <h1 className="tk-rise mt-6 font-serif text-4xl leading-tight" style={d("0.2s")}>
            {groom}
            <span className="my-1 block text-2xl italic text-[#ee6a2b]">va</span>
            {bride}
          </h1>
          <button
            type="button"
            onClick={open}
            autoFocus
            aria-label="Taklifnomani ochish"
            className="tk-rise relative mt-12 flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff9a62,#ee6a2b_55%,#b8431a)] font-serif text-4xl text-white shadow-[0_12px_30px_rgba(0,0,0,.45)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={d("0.5s")}
          >
            <span aria-hidden className="absolute inset-2 rounded-full border border-white/40" />
            <span className="relative">{monogram}</span>
          </button>
          <p className="tk-fade mt-6 text-sm text-[#fdf7e8]/80" style={d("0.9s")}>
            Ochish uchun muhrni bosing
          </p>
        </div>
      )}
    </>
  );
}
