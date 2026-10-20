"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/client-api";

type Rsvp = { guestName: string; response: "yes" | "no"; createdAt: string };

/** Taklifnoma egasi uchun: faqat tahrirlash tokeni bilan ko'rinadi. */
export function RsvpList({ token }: { token: string }) {
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const d = await api<{ rsvps: Rsvp[] }>(`/api/edit/${token}/rsvps`);
      setRsvps(d.rsvps);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Javoblarni yuklab bo‘lmadi.");
    }
  }, [token]);

  useEffect(() => {
    const id = setTimeout(load, 0);
    return () => clearTimeout(id);
  }, [load]);

  const yes = rsvps?.filter((r) => r.response === "yes").length ?? 0;
  const no = rsvps?.filter((r) => r.response === "no").length ?? 0;

  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4 pb-10" aria-labelledby="rsvp-title">
      <h2 id="rsvp-title" className="font-serif text-xl text-ink">Mehmonlar javoblari</h2>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}{" "}
          <button type="button" onClick={load} className="underline">Qayta urinish</button>
        </p>
      )}
      {!error && rsvps === null && <p className="mt-2 text-sm text-muted">Yuklanmoqda…</p>}
      {rsvps && rsvps.length === 0 && <p className="mt-2 text-sm text-muted">Hozircha javoblar yo‘q.</p>}
      {rsvps && rsvps.length > 0 && (
        <>
          <p className="mt-2 text-sm text-muted">Kelaman: {yes} · Kela olmayman: {no}</p>
          <ul className="mt-3 divide-y divide-[#cfdcd9] rounded-xl border border-[#cfdcd9] bg-white">
            {rsvps.map((r) => (
              <li key={r.guestName + r.createdAt} className="flex justify-between px-4 py-2 text-sm">
                <span>{r.guestName}</span>
                <span className={r.response === "yes" ? "text-green-800" : "text-red-800"}>
                  {r.response === "yes" ? "Kelaman" : "Kela olmayman"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
