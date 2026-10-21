import { useId } from "react";

/**
 * Taklifnomalar uchun bezaklar. Hammasi shu loyiha uchun chizilgan vektor (SVG) shakllar:
 * boshqa saytlardan olingan rasm yo'q.
 */

type P = { className?: string; style?: React.CSSProperties };

const rad = (d: number) => (d * Math.PI) / 180;

/** Atirgul: qatlam-qatlam gulbarglar. */
export function Rose({ className, style, c1 = "#8a1c2b", c2 = "#b3263a", c3 = "#d94a5e" }: P & { c1?: string; c2?: string; c3?: string }) {
  const outer = [0, 72, 144, 216, 288];
  const mid = [36, 108, 180, 252, 324];
  return (
    <svg viewBox="-60 -60 120 120" aria-hidden className={className} style={style}>
      {outer.map((a) => (
        <ellipse key={a} cx="0" cy="-30" rx="24" ry="30" fill={c1} transform={`rotate(${a})`} stroke={c3} strokeOpacity=".35" strokeWidth="1" />
      ))}
      {mid.map((a) => (
        <ellipse key={a} cx="0" cy="-20" rx="17" ry="21" fill={c2} transform={`rotate(${a})`} stroke={c3} strokeOpacity=".4" strokeWidth="1" />
      ))}
      {outer.map((a) => (
        <ellipse key={a} cx="0" cy="-11" rx="10" ry="13" fill={c3} transform={`rotate(${a + 20})`} fillOpacity=".85" />
      ))}
      <path d="M0 0 m-5 0 a5 5 0 1 1 5 5 a8 8 0 1 1 -8 -8" fill="none" stroke={c1} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Barg. */
function Leaf({ x, y, r, s = 1, fill }: { x: number; y: number; r: number; s?: number; fill: string }) {
  return (
    <path
      d="M0 0 C 8 -8 20 -8 28 0 C 20 8 8 8 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill={fill}
    />
  );
}

/** Novda: egilgan poya va barglar. */
export function Branch({ className, style, leaf = "#3f7a4a", stem = "#2f5e3a", flip = false }: P & { leaf?: string; stem?: string; flip?: boolean }) {
  const leaves: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 20 + t * 150;
    const y = 120 - Math.sin(t * Math.PI * 0.9) * 90;
    leaves.push(<Leaf key={`a${i}`} x={x} y={y} r={-50 - i * 4} s={1.1 - t * 0.35} fill={leaf} />);
    leaves.push(<Leaf key={`b${i}`} x={x} y={y} r={50 + i * 3} s={1.0 - t * 0.35} fill={leaf} />);
  }
  return (
    <svg viewBox="0 0 200 140" aria-hidden className={className} style={{ ...style, transform: `${flip ? "scaleX(-1) " : ""}${style?.transform ?? ""}` }}>
      <path d="M10 125 C 60 120 110 80 175 28" fill="none" stroke={stem} strokeWidth="2.5" strokeLinecap="round" />
      {leaves}
    </svg>
  );
}

/** Lenta (bant). */
export function Bow({ className, style, color = "#8ea16b", dark = "#5f7040" }: P & { color?: string; dark?: string }) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden className={className} style={style}>
      <path d="M60 40 C 40 5 5 5 8 30 C 10 55 40 52 60 42 Z" fill={color} />
      <path d="M60 40 C 80 5 115 5 112 30 C 110 55 80 52 60 42 Z" fill={color} />
      <path d="M60 42 C 45 52 28 58 22 84 C 40 76 52 62 60 46 Z" fill={dark} fillOpacity=".85" />
      <path d="M60 42 C 75 52 92 58 98 84 C 80 76 68 62 60 46 Z" fill={dark} fillOpacity=".85" />
      <path d="M15 22 C 30 12 45 22 56 38" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <path d="M105 22 C 90 12 75 22 64 38" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <rect x="50" y="32" width="20" height="18" rx="7" fill={dark} />
    </svg>
  );
}

