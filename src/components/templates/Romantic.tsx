import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

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

export default function Romantic({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 px-6 py-12 text-center text-rose-900">
      <Flower className="absolute -left-6 -top-6 h-28 w-28 opacity-80" />
      <Flower className="absolute -right-8 top-24 h-24 w-24 opacity-60" />
      <Flower className="absolute -bottom-8 -left-8 h-32 w-32 opacity-70" />

      <p className="relative font-serif text-sm italic text-rose-500">Sevgi bilan taklif qilamiz</p>

      {data.photoUrl ? (
        <Photo
          url={data.photoUrl}
          alt={`${data.groomName} va ${data.brideName}`}
          className="relative mx-auto mt-6 h-56 w-56 rounded-full ring-8 ring-white shadow-lg"
        />
      ) : (
        <div aria-hidden className="relative mx-auto mt-6 flex h-56 w-56 items-center justify-center rounded-full bg-white/70 font-serif text-5xl text-rose-300 ring-8 ring-white">
          {data.groomName.charAt(0)}&amp;{data.brideName.charAt(0)}
        </div>
      )}

      <h1 className="relative mt-8 font-serif text-5xl italic leading-tight text-rose-700">
        {data.groomName}
        <span className="block text-3xl text-rose-400">&amp;</span>
        {data.brideName}
      </h1>

      {data.extraText && (
        <p className="relative mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed">{data.extraText}</p>
      )}

      <div className="relative mx-auto mt-8 rounded-3xl bg-white/70 p-6 shadow-sm">
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
        <MapLink address={data.venueAddress} className="mt-3 inline-block rounded-full bg-rose-500 px-5 py-2 text-sm text-white" />
      </div>

      <div className="relative mt-8">
        <Countdown
          iso={data.weddingAt}
          boxClass="rounded-2xl bg-white/80 py-2"
          numClass="font-serif text-2xl text-rose-600"
          labelClass="text-[10px] text-rose-400"
          pastClass="text-sm italic text-rose-500"
        />
      </div>

      <MusicControl track={data.music} className="relative mt-8 text-rose-600" />
    </section>
  );
}
