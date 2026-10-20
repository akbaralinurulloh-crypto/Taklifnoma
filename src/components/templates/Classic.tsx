import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

export default function Classic({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] bg-[#fbf8f1] p-4 font-serif text-[#3b3328]">
      <div className="border border-[#b08d3c] p-1.5">
        <div className="border border-[#b08d3c]/60 px-6 py-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a6d26]">Nikoh to‘yiga taklif</p>
          <div aria-hidden className="mt-2 text-xl text-[#b08d3c]">❦</div>

          {data.photoUrl && (
            <Photo
              url={data.photoUrl}
              alt={`${data.groomName} va ${data.brideName}`}
              className="mx-auto mt-6 h-56 w-44 rounded-[50%] border-2 border-[#b08d3c] p-1"
            />
          )}

          <h1 className="mt-6 text-4xl leading-tight">{data.groomName}</h1>
          <p className="my-1 text-2xl italic text-[#b08d3c]">va</p>
          <h1 className="text-4xl leading-tight">{data.brideName}</h1>

          {data.extraText && (
            <p className="mx-auto mt-6 max-w-xs whitespace-pre-line text-sm italic leading-relaxed">{data.extraText}</p>
          )}

          <div className="mx-auto my-8 h-px w-24 bg-[#b08d3c]" />

          {when ? (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8a6d26]">{when.weekday}</p>
              <p className="mt-1 text-2xl">{when.date}</p>
              <p className="mt-1 text-lg">soat {when.time} da</p>
            </div>
          ) : (
            <p className="text-sm text-[#8a6d26]">To‘y sanasi kiritilmagan</p>
          )}

          <p className="mt-6 text-xl">{data.venueName}</p>
          <p className="mt-1 text-sm">{data.venueAddress}</p>
          <MapLink address={data.venueAddress} className="mt-4 inline-block text-sm text-[#8a6d26] underline underline-offset-4" />

          <div className="mt-8">
            <Countdown
              iso={data.weddingAt}
              boxClass="border border-[#b08d3c]/60 py-2"
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
