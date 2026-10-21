import type { CSSProperties } from "react";

export type FxKind = "none" | "petals" | "stars" | "butterflies" | "gold" | "hearts" | "leaves" | "confetti" | "sparkles";

/** Doimiy "tasodifiy" qiymat: server va brauzerda bir xil chiqadi (gidratatsiya xatosi bo'lmasin). */
const r = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return Math.round(((x % 1) + 1) % 1 * 100) / 100;
};

const HEART = "M12 21 C 4 14 1 10 1 7 A5.5 5.5 0 0 1 12 5.5 A5.5 5.5 0 0 1 23 7 C 23 10 20 14 12 21 Z";
const PETAL = "M12 1 C 20 6 20 18 12 23 C 4 18 4 6 12 1 Z";
const LEAF = "M2 22 C 2 10 10 2 22 2 C 22 14 14 22 2 22 Z";
const STAR = "M12 0 C 13 8 16 11 24 12 C 16 13 13 16 12 24 C 11 16 8 13 0 12 C 8 11 11 8 12 0 Z";

function Shape({ kind, color, i }: { kind: FxKind; color: string; i: number }) {
  switch (kind) {
    case "hearts": return <svg viewBox="0 0 24 24" className="h-full w-full"><path d={HEART} fill={color} /></svg>;
    case "petals": return <svg viewBox="0 0 24 24" className="h-full w-full"><path d={PETAL} fill={color} /><path d="M12 3 L12 21" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" /></svg>;
    case "leaves": return <svg viewBox="0 0 24 24" className="h-full w-full"><path d={LEAF} fill={color} /><path d="M3 21 L18 6" stroke="#fff" strokeOpacity=".35" strokeWidth=".9" /></svg>;
    case "stars":
    case "sparkles": return <svg viewBox="0 0 24 24" className="h-full w-full"><path d={STAR} fill={color} /></svg>;
    case "gold": return <svg viewBox="0 0 24 24" className="h-full w-full"><defs><radialGradient id={`g${i}`}><stop offset="0" stopColor="#fff8d6" /><stop offset=".5" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient></defs><circle cx="12" cy="12" r="11" fill={`url(#g${i})`} /></svg>;
    case "confetti": return <svg viewBox="0 0 24 24" className="h-full w-full"><rect x="4" y="8" width="16" height="8" rx="1.5" fill={color} /></svg>;
    case "butterflies":
      return (
        <svg viewBox="0 0 48 32" className="h-full w-full">
          <g className="iv-wing" style={{ transformOrigin: "24px 16px" }}>
            <path d="M24 16 C 16 2 2 2 4 12 C 5 20 16 22 24 16 Z" fill={color} />
            <path d="M24 16 C 32 2 46 2 44 12 C 43 20 32 22 24 16 Z" fill={color} />
            <path d="M24 16 C 14 18 8 28 14 29 C 20 29 24 22 24 16 Z" fill={color} fillOpacity=".8" />
            <path d="M24 16 C 34 18 40 28 34 29 C 28 29 24 22 24 16 Z" fill={color} fillOpacity=".8" />
          </g>
          <rect x="23" y="8" width="2" height="16" rx="1" fill="#3a2a2a" fillOpacity=".7" />
        </svg>
      );
    default: return null;
  }
}

const MODE: Record<Exclude<FxKind, "none">, "fall" | "rise" | "twinkle" | "fly"> = {
  petals: "fall", leaves: "fall", confetti: "fall", gold: "rise", hearts: "rise", sparkles: "rise", stars: "twinkle", butterflies: "fly",
};

/** Ekran bo'ylab suzuvchi zarrachalar (faqat CSS animatsiya, tashqi rasm yo'q). */
export function Fx({ kind, colors }: { kind: FxKind; colors: string[] }) {
  if (kind === "none") return null;
  const mode = MODE[kind];
  const n = mode === "fly" ? 7 : mode === "twinkle" ? 34 : 24;
  const items = Array.from({ length: n }, (_, i) => {
    const size = mode === "fly" ? 30 + r(i, 1) * 26 : mode === "twinkle" ? 5 + r(i, 1) * 11 : kind === "gold" ? 6 + r(i, 1) * 12 : 12 + r(i, 1) * 16;
    const style = {
      left: `${Math.round(r(i, 2) * 96)}%`,
      top: mode === "twinkle" ? `${Math.round(r(i, 3) * 96)}%` : mode === "fly" ? `${12 + Math.round(r(i, 3) * 70)}%` : undefined,
      width: size, height: mode === "fly" ? size * 0.67 : size,
      ["--t" as string]: `${(mode === "fly" ? 16 : mode === "twinkle" ? 2.5 : 9) + r(i, 4) * (mode === "fly" ? 12 : mode === "twinkle" ? 3 : 9)}s`,
      ["--d" as string]: `${-r(i, 5) * (mode === "fly" ? 24 : 14)}s`,
      ["--x" as string]: `${Math.round((r(i, 6) - 0.5) * 140)}px`,
      ["--r" as string]: `${Math.round(r(i, 7) * 360)}deg`,
      opacity: kind === "gold" ? 0.9 : 0.85,
      filter: i % 4 === 0 ? "blur(1.2px)" : undefined,
    } as CSSProperties;
    return (
      <span key={i} className={`iv-fx iv-fx-${mode}`} style={style}>
        <Shape kind={kind} color={colors[i % colors.length]} i={i} />
      </span>
    );
  });
  return (
    <div aria-hidden className="iv-fxbox pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {items}
      {kind === "stars" && (
        <>
          <span className="iv-shoot" style={{ ["--d" as string]: "1s", left: "10%", top: "8%" } as CSSProperties} />
          <span className="iv-shoot" style={{ ["--d" as string]: "6s", left: "45%", top: "18%" } as CSSProperties} />
        </>
      )}
    </div>
  );
}
