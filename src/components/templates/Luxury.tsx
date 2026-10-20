import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

const GOLD_TEXT = "bg-gradient-to-b from-[#f5e1a4] via-[#d9b65d] to-[#a47e2c] bg-clip-text text-transparent";

export default function Luxury({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-[#14110d] p-4 text-[#e9dcc0]">
      <div className="border border-[#a47e2c] p-1">
        <div className="relative border border-[#a47e2c]/50 px-6 py-12 text-center">
          <span aria-hidden className="absolute left-3 top-3 h-6 w-6 border-l border-t border-[#d9b65d]" />
          <span aria-hidden className="absolute right-3 top-3 h-6 w-6 border-r border-t border-[#d9b65d]" />
          <span aria-hidden className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-[#d9b65d]" />
          <span aria-hidden className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-[#d9b65d]" />

          <p className="text-[10px] uppercase tracking-[0.5em] text-[#d9b65d]">Hashamatli to‘y marosimi</p>

          {data.photoUrl && (
            <Photo
              url={data.photoUrl}
              alt={`${data.groomName} va ${data.brideName}`}
              className="mx-auto mt-8 h-64 w-44 rounded-t-full border border-[#d9b65d] p-1.5"
            />
          )}

          <h1 className={`mt-8 font-serif text-4xl uppercase leading-tight tracking-[0.12em] ${GOLD_TEXT}`}>
            {data.groomName}
          </h1>
          <div aria-hidden className="mx-auto my-3 flex items-center justify-center gap-3 text-[#d9b65d]">
            <span className="h-px w-12 bg-[#d9b65d]/60" />
            <span>&amp;</span>
            <span className="h-px w-12 bg-[#d9b65d]/60" />
          </div>
          <h1 className={`font-serif text-4xl uppercase leading-tight tracking-[0.12em] ${GOLD_TEXT}`}>
            {data.brideName}
          </h1>

          {data.extraText && (
            <p className="mx-auto mt-8 max-w-xs whitespace-pre-line text-sm leading-relaxed text-[#cdbf9f]">
              {data.extraText}
            </p>
          )}

          <div className="mt-10">
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

          <div className="mt-8">
            <p className="font-serif text-xl tracking-wide">{data.venueName}</p>
            <p className="mt-1 text-sm text-[#cdbf9f]">{data.venueAddress}</p>
            <MapLink address={data.venueAddress} className="mt-4 inline-block border border-[#d9b65d] px-5 py-2 text-xs uppercase tracking-[0.25em] text-[#d9b65d]" />
          </div>

          <div className="mt-10">
            <Countdown
              iso={data.weddingAt}
              boxClass="border border-[#a47e2c]/60 py-2"
              numClass="font-serif text-2xl text-[#f5e1a4]"
              labelClass="text-[10px] uppercase tracking-widest text-[#d9b65d]"
              pastClass="text-sm italic text-[#d9b65d]"
            />
          </div>

          <MusicControl track={data.music} className="mt-8 text-[#d9b65d]" />
        </div>
      </div>
    </section>
  );
}
