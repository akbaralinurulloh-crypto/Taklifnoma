import type { PublicInvitation } from "@/lib/types";
import { dateParts } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

const OGIVE = "path('M0 280V112C0 62 62 34 100 0c38 34 100 62 100 112v168z')";

/** Sakkiz qirrali yulduz (girih) koshin naqshi. */
function TileBand({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={`block h-10 w-full ${className}`} preserveAspectRatio="none">
      <defs>
        <pattern id="tk-girih" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#0b3b66" />
          <path d="M20 3l4.5 7.5 8.5-2.5-2.5 8.5L38 20l-7.5 4.5 2.5 8.5-8.5-2.5L20 37l-4.5-7.5L7 32l2.5-8.5L2 20l7.5-4.5L7 7l8.5 2.5z" fill="none" stroke="#19b3c4" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="3.4" fill="#f5d78a" />
          <path d="M0 0l6 6M40 0l-6 6M0 40l6-6M40 40l-6-6" stroke="#19b3c4" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tk-girih)" />
    </svg>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} fill="none" strokeWidth="1.4">
      <path d="M50 2l11 20 22-8-8 22 20 11-20 11 8 22-22-8-11 20-11-20-22 8 8-22L8 47l20-11-8-22 22 8z" stroke="#f5d78a" />
      <circle cx="50" cy="50" r="19" stroke="#19b3c4" />
    </svg>
  );
}

export default function Registon({ data }: { data: PublicInvitation }) {
  const dp = dateParts(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] overflow-hidden bg-[#08294a] text-[#fdf7e8]">
      <TileBand />
      <div className="relative px-6 pb-10 pt-10 text-center">
        <Star className="tk-spin absolute -left-16 top-52 h-44 w-44 opacity-25" />
        <Star className="tk-spin-rev absolute -right-16 top-[34rem] h-44 w-44 opacity-25" />

        <p className="tk-rise relative text-[11px] uppercase tracking-[0.45em] text-[#f5d78a]" style={delay(0.1)}>Taklifnoma</p>

        <div className="tk-rise relative mx-auto mt-6 h-[280px] w-[200px]" style={delay(0.3)}>
          <svg viewBox="-8 -12 216 304" aria-hidden className="absolute h-[304px] w-[216px]" style={{ left: -8, top: -12 }} fill="none">
            <path d="M0 280V112C0 62 62 34 100 0c38 34 100 62 100 112v168" stroke="#f5d78a" strokeWidth="2.5" />
            <path d="M0 280V112C0 62 62 34 100 0c38 34 100 62 100 112v168" stroke="#19b3c4" strokeWidth="1.3" strokeDasharray="3 4" transform="translate(100 150) scale(1.07) translate(-100 -150)" />
          </svg>
          <div className="absolute inset-0 bg-[#0b3b66]" style={{ clipPath: OGIVE }}>
            {data.photoUrl ? (
              <Photo url={data.photoUrl} alt={`${data.groomName} va ${data.brideName}`} className="h-full w-full" />
            ) : (
              <div aria-hidden className="flex h-full w-full items-center justify-center font-serif text-6xl text-[#f5d78a]">
                {initials(data.groomName, data.brideName)}
              </div>
            )}
          </div>
        </div>

        <h1 className="tk-rise relative mt-10 font-serif text-4xl leading-tight text-[#f5d78a]" style={delay(0.55)}>{data.groomName}</h1>
        <p className="tk-rise relative my-1 font-serif text-2xl italic text-[#19b3c4]" style={delay(0.65)}>va</p>
        <h1 className="tk-rise relative font-serif text-4xl leading-tight text-[#f5d78a]" style={delay(0.75)}>{data.brideName}</h1>

        {data.extraText && (
          <p className="tk-rise relative mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed text-[#fdf7e8]/85" style={delay(0.9)}>{data.extraText}</p>
        )}

        <div className="tk-rise relative mt-10" style={delay(1)}>
          {dp ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#19b3c4]">{dp.weekday}</p>
              <div className="relative mx-auto my-1 flex h-40 w-40 items-center justify-center">
                <Star className="tk-spin absolute inset-0 h-full w-full" />
                <p className="relative font-serif text-5xl leading-none text-[#f5d78a]">{dp.day}</p>
              </div>
              <p className="text-sm uppercase tracking-[0.25em]">{dp.month}, {dp.year}</p>
              <p className="mt-2 text-lg">soat {dp.time} da</p>
            </>
          ) : (
            <p className="text-sm text-[#f5d78a]">To‘y sanasi kiritilmagan</p>
          )}
        </div>

        <div className="tk-rise relative mx-auto mt-8 max-w-xs border border-[#19b3c4]/60 bg-[#0b3b66]/60 p-5" style={delay(1.2)}>
          <p className="font-serif text-xl text-[#f5d78a]">{data.venueName}</p>
          <p className="mt-1 text-sm text-[#fdf7e8]/85">{data.venueAddress}</p>
          <MapLink address={data.venueAddress} className="mt-4 inline-block bg-[#19b3c4] px-5 py-2 text-sm font-semibold text-[#08294a] transition-transform hover:-translate-y-0.5" />
        </div>

        <div className="tk-rise relative mt-8" style={delay(1.3)}>
          <Countdown
            iso={data.weddingAt}
            boxClass="border border-[#19b3c4]/60 bg-[#0b3b66] py-2"
            numClass="font-serif text-2xl text-[#f5d78a]"
            labelClass="text-[10px] uppercase tracking-widest text-[#19b3c4]"
            pastClass="text-sm italic text-[#f5d78a]"
          />
        </div>

        <MusicControl track={data.music} className="relative mt-8 text-[#f5d78a]" />
      </div>
      <TileBand />
    </section>
  );
}
