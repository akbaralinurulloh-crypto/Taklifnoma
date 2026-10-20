"use client";

import { useEffect, useState } from "react";
import { InvitationView } from "@/components/InvitationView";
import { DESIGNS, DESIGN_LABELS, type Design } from "@/lib/schema";

const FRAME_W = 264; // telefon ichki kengligi
const SCALE = FRAME_W / 420;

/** Bosh sahifadagi jonli namuna: ismlarni yozsangiz, telefondagi taklifnoma o'sha zahoti o'zgaradi. */
export function HeroDemo({ children }: { children?: React.ReactNode }) {
  const [groom, setGroom] = useState("Aziz");
  const [bride, setBride] = useState("Madina");
  const [design, setDesign] = useState<Design>("classic");
  const [auto, setAuto] = useState(false);

  // Avtomatik almashish: faqat foydalanuvchi aralashmagan va animatsiyani cheklamagan bo'lsa.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setDesign((d) => DESIGNS[(DESIGNS.indexOf(d) + 1) % DESIGNS.length]), 6000);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (d: Design) => {
    setAuto(false);
    setDesign(d);
  };

  const data = {
    groomName: groom.trim() || "Aziz",
    brideName: bride.trim() || "Madina",
    weddingAt: "2030-06-12T13:00:00.000Z",
    venueName: "Registon to‘yxonasi",
    venueAddress: "Namangan sh., Navoiy ko‘chasi 12",
    extraText: "Sizni to‘yimizda ko‘rishdan baxtiyormiz.",
    photoUrl: null,
    design,
    music: null,
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
      <div>
        {children}
        <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
          <label className="block text-sm text-muted">
            Kuyovning ismi
            <input
              value={groom}
              maxLength={20}
              onChange={(e) => {
                setAuto(false);
                setGroom(e.target.value);
              }}
              className="mt-1 w-full rounded-lg border border-[#b7cdbf] bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-gold-dark focus:ring-2 focus:ring-gold/30"
            />
          </label>
          <label className="block text-sm text-muted">
            Kelinning ismi
            <input
              value={bride}
              maxLength={20}
              onChange={(e) => {
                setAuto(false);
                setBride(e.target.value);
              }}
              className="mt-1 w-full rounded-lg border border-[#b7cdbf] bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-gold-dark focus:ring-2 focus:ring-gold/30"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">Ismlarni o‘zgartiring: telefondagi taklifnoma darhol yangilanadi.</p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Dizaynni tanlang">
          {DESIGNS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={design === d}
              onClick={() => pick(d)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark ${
                design === d ? "border-ink bg-ink text-white" : "border-[#b7cdbf] bg-white text-ink hover:border-ink"
              }`}
            >
              {DESIGN_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto" aria-hidden>
        <div className="relative rounded-[2.6rem] bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgba(15,42,67,.45)]">
          <span className="absolute left-1/2 top-3.5 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
          <div className="relative h-[540px] overflow-hidden rounded-[2rem] bg-white" style={{ width: FRAME_W }}>
            <div key={design} className="absolute left-0 top-0 origin-top-left" style={{ width: 420, transform: `scale(${SCALE})` }}>
              <InvitationView data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
