import type { CSSProperties, ReactNode } from "react";
import { Rose } from "./Ornaments";

const PALETTES: [string, string, string][] = [
  ["#8a1c2b", "#b3263a", "#d94a5e"],
  ["#5d0f1d", "#8a1c2b", "#c4485b"],
  ["#a3213a", "#d0405a", "#f08a9a"],
];

/** Barglar juftligi (novda bo'ylab). */
function Sprig({ className, style, flip }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 30" aria-hidden className={className} style={{ ...style, transform: `${style?.transform ?? ""} ${flip ? "scaleX(-1)" : ""}` }}>
      <defs>
        <linearGradient id="sprigG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6a9a58" /><stop offset="1" stopColor="#2c5535" /></linearGradient>
      </defs>
      <path d="M4 15 C 14 3 30 3 40 13 C 30 19 14 21 4 15 Z" fill="url(#sprigG)" stroke="#173a22" strokeOpacity=".35" strokeWidth=".6" />
      <path d="M20 16 C 28 8 44 8 56 18 C 44 26 30 26 20 16 Z" fill="url(#sprigG)" stroke="#173a22" strokeOpacity=".35" strokeWidth=".6" />
      <path d="M6 15 L 38 13 M22 16 L 54 18" stroke="#fff" strokeOpacity=".3" strokeWidth=".8" />
    </svg>
  );
}

/**
 * Rasm atrofini to'liq o'rab turuvchi atirgul ramkasi: lentaga o'xshash o'ralgan poya, uning ustida
 * atirgullar va barglar. Asosiy surat ham, galereya ham shu ramka ichida ko'rsatiladi.
 */
export function RoseFrame({ children, className = "", size = "lg" }: { children: ReactNode; className?: string; size?: "lg" | "sm" }) {
  const big = size === "lg";
  const pad = big ? 24 : 15;
  const rs = big ? "h-[58px] w-[58px]" : "h-10 w-10";
  const corner = big ? "h-[84px] w-[84px]" : "h-14 w-14";
  const ctr = (left: string, top: string): CSSProperties => ({ left, top, transform: "translate(-50%,-50%)" });
  const edge: { x: string; y: string; k: number }[] = [
    { x: "27%", y: "0%", k: 0 }, { x: "50%", y: "0%", k: 1 }, { x: "73%", y: "0%", k: 2 },
    { x: "27%", y: "100%", k: 1 }, { x: "50%", y: "100%", k: 2 }, { x: "73%", y: "100%", k: 0 },
    { x: "0%", y: "33%", k: 2 }, { x: "0%", y: "66%", k: 0 }, { x: "100%", y: "33%", k: 0 }, { x: "100%", y: "66%", k: 1 },
  ];
  const corners = [{ x: "0%", y: "0%" }, { x: "100%", y: "0%" }, { x: "0%", y: "100%" }, { x: "100%", y: "100%" }];
  const sprigs: { x: string; y: string; r: number; flip?: boolean }[] = [
    { x: "38.5%", y: "0%", r: 0 }, { x: "61.5%", y: "0%", r: 0, flip: true }, { x: "38.5%", y: "100%", r: 180 }, { x: "61.5%", y: "100%", r: 180, flip: true },
    { x: "0%", y: "50%", r: -90 }, { x: "100%", y: "50%", r: 90 }, { x: "0%", y: "16%", r: -90, flip: true }, { x: "100%", y: "84%", r: 90, flip: true },
  ];
  return (
    <div className={`relative ${className}`} style={{ padding: pad }}>
      <div aria-hidden className="iv-vine absolute inset-0 rounded-[18px]" />
      <div className="relative overflow-hidden rounded-[10px] shadow-[0_0_0_2px_rgba(20,50,30,.5)]">{children}</div>
      {sprigs.map((s, i) => (
        <Sprig key={`s${i}`} flip={s.flip} className={big ? "absolute h-8 w-16" : "absolute h-6 w-12"} style={{ ...ctr(s.x, s.y), transform: `translate(-50%,-50%) rotate(${s.r}deg)` }} />
      ))}
      {edge.map((e, i) => {
        const [c1, c2, c3] = PALETTES[e.k];
        return <Rose key={`e${i}`} c1={c1} c2={c2} c3={c3} className={`absolute drop-shadow-md ${rs}`} style={ctr(e.x, e.y)} />;
      })}
      {corners.map((c, i) => {
        const [c1, c2, c3] = PALETTES[(i + 1) % 3];
        return <Rose key={`c${i}`} c1={c1} c2={c2} c3={c3} className={`absolute drop-shadow-lg ${corner}`} style={ctr(c.x, c.y)} />;
      })}
    </div>
  );
}