/** Ipak mato to'lqini: ko'p qatlamli gradient. */
export function Silk({ className, style, stops = ["#6c5a22", "#d9c07a", "#8a7233", "#f1e2b0", "#7d6628"], flip = false }: P & { stops?: string[]; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 420 200" preserveAspectRatio="none" aria-hidden className={className} style={{ ...style, transform: flip ? "scaleY(-1)" : undefined }}>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">
          {[...stops].reverse().map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <path d="M0 40 C 90 -10 150 120 260 70 C 330 40 380 20 420 50 L420 200 L0 200 Z" fill={`url(#${id}a)`} />
      <path d="M0 90 C 80 40 170 160 270 110 C 340 80 390 70 420 100 L420 200 L0 200 Z" fill={`url(#${id}b)`} fillOpacity=".8" />
      <path d="M0 140 C 100 100 190 180 290 150 C 350 130 395 125 420 140 L420 200 L0 200 Z" fill={`url(#${id}a)`} fillOpacity=".9" />
      <path d="M0 60 C 90 10 150 140 260 90" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
    </svg>
  );
}

/** Bulutlar. */
export function Clouds({ className, style, fill = "#ffffff" }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 420 120" aria-hidden className={className} style={style}>
      <g fill={fill} fillOpacity=".85">
        <ellipse cx="70" cy="70" rx="60" ry="22" />
        <ellipse cx="110" cy="52" rx="40" ry="26" />
        <ellipse cx="260" cy="40" rx="70" ry="20" />
        <ellipse cx="300" cy="26" rx="38" ry="20" />
        <ellipse cx="360" cy="86" rx="55" ry="18" />
      </g>
    </svg>
  );
}

/** To'rt qirrali yaltiroq yulduzcha. */
export function Sparkle({ className, style, fill = "#d9b45b" }: P & { fill?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden className={className} style={style}>
      <path d="M0 -9 C 1 -3 3 -1 9 0 C 3 1 1 3 0 9 C -1 3 -3 1 -9 0 C -3 -1 -1 -3 0 -9 Z" fill={fill} />
    </svg>
  );
}

/** Yurak. */
export function Heart({ className, style, fill = "currentColor" }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 24 22" aria-hidden className={className} style={style}>
      <path d="M12 21 C 2 13 0 8 3 4.5 C 6 1.5 10 2.5 12 6 C 14 2.5 18 1.5 21 4.5 C 24 8 22 13 12 21 Z" fill={fill} />
    </svg>
  );
}

