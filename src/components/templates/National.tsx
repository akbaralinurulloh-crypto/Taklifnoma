import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

const ADRAS =
  "bg-[repeating-linear-gradient(90deg,#c1272d_0_14px,#f2b705_14px_28px,#1b6ca8_28px_42px,#2e8b57_42px_56px,#fff7e6_56px_62px)]";

/** Bodom (bodom naqshi) va rombli milliy naqsh bandi. Sekin siljiydi. */
function Tile() {
  return (
    <svg viewBox="0 0 56 24" className="h-6 w-14 shrink-0" aria-hidden>
      <path d="M28 2C37 8 39 16 28 23 17 16 19 8 28 2z" fill="#c1272d" />
      <path d="M28 7C32 10 33 14 28 18 23 14 24 10 28 7z" fill="#f2b705" />
      <circle cx="28" cy="13" r="1.6" fill="#1b2a6b" />
      <path d="M3 12l6-6 6 6-6 6z" fill="#1b6ca8" />
      <path d="M41 12l6-6 6 6-6 6z" fill="#2e8b57" />
    </svg>
  );
}

function Band({ reverse = false }: { reverse?: boolean }) {
  const tiles = Array.from({ length: 9 }, (_, i) => <Tile key={i} />);
  return (
    <div className="overflow-hidden bg-[#fff1d6]" aria-hidden>
      <div className="tk-marquee" style={reverse ? { animationDirection: "reverse" } : undefined}>
        <div className="flex">{tiles}</div>
        <div className="flex">{tiles}</div>
      </div>
    </div>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <g fill="none" strokeWidth="1.6">
        <path d="M50 4l9 28 28-9-19 24 24 19-30-2-2 30-10-27-27 10 15-26-26-15 29-3z" stroke="#c1272d" />
        <circle cx="50" cy="50" r="12" stroke="#1b6ca8" />
        <circle cx="50" cy="50" r="4" fill="#f2b705" stroke="none" />
      </g>
    </svg>
  );
}

export default function National({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] overflow-hidden bg-[#fff7e6] text-[#1b2a6b]">
      <div className={`h-3 ${ADRAS}`} />
      <Band />
      <div className="relative px-6 py-10 text-center">
        <Star className="tk-spin absolute -right-12 top-6 h-40 w-40 opacity-15" />
        <Star className="tk-spin-rev absolute -left-14 bottom-24 h-44 w-44 opacity-15" />

        <p aria-hidden className="tk-rise text-lg tracking-[0.6em] text-[#c1272d]" style={delay(0.1)}>◆ ◇ ◆ ◇ ◆</p>
        <p className="tk-rise mt-3 text-xs font-semibold uppercase tracking-[0.3em]" style={delay(0.2)}>Taklifnoma</p>
        <p className="tk-rise mt-1 text-sm" style={delay(0.3)}>Aziz mehmonlar, to‘yimizga marhamat!</p>

        <div className="tk-rise relative mx-auto mt-6 w-full max-w-[250px]" style={delay(0.45)}>
          {data.photoUrl ? (
            <div className="rounded-t-[999px] rounded-b-2xl bg-[repeating-linear-gradient(45deg,#c1272d_0_8px,#f2b705_8px_16px,#1b6ca8_16px_24px)] p-1.5 shadow-lg">
              <Photo
                url={data.photoUrl}
                alt={`${data.groomName} va ${data.brideName}`}
                className="h-64 w-full rounded-t-[999px] rounded-b-xl border-4 border-[#fff7e6]"
              />
            </div>
          ) : (
            <div aria-hidden className="flex h-64 items-center justify-center rounded-t-[999px] rounded-b-2xl border-4 border-[#c1272d] text-5xl font-bold text-[#c1272d]">
              {initials(data.groomName, data.brideName)}
            </div>
          )}
        </div>

        <h1 className="tk-rise mt-6 text-4xl font-bold leading-tight" style={delay(0.6)}>{data.groomName}</h1>
        <p aria-hidden className="tk-float my-1 text-2xl text-[#f2b705]">❖</p>
        <h1 className="tk-rise text-4xl font-bold leading-tight" style={delay(0.75)}>{data.brideName}</h1>

        {data.extraText && (
          <p className="tk-rise mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed" style={delay(0.9)}>{data.extraText}</p>
        )}

        <div className="tk-rise relative mt-8 rounded-2xl border-2 border-dashed border-[#1b6ca8] bg-white/60 p-5" style={delay(1)}>
          <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fff7e6] px-2 text-[#c1272d]">❖</span>
          {when ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#c1272d]">{when.weekday}</p>
              <p className="mt-1 text-2xl font-bold">{when.date}</p>
              <p className="mt-1 text-lg">soat {when.time}</p>
            </>
          ) : (
            <p className="text-sm">To‘y sanasi kiritilmagan</p>
          )}
          <p className="mt-4 text-xl font-semibold">{data.venueName}</p>
          <p className="text-sm">{data.venueAddress}</p>
          <MapLink address={data.venueAddress} className="mt-3 inline-block rounded-full bg-[#c1272d] px-4 py-1.5 text-sm font-semibold text-white" />
        </div>

        <div className="tk-rise mt-8" style={delay(1.15)}>
          <Countdown
            iso={data.weddingAt}
            boxClass="rounded-xl bg-[#1b2a6b] py-2 text-white shadow-md"
            numClass="text-2xl font-bold text-[#f2b705]"
            labelClass="text-[10px] uppercase tracking-widest"
            pastClass="text-sm font-semibold"
          />
        </div>

        <MusicControl track={data.music} className="mt-8 text-[#1b2a6b]" />
        <p aria-hidden className="mt-8 text-lg tracking-[0.6em] text-[#2e8b57]">◆ ◇ ◆ ◇ ◆</p>
      </div>
      <Band reverse />
      <div className={`h-3 ${ADRAS}`} />
    </section>
  );
}
