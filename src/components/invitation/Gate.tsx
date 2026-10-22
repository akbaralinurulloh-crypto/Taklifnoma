"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { GateKind } from "./themes";
import { Fx } from "./Fx";
import { Heart, Rose } from "./Ornaments";
import { dict, type Lang } from "@/lib/i18n";
import { useMusicStart } from "./MusicProvider";

type Phase = "closed" | "opening" | "open";

type Props = {
  enabled: boolean;
  kind: GateKind;
  groom: string;
  bride: string;
  dateText: string | null;
  bg: string;
  ink: string;
  color: string;
  color2: string;
  lang?: Lang;
  roses?: boolean;
  children: React.ReactNode;
};

const mono = (a: string, b: string) => `${a.trim().charAt(0)}${b.trim().charAt(0)}`.toUpperCase();
const dl = (s: number) => ({ ["--d" as string]: `${s}s` }) as CSSProperties;

/** Ochilish ekrani. Taklifnoma matni sahifada doim bor (qopqoq faqat ustidan yopadi); JS bo'lmasa qopqoq ko'rinmaydi. */
export function Gate({ enabled, kind, groom, bride, dateText, bg, ink, color, color2, lang = "uz", roses = false, children }: Props) {
  const g = dict(lang);
  const startMusic = useMusicStart();
  const [phase, setPhase] = useState<Phase>("closed");
  const active = enabled && phase !== "open";

  useEffect(() => {
    if (!enabled || phase !== "closed") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [enabled, phase]);

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    startMusic?.(); // bosish = brauzer ruxsati: tanlangan musiqa avtomatik boshlanadi
    window.scrollTo(0, 0);
    setTimeout(() => setPhase("open"), kind === "button" || kind === "swipe" ? 900 : 1500);
  }

  const opening = phase === "opening";
  const names = (
    <h1 className="f-script iv-in break-words text-center text-[51px] leading-[1.05]" style={{ color: ink, ...dl(0.15) }}>
      {groom}
      <span className="block text-[30px] opacity-80">&amp;</span>
      {bride}
    </h1>
  );

  let body: React.ReactNode;
  let wrapperClass = "";

  if (kind === "envelope") {
    body = (
      <>
        <p className="iv-in text-[13px] uppercase tracking-[0.4em]" style={{ color: ink, opacity: 0.75 }}>{g.invitation}</p>
        <div className="mt-4">{names}</div>
        {dateText && <p className="f-display iv-in mt-3 text-[16px] tracking-[0.2em]" style={{ color: ink, ...dl(0.3) }}>{dateText}</p>}
        <button
          type="button"
          onClick={open}
          aria-label={g.ariaOpen}
          className="iv-in relative mx-auto mt-10 block h-[150px] w-[230px] [perspective:800px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
          style={{ color: ink, ...dl(0.45) }}
        >
          <span className="absolute inset-0 rounded-md shadow-[0_18px_30px_-12px_rgba(0,0,0,.45)]" style={{ background: color }} />
          <span
            className="absolute inset-x-3 top-3 bottom-8 rounded-sm bg-white transition-transform duration-700"
            style={{ transform: opening ? "translateY(-70px)" : "translateY(0)", transitionDelay: opening ? ".5s" : "0s" }}
          />
          <svg viewBox="0 0 230 150" aria-hidden className="absolute inset-0">
            <path d="M0 0 L115 85 L230 0 L230 150 L0 150 Z" fill={color} />
            <path d="M0 150 L100 72 M230 150 L130 72" stroke="#000" strokeOpacity=".12" strokeWidth="1.5" />
          </svg>
          <span
            className="absolute inset-x-0 top-0 h-[85px] origin-top transition-transform duration-700 [backface-visibility:hidden]"
            style={{
              transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
              clipPath: "polygon(0 0,100% 0,50% 100%)",
              background: `linear-gradient(${color},${color})`,
              filter: "brightness(1.07)",
            }}
          />
          <span
            className="absolute left-1/2 top-[66px] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-[16px] text-white shadow-md transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 35% 30%,${color2},#00000033 130%)`, opacity: opening ? 0 : 1 }}
          >
            <Heart className="h-4 w-4" fill="#ffffffcc" />
          </span>
        </button>
        <p className="iv-in mt-8 text-[13.5px] uppercase tracking-[0.3em]" style={{ color: ink, opacity: 0.8, ...dl(0.8) }}>{g.tapOpen}</p>
      </>
    );
  } else if (kind === "seal") {
    body = (
      <>
        <p className="iv-in text-[13px] uppercase tracking-[0.4em]" style={{ color: ink, opacity: 0.7 }}>{g.sentYou}</p>
        <button
          type="button"
          onClick={open}
          aria-label={g.ariaOpen}
          className="iv-in group relative mx-auto mt-10 block h-40 w-40 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
          style={{ color: ink, ...dl(0.3) }}
        >
          <svg viewBox="0 0 160 160" aria-hidden className="absolute inset-0 transition-transform duration-700" style={{ transform: opening ? "scale(1.5) rotate(18deg)" : "none", opacity: opening ? 0 : 1 }}>
            <path d="M80 8 C 100 6 108 20 126 22 C 146 24 148 44 150 60 C 156 78 146 92 142 108 C 136 128 118 132 104 144 C 88 156 72 150 56 144 C 40 138 24 128 18 108 C 12 90 6 78 12 60 C 18 42 22 26 42 20 C 60 14 66 10 80 8 Z" fill={color} />
            <circle cx="80" cy="80" r="46" fill="none" stroke="#ffffff" strokeOpacity=".35" strokeWidth="2" />
            <circle cx="80" cy="80" r="38" fill="none" stroke="#ffffff" strokeOpacity=".25" strokeWidth="1" />
          </svg>
          <span className="f-script absolute inset-0 flex items-center justify-center text-[48px] text-white transition-opacity duration-500" style={{ opacity: opening ? 0 : 1 }}>
            {mono(groom, bride)}
          </span>
        </button>
        <div className="mt-8">{names}</div>
        <p className="iv-in mt-8 text-[13.5px] uppercase tracking-[0.3em]" style={{ color: ink, opacity: 0.8, ...dl(0.9) }}>{g.tapSeal}</p>
      </>
    );
    wrapperClass = "gate-halves";
  } else if (kind === "heart") {
    body = (
      <>
        {!roses && <Fx kind="hearts" colors={[color, color2, "#ffffff"]} />}
        {roses && (
          <>
            <Rose className="pointer-events-none absolute -left-10 -top-8 h-44 w-44" />
            <Rose className="pointer-events-none absolute -right-12 top-16 h-36 w-36" c1="#5d0f1d" c2="#8a1c2b" c3="#c4485b" />
            <Rose className="pointer-events-none absolute -bottom-10 -left-6 h-40 w-40" c1="#5d0f1d" c2="#8a1c2b" c3="#c4485b" />
            <Rose className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44" />
          </>
        )}
        <p className="iv-in text-[14px] uppercase tracking-[0.4em]" style={{ color: ink, opacity: 0.85 }}>{g.forYou}</p>
        <h1 className="f-script iv-in mt-2 text-[64px] leading-none" style={{ color: ink, ...dl(0.15) }}>{g.invitation}</h1>
        <p className="iv-in mt-1 text-[14px] uppercase tracking-[0.4em]" style={{ color: ink, opacity: 0.85, ...dl(0.25) }}>{g.arrived}</p>
        <button
          type="button"
          onClick={open}
          aria-label={g.ariaOpen}
          className="iv-in mx-auto mt-12 block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
          style={dl(0.4)}
        >
          <span className="iv-pulse block">
            <span className="relative block transition-transform duration-[1400ms]" style={{ transform: opening ? "scale(38)" : "none", transitionTimingFunction: "ease-in" }}>
              <Heart className="h-24 w-24 drop-shadow-lg" fill={color} />
              <svg viewBox="0 0 96 88" aria-hidden className="absolute inset-0 h-24 w-24">
                {[10, 17, 24].map((r) => (
                  <ellipse key={r} cx="48" cy="40" rx={r * 1.5} ry={r * 1.2} fill="none" stroke={color2} strokeOpacity=".5" strokeWidth="1.2" />
                ))}
              </svg>
            </span>
          </span>
        </button>
        <p className="iv-in mt-10 text-[13.5px] uppercase tracking-[0.3em]" style={{ color: ink, ...dl(0.8) }}>{g.tapHeart}</p>
      </>
    );
  } else if (kind === "doors") {
    body = (
      <>
        <svg viewBox="0 0 120 120" aria-hidden className="iv-in mx-auto h-24 w-24" style={{ color: color2 }}>
          <polygon points="60,6 72,26 96,22 94,46 114,60 94,74 96,98 72,94 60,114 48,94 24,98 26,74 6,60 26,46 24,22 48,26" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="60" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <p className="iv-in mt-4 text-[13px] uppercase tracking-[0.4em]" style={{ color: ink, opacity: 0.85, ...dl(0.1) }}>{g.nikohInvite}</p>
        <div className="mt-5">{names}</div>
        <button
          type="button"
          onClick={open}
          className="iv-in mt-10 rounded-full border px-8 py-3 text-[16px] uppercase tracking-[0.25em] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ color: ink, borderColor: color2, ...dl(0.5) }}
        >
          {g.openDoors}
        </button>
      </>
    );
    wrapperClass = "gate-doors";
  } else if (kind === "swipe") {
    body = (
      <>
        <p className="iv-in text-[13px] uppercase tracking-[0.5em]" style={{ color: ink, opacity: 0.7 }}>{g.invitation}</p>
        <div className="mt-6">{names}</div>
        {dateText && <p className="f-display iv-in mt-4 text-[16px] tracking-[0.25em]" style={{ color: ink, ...dl(0.3) }}>{dateText}</p>}
        <button
          type="button"
          onClick={open}
          className="iv-in mt-14 flex flex-col items-center gap-2 text-[13.5px] uppercase tracking-[0.3em] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
          style={{ color: ink, ...dl(0.5) }}
        >
          <svg viewBox="0 0 24 40" aria-hidden className="iv-pulse h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="2" width="18" height="30" rx="9" />
            <circle cx="12" cy="11" r="2.6" fill="currentColor" />
          </svg>
          {g.swipeUp}
        </button>
      </>
    );
  } else {
    body = (
      <>
        <div className="iv-in mx-auto w-[300px] rounded-md px-6 py-9 shadow-[0_18px_40px_-18px_rgba(0,0,0,.5)]" style={{ background: "var(--paper, #fff)", color: "#222" }}>
          <p className="text-[13px] uppercase tracking-[0.4em]" style={{ color: color }}>{g.invitation}</p>
          <h1 className="f-script mt-4 break-words text-[46px] leading-[1.05]" style={{ color }}>
            {groom}
            <span className="block text-[28px] opacity-80">&amp;</span>
            {bride}
          </h1>
          {dateText && <p className="f-display mt-4 text-[16px] tracking-[0.15em]" style={{ color }}>{dateText}</p>}
          <p className="mt-4 text-[16px]">{g.inviteUs}</p>
          <button
            type="button"
            onClick={open}
              className="mt-6 rounded-full px-9 py-3 text-[16px] uppercase tracking-[0.2em] text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ background: color, outlineColor: color }}
          >
            {g.open}
          </button>
        </div>
      </>
    );
  }

  const slideUp = kind === "button" || kind === "swipe" || kind === "envelope" || kind === "heart";
  const overlayStyle: CSSProperties = {
    background: kind === "seal" || kind === "doors" ? "transparent" : bg,
    transform: opening && slideUp && kind !== "heart" && kind !== "envelope" ? "translateY(-100%)" : "none",
    opacity: opening && (kind === "heart" || kind === "envelope") ? 0 : 1,
    transition: kind === "heart" ? "opacity 1.1s ease-in .5s" : kind === "envelope" ? "opacity .7s ease .8s" : "transform .9s cubic-bezier(.7,0,.2,1)",
    pointerEvents: opening ? "none" : "auto",
  };

  return (
    <>
      {children}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={g.ariaOpen}
          className={`iv-gate fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6 text-center ${wrapperClass}`}
          style={overlayStyle}
        >
          <noscript>
            <style>{".iv-gate{display:none!important}"}</style>
          </noscript>
          {(kind === "seal" || kind === "doors") && (
            <>
              <div
                aria-hidden
                className="absolute transition-transform duration-[1100ms] ease-in-out"
                style={
                  kind === "seal"
                    ? { inset: "0 0 50% 0", background: bg, transform: opening ? "translateY(-101%)" : "none", transitionDelay: ".35s" }
                    : { inset: "0 50% 0 0", background: bg, transform: opening ? "translateX(-101%)" : "none", transitionDelay: ".15s" }
                }
              />
              <div
                aria-hidden
                className="absolute transition-transform duration-[1100ms] ease-in-out"
                style={
                  kind === "seal"
                    ? { inset: "50% 0 0 0", background: bg, transform: opening ? "translateY(101%)" : "none", transitionDelay: ".35s" }
                    : { inset: "0 0 0 50%", background: bg, transform: opening ? "translateX(101%)" : "none", transitionDelay: ".15s" }
                }
              />
            </>
          )}
          <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center transition-opacity duration-500" style={{ opacity: opening && (kind === "seal" || kind === "doors") ? 0 : 1 }}>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
