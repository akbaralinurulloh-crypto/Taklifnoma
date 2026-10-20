"use client";

import { useEffect, useState } from "react";
import { countdownTo } from "@/lib/schema";

type Props = {
  iso: string | null;
  boxClass?: string;
  numClass?: string;
  labelClass?: string;
  pastClass?: string;
};

/** To'ygacha qolgan vaqt. Haqiqiy joriy vaqtga bog'liq; server/brauzer farqini oldini olish uchun faqat brauzerda hisoblanadi. */
export function Countdown({ iso, boxClass = "", numClass = "", labelClass = "", pastClass = "" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [iso]);

  if (!iso) return null;

  const c = now ? countdownTo(iso, now) : null;
  if (c?.state === "past") {
    return <p className={pastClass}>To‘y marosimi boshlangan yoki o‘tib ketgan</p>;
  }

  const items = [
    { v: c?.days, l: "kun" },
    { v: c?.hours, l: "soat" },
    { v: c?.minutes, l: "daqiqa" },
    { v: c?.seconds, l: "soniya" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-label="To‘ygacha qolgan vaqt">
      {items.map((it) => (
        <div key={it.l} className={`text-center ${boxClass}`}>
          <div className={`tabular-nums ${numClass}`}>
            {it.v === undefined ? "–" : String(it.v).padStart(2, "0")}
          </div>
          <div className={labelClass}>{it.l}</div>
        </div>
      ))}
    </div>
  );
}
