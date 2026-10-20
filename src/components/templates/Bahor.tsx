import type { PublicInvitation } from "@/lib/types";
import { whenText, dateParts } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

function Leaf({ x, y, r, s = 1, c = "#7fa37a" }: { x: number; y: number; r: number; s?: number; c?: string }) {
  return <path d="M0 0C8-10 8-26 0-36-8-26-8-10 0 0z" fill={c} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity=".9" />;
}

function Branch({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 160 220" aria-hidden className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} fill="none">
      <path className="tk-draw" style={{ ["--len" as string]: 300 }} d="M10 0C30 60 40 120 90 210" stroke="#4d7a52" strokeWidth="2" strokeLinecap="round" />
      <g className="tk-sway" style={delay(0.2)}>
        <Leaf x={22} y={44} r={-60} s={1.1} />
        <Leaf x={34} y={70} r={60} s={1.2} c="#9bb89a" />
        <Leaf x={40} y={100} r={-55} s={1.2} />
        <Leaf x={56} y={128} r={62} s={1.1} c="#9bb89a" />
        <Leaf x={66} y={156} r={-50} s={1} />
        <Leaf x={82} y={186} r={58} s={.9} c="#9bb89a" />
        <circle cx="30" cy="30" r="5" fill="#f4b8b0" />
        <circle cx="48" cy="86" r="4" fill="#f2c14e" />
        <circle cx="74" cy="142" r="4.5" fill="#f4b8b0" />
      </g>
    </svg>
  );
}

function Wreath() {
  const n = 22;
  return (
    <svg viewBox="-150 -180 300 360" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[300px] -translate-x-1/2 -translate-y-1/2" fill="none">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.sin(a) * 112, y = -Math.cos(a) * 140;
        const rot = (a * 180) / Math.PI + (i % 2 ? 90 : -90);
        return <Leaf key={i} x={x} y={y} r={rot} s={.9} c={i % 3 === 0 ? "#f4b8b0" : i % 2 ? "#9bb89a" : "#6f9a6f"} />;
      })}
    </svg>
  );
}

export default function Bahor({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  const dp = dateParts(data.weddingAt);
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-[#f1f5ec] px-6 py-12 text-center text-[#23402f]">
      <div aria-hidden className="absolute -left-20 top-60 h-64 w-64 rounded-full bg-[#f4c9c0]/50 blur-3xl" />
      <div aria-hidden className="absolute -right-24 bottom-40 h-72 w-72 rounded-full bg-[#cfe2c6]/70 blur-3xl" />
      <Branch className="absolute -left-2 -top-2 h-52 w-40" />
      <Branch className="absolute -right-2 -top-2 h-52 w-40" flip />

      <p className="tk-rise relative mt-2 font-serif text-sm italic tracking-wide text-[#4d7a52]" style={delay(0.1)}>Bahor nafasida, sizni kutamiz</p>

      <div className="tk-rise relative mx-auto mt-8 h-[360px] w-[300px]" style={delay(0.3)}>
        <Wreath />
        {data.photoUrl ? (
          <Photo url={data.photoUrl} alt={`${data.groomName} va ${data.brideName}`} className="absolute left-1/2 top-1/2 h-[250px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-t-full rounded-b-[2rem] border-4 border-white shadow-xl" />
        ) : (
          <div aria-hidden className="absolute left-1/2 top-1/2 flex h-[250px] w-[190px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-t-full rounded-b-[2rem] border-4 border-white bg-[#e3eedb] font-serif text-5xl text-[#4d7a52] shadow-xl">
            {initials(data.groomName, data.brideName)}
          </div>
        )}
      </div>

      <h1 className="tk-rise relative mt-6 font-serif text-5xl italic leading-[1.05] text-[#2f5a3c]" style={delay(0.55)}>
        {data.groomName}
        <span className="block text-3xl text-[#e08a7d]">&amp;</span>
        {data.brideName}
      </h1>

      {data.extraText && (
        <p className="tk-rise relative mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed" style={delay(0.75)}>{data.extraText}</p>
      )}

      <div className="tk-rise relative mx-auto mt-10 grid max-w-xs grid-cols-[auto_1px_1fr] items-center gap-5 rounded-[2rem] bg-white/80 p-6 text-left shadow-[0_14px_40px_-20px_rgba(60,100,60,.5)]" style={delay(0.9)}>
        <div className="text-center">
          {dp ? (
            <>
              <p className="font-serif text-5xl leading-none text-[#2f5a3c]">{dp.day}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#e08a7d]">{dp.month}</p>
              <p className="text-xs text-[#4d7a52]">{dp.year}</p>
            </>
          ) : (
            <p className="text-xs">Sana yo‘q</p>
          )}
        </div>
        <div aria-hidden className="h-full w-px bg-[#9bb89a]/60" />
        <div>
          <p className="text-xs uppercase tracking-widest text-[#4d7a52]">{when ? when.weekday : ""}</p>
          <p className="mt-0.5 text-lg">{when ? `soat ${when.time}` : "Vaqt kiritilmagan"}</p>
          <p className="mt-2 font-serif text-base leading-snug">{data.venueName}</p>
        </div>
      </div>

      <p className="tk-rise relative mx-auto mt-4 max-w-xs text-sm" style={delay(1)}>{data.venueAddress}</p>
      <div className="tk-rise relative" style={delay(1.05)}>
        <MapLink address={data.venueAddress} className="mt-4 inline-block rounded-full bg-[#4d7a52] px-6 py-2.5 text-sm text-white shadow transition-transform hover:-translate-y-0.5" />
      </div>

      <div className="tk-rise relative mt-10" style={delay(1.15)}>
        <Countdown
          iso={data.weddingAt}
          boxClass="rounded-full bg-white/80 py-3 shadow-sm"
          numClass="font-serif text-2xl text-[#2f5a3c]"
          labelClass="text-[10px] text-[#4d7a52]"
          pastClass="text-sm italic text-[#4d7a52]"
        />
      </div>

      <MusicControl track={data.music} className="relative mt-8 text-[#4d7a52]" />
    </section>
  );
}
