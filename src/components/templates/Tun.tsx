import type { PublicInvitation } from "@/lib/types";
import { dateParts } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

// Deterministik yulduzlar (SSR va brauzer bir xil chiqishi uchun tasodifiy emas).
const STARS = Array.from({ length: 42 }, (_, i) => ({
  l: `${(i * 37 + 11) % 97}%`,
  t: `${(i * 53 + 7) % 96}%`,
  s: 1 + (i % 3),
  d: ((i * 7) % 30) / 10,
}));

function Dot() {
  return <span aria-hidden className="relative z-10 mx-auto block h-3 w-3 rounded-full bg-[#ffe9a8] shadow-[0_0_14px_4px_rgba(255,233,168,.6)]" />;
}

export default function Tun({ data }: { data: PublicInvitation }) {
  const dp = dateParts(data.weddingAt);
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-[linear-gradient(180deg,#060a1d_0%,#10143a_45%,#241a52_100%)] px-6 py-12 text-center text-[#e8e9ff]">
      {STARS.map((s, i) => (
        <span key={i} aria-hidden className="tk-twinkle absolute rounded-full bg-white" style={{ left: s.l, top: s.t, width: s.s, height: s.s, ...delay(s.d) } as React.CSSProperties} />
      ))}
      <span aria-hidden className="tk-shoot absolute left-[8%] top-[4%] h-px w-24 bg-gradient-to-r from-transparent to-white" style={delay(2)} />
      <span aria-hidden className="tk-shoot absolute left-[30%] top-[40%] h-px w-20 bg-gradient-to-r from-transparent to-white" style={delay(6)} />

      <svg viewBox="0 0 60 60" aria-hidden className="tk-float relative mx-auto h-14 w-14">
        <path d="M40 8a24 24 0 1 0 12 40A20 20 0 0 1 40 8z" fill="#ffe9a8" />
      </svg>
      <p className="tk-rise relative mt-3 text-[11px] uppercase tracking-[0.45em] text-[#b9bcff]" style={delay(0.1)}>Yulduzlar ostida</p>

      <div className="tk-rise relative mx-auto mt-8 h-52 w-52" style={delay(0.3)}>
        <div aria-hidden className="tk-pulse-ring absolute inset-0 rounded-full" style={{ ["--ring" as string]: "rgba(185,188,255,.4)" } as React.CSSProperties} />
        {data.photoUrl ? (
          <Photo url={data.photoUrl} alt={`${data.groomName} va ${data.brideName}`} className="relative h-full w-full rounded-full border border-[#b9bcff]/70 p-1.5 shadow-[0_0_60px_rgba(150,150,255,.35)]" />
        ) : (
          <div aria-hidden className="relative flex h-full w-full items-center justify-center rounded-full border border-[#b9bcff]/70 font-serif text-5xl text-[#ffe9a8] shadow-[0_0_60px_rgba(150,150,255,.35)]">
            {initials(data.groomName, data.brideName)}
          </div>
        )}
      </div>

      <h1 className="tk-rise relative mt-8 font-serif text-4xl leading-tight text-white [text-shadow:0_0_24px_rgba(185,188,255,.6)]" style={delay(0.55)}>{data.groomName}</h1>
      <p className="tk-rise relative my-1 text-2xl text-[#ffe9a8]" style={delay(0.65)}>✦</p>
      <h1 className="tk-rise relative font-serif text-4xl leading-tight text-white [text-shadow:0_0_24px_rgba(185,188,255,.6)]" style={delay(0.75)}>{data.brideName}</h1>

      {data.extraText && (
        <p className="tk-rise relative mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed text-[#d4d6ff]" style={delay(0.9)}>{data.extraText}</p>
      )}

      {/* Vertikal yorug' chiziq: sana → joy → qolgan vaqt */}
      <div className="relative mt-12">
        <div aria-hidden className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#b9bcff]/60 to-transparent" />

        <div className="tk-rise relative" style={delay(1)}>
          <Dot />
          <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
            {dp ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#b9bcff]">{dp.weekday}</p>
                <p className="mt-1 font-serif text-4xl text-[#ffe9a8]">{dp.day} {dp.month}</p>
                <p className="text-sm">{dp.year}-yil, soat {dp.time} da</p>
              </>
            ) : (
              <p className="text-sm text-[#b9bcff]">To‘y sanasi kiritilmagan</p>
            )}
          </div>
        </div>

        <div className="tk-rise relative mt-8" style={delay(1.15)}>
          <Dot />
          <div className="mt-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
            <p className="font-serif text-xl">{data.venueName}</p>
            <p className="mt-1 text-sm text-[#d4d6ff]">{data.venueAddress}</p>
            <MapLink address={data.venueAddress} className="mt-4 inline-block rounded-full border border-[#ffe9a8] px-5 py-2 text-sm text-[#ffe9a8] transition-colors hover:bg-[#ffe9a8] hover:text-[#10143a]" />
          </div>
        </div>

        <div className="tk-rise relative mt-8" style={delay(1.3)}>
          <Dot />
          <div className="mt-3">
            <Countdown
              iso={data.weddingAt}
              boxClass="rounded-xl border border-white/15 bg-white/5 py-2 backdrop-blur"
              numClass="font-serif text-2xl text-[#ffe9a8]"
              labelClass="text-[10px] uppercase tracking-widest text-[#b9bcff]"
              pastClass="text-sm italic text-[#ffe9a8]"
            />
          </div>
        </div>
      </div>

      <MusicControl track={data.music} className="relative mt-10 text-[#ffe9a8]" />
    </section>
  );
}
