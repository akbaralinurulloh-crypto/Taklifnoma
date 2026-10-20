import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

const GOLD_TEXT =
  "tk-shimmer bg-[linear-gradient(110deg,#a47e2c_20%,#f8e7b0_40%,#d9b65d_50%,#a47e2c_80%)] bg-clip-text text-transparent";

const STARS = [
  { l: "8%", t: "6%", d: 0, s: 3 }, { l: "88%", t: "9%", d: 1.1, s: 4 }, { l: "20%", t: "22%", d: 2, s: 2 },
  { l: "76%", t: "30%", d: 0.6, s: 3 }, { l: "6%", t: "48%", d: 1.7, s: 2 }, { l: "93%", t: "58%", d: 2.4, s: 3 },
  { l: "14%", t: "74%", d: 0.9, s: 4 }, { l: "82%", t: "84%", d: 1.4, s: 2 }, { l: "50%", t: "95%", d: 2.8, s: 3 },
];

function Fan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth=".8">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M60 58 L${60 + (i - 3) * 22} 4`} opacity={0.5 + (i % 2) * 0.3} />
      ))}
      <path d="M8 58a52 52 0 0 1 104 0" />
      <path d="M22 58a38 38 0 0 1 76 0" opacity=".6" />
      <path d="M36 58a24 24 0 0 1 48 0" opacity=".4" />
    </svg>
  );
}

export default function Luxury({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-[#14110d] p-4 text-[#e9dcc0]">
      <div className="tk-glow border border-[#a47e2c] p-1">
        <div className="relative overflow-hidden border border-[#a47e2c]/50 bg-[radial-gradient(ellipse_at_top,#2a2014_0%,#14110d_65%)] px-6 py-12 text-center">
          {STARS.map((s, i) => (
            <span
              key={i}
              aria-hidden
              className="tk-twinkle absolute rounded-full bg-[#f5e1a4]"
              style={{ left: s.l, top: s.t, width: s.s, height: s.s, ...delay(s.d) } as React.CSSProperties}
            />
          ))}
          <span aria-hidden className="absolute left-3 top-3 h-6 w-6 border-l border-t border-[#d9b65d]" />
          <span aria-hidden className="absolute right-3 top-3 h-6 w-6 border-r border-t border-[#d9b65d]" />
          <span aria-hidden className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-[#d9b65d]" />
          <span aria-hidden className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-[#d9b65d]" />

          <Fan className="tk-fade relative mx-auto h-14 w-28 text-[#d9b65d]" />
          <p className="tk-rise relative mt-3 text-[10px] uppercase tracking-[0.5em] text-[#d9b65d]" style={delay(0.2)}>Hashamatli to‘y marosimi</p>

          <div className="tk-rise relative mx-auto mt-8 h-64 w-48" style={delay(0.4)}>
            <svg viewBox="0 0 100 100" aria-hidden className="tk-spin absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] text-[#d9b65d]/50" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="49" strokeWidth=".35" strokeDasharray="0.8 2.2" />
            </svg>
            {data.photoUrl ? (
              <Photo
                url={data.photoUrl}
                alt={`${data.groomName} va ${data.brideName}`}
                className="relative h-full w-full rounded-t-full border border-[#d9b65d] p-1.5 shadow-[0_0_40px_rgba(217,182,93,.25)]"
              />
            ) : (
              <div aria-hidden className="relative flex h-full w-full items-center justify-center rounded-t-full border border-[#d9b65d] font-serif text-5xl text-[#d9b65d]">
                {initials(data.groomName, data.brideName)}
              </div>
            )}
          </div>

          <h1 className="tk-rise relative mt-8 font-serif text-4xl uppercase leading-tight tracking-[0.12em]" style={delay(0.6)}>
            <span className={GOLD_TEXT}>{data.groomName}</span>
          </h1>
          <div aria-hidden className="relative mx-auto my-3 flex items-center justify-center gap-3 text-[#d9b65d]">
            <span className="tk-line h-px w-12 bg-[#d9b65d]/60" style={delay(0.8)} />
            <span className="tk-float">&amp;</span>
            <span className="tk-line h-px w-12 origin-right bg-[#d9b65d]/60" style={delay(0.8)} />
          </div>
          <h1 className="tk-rise relative font-serif text-4xl uppercase leading-tight tracking-[0.12em]" style={delay(0.9)}>
            <span className={GOLD_TEXT}>{data.brideName}</span>
          </h1>

          {data.extraText && (
            <p className="tk-rise relative mx-auto mt-8 max-w-xs whitespace-pre-line text-sm leading-relaxed text-[#cdbf9f]" style={delay(1)}>
              {data.extraText}
            </p>
          )}

          <div className="tk-rise relative mt-10" style={delay(1.1)}>
            {when ? (
              <>
                <p className="text-xs uppercase tracking-[0.4em] text-[#d9b65d]">{when.weekday}</p>
                <p className="mt-2 font-serif text-2xl">{when.date}</p>
                <p className="mt-1 text-sm tracking-widest">soat {when.time}</p>
              </>
            ) : (
              <p className="text-sm text-[#d9b65d]">To‘y sanasi kiritilmagan</p>
            )}
          </div>

          <div className="tk-rise relative mt-8" style={delay(1.25)}>
            <p className="font-serif text-xl tracking-wide">{data.venueName}</p>
            <p className="mt-1 text-sm text-[#cdbf9f]">{data.venueAddress}</p>
            <MapLink address={data.venueAddress} className="mt-4 inline-block border border-[#d9b65d] px-5 py-2 text-xs uppercase tracking-[0.25em] text-[#d9b65d] transition-colors hover:bg-[#d9b65d] hover:text-[#14110d]" />
          </div>

          <div className="tk-rise relative mt-10" style={delay(1.4)}>
            <Countdown
              iso={data.weddingAt}
              boxClass="border border-[#a47e2c]/60 bg-black/20 py-2"
              numClass="font-serif text-2xl text-[#f5e1a4]"
              labelClass="text-[10px] uppercase tracking-widest text-[#d9b65d]"
              pastClass="text-sm italic text-[#d9b65d]"
            />
          </div>

          <MusicControl track={data.music} className="relative mt-8 text-[#d9b65d]" />
        </div>
      </div>
    </section>
  );
}
