"use client";

import { useState } from "react";

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Mehmon uchun: taqvimga qo'shish (.ics fayl) va havolani ulashish. */
export function GuestActions({ title, weddingAt, location, url }: { title: string; weddingAt: string; location: string; url: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  function downloadIcs() {
    const start = new Date(weddingAt);
    const end = new Date(start.getTime() + 4 * 3600 * 1000); // davomiyligi taxminiy: 4 soat
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Taklifnoma//UZ",
      "BEGIN:VEVENT",
      `UID:${stamp(start)}-${Math.abs(hash(title))}@taklifnoma`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${icsEscape(title)}`,
      `LOCATION:${icsEscape(location)}`,
      `URL:${url}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = "toy-taklifnomasi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setMsg("Taqvim fayli yuklandi. Uni ochsangiz, tadbir taqvimingizga qo‘shiladi.");
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMsg("Havola nusxalandi.");
    } catch {
      setMsg("Ulashib bo‘lmadi. Havolani brauzer manzil satridan nusxalang.");
    }
  }

  const btn =
    "rounded-full border border-[#b7cdbf] bg-white px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark";
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={downloadIcs} className={btn}>Taqvimga qo‘shish</button>
        <button type="button" onClick={share} className={btn}>Havolani ulashish</button>
      </div>
      {msg && <p role="status" className="mt-2 text-xs text-muted">{msg}</p>}
    </div>
  );
}
