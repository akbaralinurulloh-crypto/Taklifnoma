import type { PublicInvitation } from "@/lib/types";
import { whenText } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo } from "./parts";

export default function Modern({ data }: { data: PublicInvitation }) {
  const when = whenText(data.weddingAt);
  return (
    <section className="mx-auto w-full max-w-[420px] overflow-hidden bg-[#f2efe9] px-5 py-10 text-[#111]">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em]">
        <span>Taklif</span>
        <span className="text-[#ff4f2b]">{when ? when.date.split(",")[1]?.trim().replace("-yil", "") : "—"}</span>
      </div>

      <h1 className="mt-6 break-words text-[56px] font-black uppercase leading-[0.9] tracking-tight">
        {data.groomName}
        <span className="block text-[#ff4f2b]">&amp;</span>
        {data.brideName}
      </h1>

      {data.photoUrl && (
        <Photo
          url={data.photoUrl}
          alt={`${data.groomName} va ${data.brideName}`}
          className="mt-8 h-72 w-full -rotate-2 border-4 border-[#111] shadow-[8px_8px_0_#ff4f2b]"
        />
      )}

      {data.extraText && (
        <p className="mt-8 whitespace-pre-line border-l-4 border-[#ff4f2b] pl-4 text-sm font-medium leading-relaxed">
          {data.extraText}
        </p>
      )}

      <div className="mt-10 bg-[#111] p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4f2b]">
          {when ? when.weekday : "Sana"}
        </p>
        <p className="mt-1 text-3xl font-black uppercase leading-tight">{when ? when.date : "Kiritilmagan"}</p>
        <p className="mt-1 text-xl font-bold">{when ? `soat ${when.time}` : ""}</p>
        <div className="my-5 h-px bg-white/30" />
        <p className="text-xl font-bold">{data.venueName}</p>
        <p className="text-sm text-white/80">{data.venueAddress}</p>
        <MapLink address={data.venueAddress} className="mt-4 inline-block bg-[#ff4f2b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white" />
      </div>

      <div className="mt-8">
        <Countdown
          iso={data.weddingAt}
          boxClass="border-2 border-[#111] py-2"
          numClass="text-3xl font-black"
          labelClass="text-[10px] font-bold uppercase tracking-widest"
          pastClass="text-sm font-bold uppercase"
        />
      </div>

      <MusicControl track={data.music} className="mt-8 text-[#111]" />
    </section>
  );
}