/** Qog'ozning yirtilgan chekkasi (tepa yoki past). */
export function TornEdge({ className, style, fill = "#fdf8f4", flip = false }: P & { fill?: string; flip?: boolean }) {
  let d = "M0 20";
  let seed = 7;
  for (let x = 0; x <= 420; x += 14) {
    seed = (seed * 9301 + 49297) % 233280;
    const y = 8 + (seed / 233280) * 18;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  d += " L420 40 L0 40 Z";
  return (
    <svg viewBox="0 0 420 40" preserveAspectRatio="none" aria-hidden className={className} style={{ ...style, transform: flip ? "scaleY(-1)" : undefined }}>
      <path d={d} fill={fill} />
    </svg>
  );
}

/** Qalam bilan chizilgan gul shoxi (faqat chiziq). */
export function LineFlora({ className, style, color = "#2a2a2a", flip = false }: P & { color?: string; flip?: boolean }) {
  const petals = (cx: number, cy: number, r: number) =>
    [0, 72, 144, 216, 288].map((a) => (
      <path
        key={`${cx}${a}`}
        d={`M${cx} ${cy} C ${cx + r * 0.9} ${cy - r * 0.4} ${cx + r * 0.9} ${cy - r * 1.5} ${cx} ${cy - r * 1.7} C ${cx - r * 0.9} ${cy - r * 1.5} ${cx - r * 0.9} ${cy - r * 0.4} ${cx} ${cy}`}
        transform={`rotate(${a} ${cx} ${cy})`}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
    ));
  const leaves = [20, 55, 95, 135].map((x, i) => (
    <path
      key={x}
      d={`M${x} ${150 - i * 26} C ${x + 14} ${140 - i * 26} ${x + 26} ${150 - i * 26} ${x + 34} ${158 - i * 26} C ${x + 20} ${166 - i * 26} ${x + 8} ${160 - i * 26} ${x} ${150 - i * 26}`}
      fill="none"
      stroke={color}
      strokeWidth="1.1"
    />
  ));
  return (
    <svg viewBox="0 0 200 180" aria-hidden className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M10 170 C 60 150 110 110 150 50" fill="none" stroke={color} strokeWidth="1.4" />
      {leaves}
      {petals(150, 42, 20)}
      {petals(105, 92, 14)}
      <circle cx="150" cy="42" r="3" fill="none" stroke={color} />
      <circle cx="105" cy="92" r="2.2" fill="none" stroke={color} />
    </svg>
  );
}

/** Sakkiz qirrali yulduz (girih). */
export function Star8({ className, style, fill = "none", stroke = "currentColor" }: P & { fill?: string; stroke?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 48 : 26;
    const a = rad(i * 22.5 - 90);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <polygon points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="9" fill="none" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

/** Mehrob (uchli yoy) kontur yo'li. 200x280 maydon. */
export const OGIVE_PATH = "M8 280 L8 120 C 8 60 70 30 100 0 C 130 30 192 60 192 120 L192 280 Z";

/** Koshin (plitka) bandi: ketma-ket yulduz va rombchalar. */
export function TileBand({ className, style, a = "#0f7f86", b = "#e8f4f2", c = "#d9a441" }: P & { a?: string; b?: string; c?: string }) {
  const cells = Array.from({ length: 11 });
  return (
    <svg viewBox="0 0 440 40" preserveAspectRatio="xMidYMid slice" aria-hidden className={className} style={style}>
      <rect width="440" height="40" fill={a} />
      {cells.map((_, i) => (
        <g key={i} transform={`translate(${i * 40 + 20} 20)`}>
          <rect x="-12" y="-12" width="24" height="24" fill={b} transform="rotate(45)" />
          <rect x="-7" y="-7" width="14" height="14" fill={a} transform="rotate(45)" />
          <circle r="3" fill={c} />
        </g>
      ))}
    </svg>
  );
}

/** Atlas (ikat) bandi: cho'zilgan "bodom" shakllar va chiziqlar. */
export function AtlasBand({ className, style, colors = ["#c8281e", "#f2b01e", "#1f4aa8", "#fff6df"] }: P & { colors?: string[] }) {
  const [r, y, b, w] = colors;
  const items = Array.from({ length: 10 });
  return (
    <svg viewBox="0 0 420 70" preserveAspectRatio="xMidYMid slice" aria-hidden className={className} style={style}>
      <rect width="420" height="70" fill={w} />
      <rect y="0" width="420" height="7" fill={b} />
      <rect y="63" width="420" height="7" fill={b} />
      {items.map((_, i) => (
        <g key={i} transform={`translate(${i * 42 + 21} 35)`}>
          <path d="M0 -24 C 18 -12 18 12 0 24 C -18 12 -18 -12 0 -24 Z" fill={i % 2 ? r : y} />
          <path d="M0 -14 C 9 -6 9 6 0 14 C -9 6 -9 -6 0 -14 Z" fill={i % 2 ? y : r} />
          <circle r="3.2" fill={b} />
          <path d="M-21 -2 L-12 -2 M12 -2 L21 -2" stroke={b} strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

/** Kaptar (oddiy siluet). */
export function Dove({ className, style, fill = "#ffffff" }: P & { fill?: string }) {
  return (
    <svg viewBox="0 0 80 50" aria-hidden className={className} style={style}>
      <path d="M4 30 C 14 26 22 28 30 22 C 38 8 54 4 66 10 C 58 12 54 16 52 22 C 62 20 72 24 76 32 C 62 30 56 34 50 42 C 42 48 26 46 18 40 C 14 36 10 33 4 30 Z" fill={fill} />
      <circle cx="60" cy="14" r="1.4" fill="#444" />
    </svg>
  );
}
