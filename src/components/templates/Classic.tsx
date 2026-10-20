import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden className={`absolute h-16 w-16 text-[#b08d3c] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 76V30C4 14 14 4 30 4h46" />
      <path d="M13 76V34c0-12 9-21 21-21h42" opacity=".6" />
      <path d="M24 24c6-6 14-4 14 3s-9 8-11 2" />
      <circle cx="30" cy="30" r="2.2" fill="currentColor" />
    </svg>
  );
}

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" aria-hidden className={`mx-auto h-5 w-44 text-[#b08d3c] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path className="tk-draw" style={{ ["--len" as string]: 220 }} d="M4 10h66c8 0 10-8 18-8s8 8 12 8 4-8 12-8 10 8 18 8h66" />
      <path d="M96 10l4-5 4 5-4 5z" fill="currentColor" />
    </svg>
  );
}

export default function Classic({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-[radial-gradient(ellipse_at_top,#fffdf8,#f6efe0)] p-4 font-serif text-[#3b3328]">
      <div className="relative border border-[#b08d3c] p-1.5">
        <Corner className="left-1 top-1" />
        <Corner className="right-1 top-1 rotate-90" />
        <Corner className="bottom-1 right-1 rotate-180" />
        <Corner className="bottom-1 left-1 -rotate-90" />
        <div className="border border-[#b08d3c]/60 px-6 py-12 text-center">
          <p className="tk-rise text-[11px] uppercase tracking-[0.35em] text-[#8a6d26]" style={delay(0.1)}>Nikoh to‘yiga taklif</p>
          <div className="tk-rise" style={delay(0.25)}><Flourish className="mt-3" /></div>

          <div className="tk-rise relative mx-auto mt-6 h-60 w-48" style={delay(0.4)}>
            <svg viewBox="0 0 100 100" aria-hidden className="tk-spin absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-[#b08d3c]/70" fill="none" stroke="currentColor">
              <ellipse cx="50" cy="50" rx="48" ry="49" strokeWidth=".5" strokeDasharray="1.5 2.5" />
            </svg>
            {data.photoUrl ? (
              <Photo
                url={data.photoUrl}
                alt={`${data.groomName} va ${data.brideName}`}
                className="relative h-full w-full rounded-[50%] border-2 border-[#b08d3c] p-1.5 shadow-[0_10px_30px_rgba(120,90,30,.25)]"
              />
            ) : (
              <div aria-hidden className="relative flex h-full w-full items-center justify-center rounded-[50%] border-2 border-[#b08d3c] text-5xl italic text-[#b08d3c]">
                {initials(data.groomName, data.brideName)}
              </div>
            )}
          </div>

          <h1 className="tk-rise mt-8 text-4xl leading-tight" style={delay(0.6)}>{data.groomName}</h1>
          <p className="tk-rise my-1 text-2xl italic text-[#b08d3c]" style={delay(0.7)}>va</p>
          <h1 className="tk-rise text-4xl leading-tight" style={delay(0.8)}>{data.brideName}</h1>

          {data.extraText && (
            <p className="tk-rise mx-auto mt-6 max-w-xs whitespace-pre-line text-sm italic leading-relaxed" style={delay(0.95)}>{data.extraText}</p>
          )}

          <div className="tk-rise" style={delay(1.05)}><Flourish className="mt-8" /></div>

          <div className="tk-rise mt-6" style={delay(1.15)}>
            {when ? (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8a6d26]">{when.weekday}</p>
                <p className="mt-1 text-2xl">{when.date}</p>
                <p className="mt-1 text-lg">soat {when.time} da</p>
              </div>
            ) : (
              <p className="text-sm text-[#8a6d26]">To‘y sanasi kiritilmagan</p>
            )}
          </div>

          <div className="tk-rise" style={delay(1.3)}>
            <p className="mt-6 text-xl">{data.venueName}</p>
            <p className="mt-1 text-sm">{data.venueAddress}</p>
            <MapLink address={data.venueAddress} className="mt-4 inline-block border-b border-[#b08d3c] pb-0.5 text-sm text-[#8a6d26]" />
          </div>

          <div className="tk-rise mt-8" style={delay(1.45)}>
            <Countdown
              iso={data.weddingAt}
              boxClass="border border-[#b08d3c]/60 bg-white/50 py-2"
              numClass="text-2xl text-[#8a6d26]"
              labelClass="text-[10px] uppercase tracking-widest"
              pastClass="text-sm italic text-[#8a6d26]"
            />
          </div>

          <MusicControl track={data.music} className="mt-8 text-[#8a6d26]" />
        </div>
      </div>
    </section>
  );
}
