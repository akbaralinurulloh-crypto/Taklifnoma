import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

export default function Minimalist({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  const day = when ? when.date.split("-")[0].trim().slice(0, 2) : "";
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-white px-8 py-16 text-neutral-900">
      <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-10 -top-10 h-56 w-56 text-neutral-200" fill="none" stroke="currentColor" strokeWidth=".4">
        <circle className="tk-draw" style={{ ["--len" as string]: 320 }} cx="50" cy="50" r="48" />
        <circle className="tk-draw" style={{ ["--len" as string]: 260, ...delay(0.4) } as React.CSSProperties} cx="50" cy="50" r="38" />
        <circle className="tk-draw" style={{ ["--len" as string]: 200, ...delay(0.8) } as React.CSSProperties} cx="50" cy="50" r="28" />
      </svg>

      <p className="tk-fade relative text-[11px] uppercase tracking-[0.4em] text-neutral-500">To‘y taklifnomasi</p>
      <div className="tk-line mt-4 h-px w-16 bg-neutral-900" style={delay(0.3)} />

      <h1 className="tk-rise relative mt-12 text-4xl font-extralight leading-snug tracking-wide" style={delay(0.4)}>
        {data.groomName}
        <span className="mx-2 text-neutral-400">+</span>
        <br />
        {data.brideName}
      </h1>

      {data.photoUrl ? (
        <Photo
          url={data.photoUrl}
          alt={`${data.groomName} va ${data.brideName}`}
          className="tk-fade mt-12 aspect-[4/5] w-full grayscale-[25%]"
        />
      ) : (
        <div aria-hidden className="tk-fade mt-12 flex aspect-[4/5] w-full items-center justify-center bg-neutral-100 text-6xl font-extralight text-neutral-300" style={delay(0.6)}>
          {initials(data.groomName, data.brideName)}
        </div>
      )}

      {when && (
        <p aria-hidden className="tk-rise mt-10 text-[96px] font-extralight leading-none tracking-tighter text-neutral-900" style={delay(0.7)}>
          {day}
        </p>
      )}

      {data.extraText && (
        <p className="tk-rise mt-10 whitespace-pre-line text-sm leading-loose text-neutral-700" style={delay(0.8)}>{data.extraText}</p>
      )}

      <div className="tk-line mt-14 h-px bg-neutral-300" style={delay(0.9)} />

      <dl className="tk-rise mt-8 space-y-6 text-sm" style={delay(1)}>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Sana</dt>
          <dd className="mt-1 text-lg">{when ? `${when.date}, ${when.weekday}` : "Kiritilmagan"}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Vaqt</dt>
          <dd className="mt-1 text-lg">{when ? when.time : "Kiritilmagan"}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">Manzil</dt>
          <dd className="mt-1 text-lg">{data.venueName}</dd>
          <dd className="mt-1 text-neutral-600">{data.venueAddress}</dd>
          <dd>
            <MapLink address={data.venueAddress} className="mt-2 inline-block border-b border-neutral-900 pb-0.5" />
          </dd>
        </div>
      </dl>

      <div className="tk-line mt-12 h-px bg-neutral-300" style={delay(1.1)} />

      <div className="tk-rise mt-8" style={delay(1.2)}>
        <Countdown
          iso={data.weddingAt}
          numClass="text-3xl font-extralight"
          labelClass="text-[10px] uppercase tracking-widest text-neutral-500"
          pastClass="text-sm text-neutral-500"
        />
      </div>

      <MusicControl track={data.music} className="mt-10 items-start text-neutral-800" />
    </section>
  );
}
