import type { PublicInvitation } from "@/lib/types";
import { dateParts } from "@/lib/format";
import { Countdown } from "./Countdown";
import { MusicControl } from "./MusicControl";
import { MapLink, Photo, delay, initials } from "./parts";

/** Ism harflaridan chiqariladigan bezak shtrix-kod (ma'lumot tashimaydi). */
function Barcode({ seed }: { seed: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    const c = seed.charCodeAt(i % Math.max(seed.length, 1)) || 65;
    const w = 1 + ((c + i * 3) % 4);
    bars.push({ x, w });
    x += w + 1 + ((c + i) % 2);
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} aria-hidden className="h-10 w-full" preserveAspectRatio="none">
      {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#1d1a16" />)}
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a8070]">{label}</p>
      <div className="mt-0.5 text-[#1d1a16]">{children}</div>
    </div>
  );
}

export default function Chipta({ data }: { data: PublicInvitation }) {
  const dp = dateParts(data.weddingAt);
  return (
    <section className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-[#ff5a36] px-5 py-10">
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ffb199]/50" />
      <div aria-hidden className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#c93a1b]/40" />

      <p className="tk-fade relative text-center font-mono text-[11px] uppercase tracking-[0.4em] text-white">To‘y chiptasi</p>

      <div className="tk-rise relative mt-5 rotate-[-1.2deg]" style={delay(0.2)}>
        {/* Asosiy qism */}
        <div className="rounded-t-2xl bg-[#fffaf0] px-6 pb-6 pt-6">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8070]">
            <span>Taklifnoma</span>
            <span className="tk-float">✦ ✦ ✦</span>
          </div>

          {data.photoUrl ? (
            <Photo url={data.photoUrl} alt={`${data.groomName} va ${data.brideName}`} className="mt-4 h-48 w-full rounded-lg" />
          ) : (
            <div aria-hidden className="mt-4 flex h-48 w-full items-center justify-center rounded-lg bg-[#ffe3d8] font-serif text-6xl font-bold text-[#ff5a36]">
              {initials(data.groomName, data.brideName)}
            </div>
          )}

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.02] tracking-tight text-[#1d1a16]">
            {data.groomName}
            <span className="block text-[#ff5a36]">&amp; {data.brideName}</span>
          </h1>

          {data.extraText && (
            <p className="mt-4 whitespace-pre-line border-l-4 border-[#ff5a36] pl-3 text-sm leading-relaxed text-[#1d1a16]">{data.extraText}</p>
          )}

          <div className="mt-5 border-t-2 border-dashed border-[#d9cfbb] pt-5">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Kun">{dp ? <span className="text-sm font-semibold capitalize">{dp.weekday}</span> : "—"}</Field>
              <Field label="Sana">{dp ? <span className="text-sm font-semibold">{dp.day} {dp.month} {dp.year}</span> : "Kiritilmagan"}</Field>
              <Field label="Vaqt">{dp ? <span className="text-sm font-semibold">{dp.time}</span> : "Kiritilmagan"}</Field>
            </div>
            <div className="mt-4">
              <Field label="Manzil">
                <p className="font-semibold">{data.venueName}</p>
                <p className="text-sm text-[#4a4237]">{data.venueAddress}</p>
              </Field>
            </div>
          </div>
        </div>

        {/* Teshikli chiziq */}
        <div aria-hidden className="relative h-0 bg-[#fffaf0]">
          <div className="absolute inset-x-5 top-0 border-t-2 border-dashed border-[#c9bda5]" />
          <span className="absolute -left-3.5 -top-3.5 h-7 w-7 rounded-full bg-[#ff5a36]" />
          <span className="absolute -right-3.5 -top-3.5 h-7 w-7 rounded-full bg-[#ff5a36]" />
        </div>

        {/* Yirtiladigan qism */}
        <div className="rounded-b-2xl bg-[#fffaf0] px-6 pb-6 pt-8">
          <Countdown
            iso={data.weddingAt}
            boxClass="rounded-md border-2 border-[#1d1a16] py-1.5"
            numClass="font-mono text-2xl font-bold text-[#1d1a16]"
            labelClass="font-mono text-[9px] uppercase tracking-widest text-[#8a8070]"
            pastClass="font-mono text-sm text-[#8a8070]"
          />
          <div className="mt-5 flex items-center gap-3">
            <div className="w-full"><Barcode seed={`${data.groomName}${data.brideName}`} /></div>
          </div>
          <MapLink address={data.venueAddress} className="mt-4 block rounded-md bg-[#1d1a16] py-2.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5" />
        </div>
      </div>

      <MusicControl track={data.music} className="relative mt-8 text-white" />
    </section>
  );
}
