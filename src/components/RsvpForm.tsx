"use client";

import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";

/** Mehmon kelishini tasdiqlaydi. Javob serverda saqlanadi; mehmonlar ro'yxati ommaviy ko'rinmaydi. */
export function RsvpForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"yes" | "no" | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || !response) {
      setError("Ismingizni kiriting va javobni tanlang.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api(`/api/rsvp/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ guestName: name, response }),
      });
      setDone(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Javobni yuborib bo‘lmadi. Qayta urinib ko‘ring.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="mx-auto max-w-[420px] rounded-xl bg-green-50 p-4 text-center text-sm text-green-900">
        {done === "yes" ? "Rahmat! Kelishingizni tasdiqladingiz." : "Javobingiz uchun rahmat. Afsuski, kela olmasligingiz yozib olindi."}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[420px] rounded-xl border border-[#cfe0d5] bg-white p-5 text-ink">
      <h2 className="font-serif text-lg">Kelishingizni tasdiqlang</h2>
      <label className="mt-3 block text-sm">
        Ismingiz
        <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-[#b7cdbf] px-3 py-2" autoComplete="name" />
      </label>
      <div className="mt-3 flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" name="rsvp" checked={response === "yes"} onChange={() => setResponse("yes")} /> Kelaman
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="rsvp" checked={response === "no"} onChange={() => setResponse("no")} /> Kela olmayman
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="mt-4 rounded-full bg-gold-dark px-5 py-2 text-sm text-white disabled:opacity-50">
        {busy ? "Yuborilmoqda…" : "Yuborish"}
      </button>
    </form>
  );
}
