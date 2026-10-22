import type { CSSProperties } from "react";

type P = { className?: string; style?: CSSProperties };

/** Art-deko yelpig'ich: konsentrik yoylar va nurlar (oltin chiziqlar). */
export function DecoFan({ className, style, color = "#d9b86c" }: P & { color?: string }) {
  const rays = Array.from({ length: 13 }, (_, i) => {
    const a = (Math.PI * (i + 0.5)) / 13;
    return <line key={i} x1={100 - Math.cos(a) * 22} y1={100 - Math.sin(a) * 22} x2={100 - Math.cos(a) * 92} y2={100 - Math.sin(a) * 92} />;
  });
  return (
    <svg viewBox="0 0 200 104" aria-hidden className={className} style={style} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      {rays}
      {[22, 40, 58, 76, 94].map((r) => <path key={r} d={`M${100 - r} 100 A${r} ${r} 0 0 1 ${100 + r} 100`} strokeOpacity={r > 80 ? 0.9 : 0.55} />)}
      <path d="M6 100 H194" />
    </svg>
  );
}

/** Evkalipt shoxi: yumaloq barglar juftligi. */
export function Eucalyptus({ className, style, flip = false, leaf = "#8fa58a", stem = "#5d7559" }: P & { flip?: boolean; leaf?: string; stem?: string }) {
  const n = 9;
  const items: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const y = 20 + i * 24;
    const w = 15 - i * 0.7;
    items.push(
      <ellipse key={`l${i}`} cx={50 - 17 - i * 0.4} cy={y} rx={w} ry={w * 0.62} transform={`rotate(${-28 - i * 2} ${50 - 8} ${y})`} fill={leaf} fillOpacity={0.9 - i * 0.04} />,
      <ellipse key={`r${i}`} cx={50 + 17 + i * 0.4} cy={y + 10} rx={w} ry={w * 0.62} transform={`rotate(${28 + i * 2} ${50 + 8} ${y + 10})`} fill={leaf} fillOpacity={0.82 - i * 0.04} />,
    );
  }
  return (
    <svg viewBox="0 0 100 250" aria-hidden className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : style?.transform }}>
      <path d="M50 246 C 48 170 52 90 50 8" stroke={stem} strokeWidth="2" fill="none" strokeLinecap="round" />
      {items}
      <ellipse cx="50" cy="8" rx="6" ry="9" fill={leaf} />
    </svg>
  );
}

/** Boho kamalak: ichma-ich yoylar. */
export function BohoArches({ className, style, colors }: P & { colors: string[] }) {
  return (
    <svg viewBox="0 0 200 110" aria-hidden className={className} style={style}>
      {colors.map((c, i) => {
        const r = 96 - i * 17;
        return <path key={c + i} d={`M${100 - r} 108 V${108 - r} A${r} ${r} 0 0 1 ${100 + r} ${108 - r} V108 Z`} fill={c} />;
      })}
    </svg>
  );
}
