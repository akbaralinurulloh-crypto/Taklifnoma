"use client";

import { useEffect, useRef, useState } from "react";
import { GuestLinks, QrCard } from "./ShareTools";

function isLocalHost(url: string): boolean {
  try {
    const h = new URL(url).hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".local");
  } catch {
    return false;
  }
}

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState<"ok" | "manual" | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied("ok");
    } catch {
      // Clipboard API ishlamasa: matn belgilanadi, foydalanuvchi qo'lda nusxalaydi
      input.current?.focus();
      input.current?.select();
      setCopied("manual");
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        <input ref={input} readOnly value={value} onFocus={(e) => e.currentTarget.select()} className="mt-1 w-full rounded-lg border border-[#b7cdbf] bg-white px-3 py-2 text-sm" />
      </label>
      <button type="button" onClick={copy} className="mt-2 rounded-full border border-gold-dark px-4 py-1.5 text-sm text-gold-dark hover:bg-beige">
        Nusxalash
      </button>
      {copied === "ok" && <span role="status" className="ml-3 text-sm text-green-800">Nusxalandi</span>}
      {copied === "manual" && (
        <span role="status" className="ml-3 text-sm text-amber-900">Avtomatik nusxalab bo‘lmadi: matn belgilandi, qo‘lda nusxalang (Ctrl+C / “Nusxalash”).</span>
      )}
    </div>
  );
}

export function PublishedPanel({ url, editUrl, title }: { url: string; editUrl: string; title: string }) {
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"), 0);
    return () => clearTimeout(id);
  }, []);

  const text = `${title} to‘yiga taklifnoma`;
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[#cfe0d5] bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl text-ink">Taklifnoma nashr qilindi</h2>
      <p className="mt-1 text-sm text-muted">Ma’lumotlar serverda saqlandi va qayta o‘qib tasdiqlandi.</p>

      {isLocalHost(url) && (
        <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Diqqat: bu havola faqat shu kompyuterda (lokal) ochiladi. Mehmonlar uchun sayt internetga joylashtirilgach
          (Vercel va domen) haqiqiy havola paydo bo‘ladi.
        </p>
      )}

      <div className="mt-6 space-y-5">
        <CopyField label="Mehmonlar uchun havola" value={url} />
        <div className="flex flex-wrap gap-3">
          <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold-dark px-5 py-2 text-sm font-medium text-white hover:bg-gold">
            Taklifnomani ko‘rish
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
            target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-[#b7cdbf] px-5 py-2 text-sm hover:bg-beige"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
            target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-[#b7cdbf] px-5 py-2 text-sm hover:bg-beige"
          >
            Telegram
          </a>
          {canShare && (
            <button
              type="button"
              onClick={() => navigator.share({ title: text, url }).catch(() => undefined)}
              className="rounded-full border border-[#b7cdbf] px-5 py-2 text-sm hover:bg-beige"
            >
              Boshqa ilova orqali
            </button>
          )}
        </div>

        <QrCard url={url} />
        <GuestLinks url={url} title={text} />

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">Maxfiy tahrirlash havolasi: uni saqlab qo‘ying</p>
          <p className="mt-1 text-xs text-red-900">
            Taklifnomani keyinroq o‘zgartirish yoki o‘chirish faqat shu havola orqali mumkin. U qayta tiklanmaydi va
            mehmonlarga yuborilmasligi kerak.
          </p>
          <div className="mt-3">
            <CopyField label="Tahrirlash havolasi" value={editUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
