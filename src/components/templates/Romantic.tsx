import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="32" cy="16" rx="9" ry="14" fill="#f9c5d1" transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="7" fill="#f3b04c" />
    </svg>
  );
}

function Petal({ left, d, t, sway, size }: { left: string; d: number; t: number; sway: string; size: number }) {
  return (
    <svg
      viewBox="0 0 20 28"
      aria-hidden
      className="tk-fall pointer-events-none absolute top-0 opacity-0"
      style={{ left, width: size, height: size * 1.4, ["--d" as string]: `${d}s`, ["--t" as string]: `${t}s`, ["--sway" as string]: sway } as React.CSSProperties}
    >
      <path d="M10 1C17 8 19 17 10 27 1 17 3 8 10 1z" fill="#f9a8c0" opacity=".85" />
    </svg>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" aria-hidden className={className}>
      <path d="M12 21C4 14 1 10 1 6.5 1 3.5 3.4 1.5 6 1.5c2.2 0 4.2 1.4 6 3.8 1.8-2.4 3.8-3.8 6-3.8 2.6 0 5 2 5 5 0 3.5-3 7.5-11 14.5z" fill="currentColor" />
    </svg>
  );
}

export default function Romantic({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 px-6 py-12 text-center text-rose-900">
      <div aria-hidden className="absolute -right-16 top-40 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
      <div aria-hidden className="absolute -left-20 bottom-40 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <Flower className="tk-spin absolute -left-6 -top-6 h-28 w-28 opacity-80" />
      <Flower className="tk-spin-rev absolute -right-8 top-24 h-24 w-24 opacity-60" />
      <Flower className="tk-spin absolute -bottom-8 -left-8 h-32 w-32 opacity-70" />

      {[
        { left: "8%", d: 0, t: 13, sway: "30px", size: 12 },
        { left: "24%", d: 4, t: 15, sway: "-20px", size: 9 },
        { left: "46%", d: 1.5, t: 12, sway: "26px", size: 14 },
        { left: "63%", d: 6, t: 16, sway: "-34px", size: 10 },
        { left: "82%", d: 3, t: 14, sway: "18px", size: 13 },
        { left: "92%", d: 8, t: 17, sway: "-22px", size: 9 },
      ].map((p, i) => (
        <Petal key={i} {...p} />
      ))}

      <p className="tk-rise relative font-serif text-sm italic text-rose-500" style={delay(0.1)}>Sevgi bilan taklif qilamiz</p>
      <Heart className="tk-float relative mx-auto mt-2 h-5 w-5 text-rose-400" />

      <div className="tk-rise relative mx-auto mt-6 h-60 w-60" style={delay(0.35)}>
        <div aria-hidden className="tk-pulse-ring absolute inset-3 rounded-full" />
        {data.photoUrl ? (
          <Photo
            url={data.photoUrl}
            alt={`${data.groomName} va ${data.brideName}`}
            className="relative mx-auto h-56 w-56 rounded-full ring-8 ring-white shadow-xl"
          />
        ) : (
          <div aria-hidden className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-white/70 font-serif text-5xl text-rose-300 ring-8 ring-white">
            {initials(data.groomName, data.brideName).split("").join("&")}
          </div>
        )}
        <Heart className="tk-float absolute -right-1 bottom-6 h-9 w-9 text-rose-400 drop-shadow" />
        <Heart className="tk-float absolute -left-1 top-8 h-6 w-6 text-pink-300" />
      </div>

      <h1 className="tk-rise relative mt-8 font-serif text-5xl italic leading-tight text-rose-700" style={delay(0.55)}>
        {data.groomName}
        <span className="block text-3xl text-rose-400">&amp;</span>
        {data.brideName}
      </h1>

      {data.extraText && (
        <p className="tk-rise relative mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed" style={delay(0.7)}>{data.extraText}</p>
      )}

      <div className="tk-rise relative mx-auto mt-8 rounded-[2rem] border border-white bg-white/70 p-6 shadow-[0_10px_40px_rgba(244,114,182,.18)] backdrop-blur" style={delay(0.85)}>
        {when ? (
          <>
            <p className="text-sm text-rose-400">{when.weekday}</p>
            <p className="mt-1 font-serif text-2xl">{when.date}</p>
            <p className="mt-1">soat {when.time}</p>
          </>
        ) : (
          <p className="text-sm text-rose-400">To‘y sanasi kiritilmagan</p>
        )}
        <p className="mt-4 font-serif text-xl">{data.venueName}</p>
        <p className="text-sm">{data.venueAddress}</p>
        <MapLink address={data.venueAddress} className="mt-3 inline-block rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2 text-sm text-white shadow" />
      </div>

      <div className="tk-rise relative mt-8" style={delay(1)}>
        <Countdown
          iso={data.weddingAt}
          boxClass="rounded-2xl bg-white/80 py-2 shadow-sm"
          numClass="font-serif text-2xl text-rose-600"
          labelClass="text-[10px] text-rose-400"
          pastClass="text-sm italic text-rose-500"
        />
      </div>

      <MusicControl track={data.music} className="relative mt-8 text-rose-600" />
    </section>
  );
}
