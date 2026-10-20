import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

export default function Minimalist({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-white px-8 py-16 text-neutral-900">
      <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">To‘y taklifnomasi</p>

      <h1 className="mt-12 text-3xl font-light leading-snug tracking-wide">
        {data.groomName}
        <span className="mx-2 text-neutral-400">+</span>
        <br />
        {data.brideName}
      </h1>

      {data.photoUrl && (
        <Photo
          url={data.photoUrl}
          alt={`${data.groomName} va ${data.brideName}`}
          className="mt-12 aspect-[4/5] w-full"
        />
      )}

      {data.extraText && (
        <p className="mt-12 whitespace-pre-line text-sm leading-loose text-neutral-700">{data.extraText}</p>
      )}

      <div className="mt-16 h-px bg-neutral-300" />

      <dl className="mt-8 space-y-6 text-sm">
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
            <MapLink address={data.venueAddress} className="mt-2 inline-block underline underline-offset-4" />
          </dd>
        </div>
      </dl>

      <div className="mt-12 h-px bg-neutral-300" />

      <div className="mt-8">
        <Countdown
          iso={data.weddingAt}
          numClass="text-2xl font-light"
          labelClass="text-[10px] uppercase tracking-widest text-neutral-500"
          pastClass="text-sm text-neutral-500"
        />
      </div>

      <MusicControl track={data.music} className="mt-10 items-start text-neutral-800" />
    </section>
  );
}
