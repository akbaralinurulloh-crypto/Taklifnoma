"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { CopyField } from "./ShareLinks";

/** Sayt manzili sozlanmagan bo'lsa (nisbiy havola), brauzerning haqiqiy manzili ishlatiladi. */
function useAbsolute(url: string): string {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setOrigin(window.location.origin), 0);
    return () => clearTimeout(id);
  }, []);
  return url.startsWith("/") ? (origin ? origin + url : "") : url;
}

/** Taklifnoma havolasi uchun QR-kod (brauzerda yaratiladi). PNG sifatida yuklab olinadi, bosib chiqarish mumkin. */
export function QrCard({ url: rawUrl }: { url: string }) {
  const url = useAbsolute(rawUrl);
  const [png, setPng] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    QRCode.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: "M" })
      .then((d) => alive && setPng(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <div>
      <p className="text-sm font-medium text-ink">QR-kod</p>
      <p className="mt-1 text-xs text-muted">Chop etilgan taklifnoma yoki stol kartasiga qo‘ying: telefon kamerasi bilan skanerlansa, taklifnoma ochiladi.</p>
      {failed && <p role="alert" className="mt-2 text-sm text-red-700">QR-kodni yaratib bo‘lmadi.</p>}
      {png && (
        <div className="mt-3 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={png} alt="Taklifnoma havolasi QR-kodi" width={160} height={160} className="rounded-lg border border-[#e6dcc6]" />
          <a href={png} download="taklifnoma-qr.png" className="rounded-full border border-gold-dark px-4 py-1.5 text-sm text-gold-dark hover:bg-beige">
            PNG yuklab olish
          </a>
        </div>
      )}
    </div>
  );
}

export function guestUrl(base: string, name: string, lang?: "ru"): string {
  const q = new URLSearchParams({ mehmon: name.trim() });
  if (lang) q.set("lang", lang);
  return `${base}?${q.toString()}`;
}

/** Har bir mehmon uchun shaxsiy havola: ochilganda ism bilan murojaat qilinadi va forma ismi to'ldirilgan bo'ladi. */
export function GuestLinks({ url: rawUrl, title }: { url: string; title: string }) {
  const url = useAbsolute(rawUrl);
  const [text, setText] = useState("");
  const [ru, setRu] = useState(false);
  const names = Array.from(new Set(text.split("\n").map((n) => n.trim().slice(0, 80)).filter(Boolean))).slice(0, 100);

  return (
    <div>
      <p className="text-sm font-medium text-ink">Mehmonlar uchun shaxsiy havolalar</p>
      <p className="mt-1 text-xs text-muted">Har qatorga bitta mehmon ismini yozing. Har biriga alohida havola hosil bo‘ladi: u ochilganda “Hurmatli {"{ism}"}!” deb murojaat qilinadi.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={"Anvar aka\nGulnora xola"}
        aria-label="Mehmonlar ismlari"
        className="mt-3 w-full rounded-lg border border-[#d3c3a0] px-3 py-2 text-sm"
      />
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={ru} onChange={(e) => setRu(e.target.checked)} /> Havola rus tilida ochilsin
      </label>
      {url && names.length > 0 && (
        <ul className="mt-3 space-y-3">
          {names.map((n) => {
            const link = guestUrl(url, n, ru ? "ru" : undefined);
            return (
              <li key={n} className="rounded-lg border border-[#e6dcc6] p-3">
                <CopyField label={n} value={link} />
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${title} ${link}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-gold-dark underline"
                >
                  WhatsApp orqali yuborish
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
