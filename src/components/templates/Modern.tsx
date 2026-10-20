import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

function Ticker({ text, className = "" }: { text: string; className?: string }) {
  const row = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="px-4">{text}</span>
  ));
  return (
    <div aria-hidden className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="tk-marquee">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

function Sticker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      <defs>
        <path id="tk-sticker-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#ff4f2b" />
      <g className="tk-spin" style={{ transformOrigin: "60px 60px" }}>
        <text fontSize="11" fontWeight="800" letterSpacing="3" fill="#fff">
          <textPath href="#tk-sticker-circle">SIZNI KUTAMIZ • SIZNI KUTAMIZ •</textPath>
        </text>
      </g>
      <path d="M60 44c-8-10-22-3-17 8 3 7 17 14 17 14s14-7 17-14c5-11-9-18-17-8z" fill="#fff" />
    </svg>
  );
}

export default function Modern({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] overflow-hidden bg-[#f2efe9] pb-10 text-[#111]">
      <Ticker text="TAKLIF ✦ TO‘Y ✦ MAROSIM ✦" className="bg-[#111] py-2 text-[11px] font-bold tracking-[0.3em] text-[#f2efe9]" />

      <div className="px-5 pt-8">
        <div className="tk-fade flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em]">
          <span>Taklif</span>
          <span className="text-[#ff4f2b]">{when ? when.date.split(",")[1]?.trim().replace("-yil", "") : "—"}</span>
        </div>

        <h1 className="mt-6 break-words text-[clamp(34px,12.5vw,52px)] font-black uppercase leading-[0.9] tracking-tight">
          <span className="tk-rise block" style={delay(0.1)}>{data.groomName}</span>
          <span className="tk-rise block text-[#ff4f2b]" style={delay(0.25)}>&amp;</span>
          <span
            className="tk-rise block text-transparent [-webkit-text-stroke:2px_#111]"
            style={delay(0.4)}
          >
            {data.brideName}
          </span>
        </h1>

        <div className="tk-rise relative mt-8" style={delay(0.55)}>
          {data.photoUrl ? (
            <Photo
              url={data.photoUrl}
              alt={`${data.groomName} va ${data.brideName}`}
              className="h-72 w-full -rotate-2 border-4 border-[#111] shadow-[8px_8px_0_#ff4f2b] transition-transform duration-500 hover:rotate-0"
            />
          ) : (
            <div aria-hidden className="flex h-72 w-full -rotate-2 items-center justify-center border-4 border-[#111] bg-[#ffd9cf] text-7xl font-black shadow-[8px_8px_0_#ff4f2b]">
              {initials(data.groomName, data.brideName)}
            </div>
          )}
          <Sticker className="tk-float absolute -bottom-8 -right-3 h-28 w-28 drop-shadow-lg" />
        </div>

        {data.extraText && (
          <p className="tk-rise mt-12 whitespace-pre-line border-l-4 border-[#ff4f2b] pl-4 text-sm font-medium leading-relaxed" style={delay(0.7)}>
            {data.extraText}
          </p>
        )}

        <div className="tk-rise mt-10 bg-[#111] p-6 text-white shadow-[6px_6px_0_#ff4f2b]" style={delay(0.8)}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4f2b]">
            {when ? when.weekday : "Sana"}
          </p>
          <p className="mt-1 text-3xl font-black uppercase leading-tight">{when ? when.date : "Kiritilmagan"}</p>
          <p className="mt-1 text-xl font-bold">{when ? `soat ${when.time}` : ""}</p>
          <div className="my-5 h-px bg-white/30" />
          <p className="text-xl font-bold">{data.venueName}</p>
          <p className="text-sm text-white/80">{data.venueAddress}</p>
          <MapLink address={data.venueAddress} className="mt-4 inline-block bg-[#ff4f2b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5" />
        </div>

        <div className="tk-rise mt-8" style={delay(0.95)}>
          <Countdown
            iso={data.weddingAt}
            boxClass="border-2 border-[#111] bg-white py-2"
            numClass="text-3xl font-black"
            labelClass="text-[10px] font-bold uppercase tracking-widest"
            pastClass="text-sm font-bold uppercase"
          />
        </div>

        <MusicControl track={data.music} className="mt-8 text-[#111]" />
      </div>
      <Ticker text="SIZNI KUTAMIZ ✦" className="mt-8 bg-[#ff4f2b] py-2 text-[11px] font-bold tracking-[0.3em] text-white" />
    </section>
  );
}
