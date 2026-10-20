import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

const ADRAS =
  "bg-[repeating-linear-gradient(90deg,#c1272d_0_14px,#f2b705_14px_28px,#1b6ca8_28px_42px,#2e8b57_42px_56px,#fff7e6_56px_62px)]";

export default function National({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-[#fff7e6] text-[#1b2a6b]">
      <div className={`h-4 ${ADRAS}`} />
      <div className="px-6 py-10 text-center">
        <p aria-hidden className="text-lg tracking-[0.6em] text-[#c1272d]">◆ ◇ ◆ ◇ ◆</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em]">Taklifnoma</p>
        <p className="mt-1 text-sm">Aziz mehmonlar, to‘yimizga marhamat!</p>

        {data.photoUrl && (
          <Photo
            url={data.photoUrl}
            alt={`${data.groomName} va ${data.brideName}`}
            className="mx-auto mt-6 h-56 w-full max-w-[260px] rounded-2xl border-4 border-[#c1272d] shadow-md"
          />
        )}

        <h1 className="mt-6 text-4xl font-bold leading-tight">{data.groomName}</h1>
        <p aria-hidden className="my-1 text-2xl text-[#f2b705]">❖</p>
        <h1 className="text-4xl font-bold leading-tight">{data.brideName}</h1>

        {data.extraText && (
          <p className="mx-auto mt-6 max-w-xs whitespace-pre-line text-sm leading-relaxed">{data.extraText}</p>
        )}

        <div className="mt-8 rounded-2xl border-2 border-dashed border-[#1b6ca8] p-5">
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
          <MapLink address={data.venueAddress} className="mt-3 inline-block text-sm font-semibold text-[#c1272d] underline underline-offset-4" />
        </div>

        <div className="mt-8">
          <Countdown
            iso={data.weddingAt}
            boxClass="rounded-xl bg-[#1b2a6b] py-2 text-white"
            numClass="text-2xl font-bold text-[#f2b705]"
            labelClass="text-[10px] uppercase tracking-widest"
            pastClass="text-sm font-semibold"
          />
        </div>

        <MusicControl track={data.music} className="mt-8 text-[#1b2a6b]" />
        <p aria-hidden className="mt-8 text-lg tracking-[0.6em] text-[#2e8b57]">◆ ◇ ◆ ◇ ◆</p>
      </div>
      <div className={`h-4 ${ADRAS}`} />
    </section>
  );
}
