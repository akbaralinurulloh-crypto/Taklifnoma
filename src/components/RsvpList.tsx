"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/client-api";

type Rsvp = { guestName: string; response: "yes" | "no"; guests: number; createdAt: string };
type Wish = { guestName: string; message: string; createdAt: string };

/** Taklifnoma egasi uchun: faqat tahrirlash tokeni bilan ko'rinadi. */
export function RsvpList({ token }: { token: string }) {
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wishes, setWishes] = useState<Wish[] | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const d = await api<{ rsvps: Rsvp[] }>(`/api/edit/${token}/rsvps`);
      setRsvps(d.rsvps);
      const w = await api<{ wishes: Wish[] }>(`/api/edit/${token}/wishes`);
      setWishes(w.wishes);
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
  const people = rsvps?.filter((r) => r.response === "yes").reduce((n, r) => n + (r.guests ?? 1), 0) ?? 0;

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
          <p className="mt-2 text-sm text-muted">Kelaman: {yes} ta javob (jami {people} kishi) · Kela olmayman: {no}</p>
          <ul className="mt-3 divide-y divide-[#cfe0d5] rounded-xl border border-[#cfe0d5] bg-white">
            {rsvps.map((r) => (
              <li key={r.guestName + r.createdAt} className="flex justify-between px-4 py-2 text-sm">
                <span>{r.guestName}</span>
                <span className={r.response === "yes" ? "text-green-800" : "text-red-800"}>
                  {r.response === "yes" ? `Kelaman (${r.guests ?? 1} kishi)` : "Kela olmayman"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      <h2 className="mt-8 font-serif text-xl text-ink">Tilaklar kitobi</h2>
      {wishes && wishes.length === 0 && <p className="mt-2 text-sm text-muted">Hozircha tilaklar yo‘q.</p>}
      {wishes && wishes.length > 0 && (
        <ul className="mt-3 divide-y divide-[#cfe0d5] rounded-xl border border-[#cfe0d5] bg-white">
          {wishes.map((w) => (
            <li key={w.guestName + w.createdAt + w.message} className="px-4 py-3 text-sm">
              <p className="font-medium">{w.guestName}</p>
              <p className="mt-1 whitespace-pre-line break-words text-muted">{w.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
