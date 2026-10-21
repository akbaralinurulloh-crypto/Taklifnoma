"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { dict, type Lang } from "@/lib/i18n";

const field = "mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-[18px] iv-line";
const btn = "iv-accent-bg rounded-full px-6 py-2.5 text-[16px] tracking-wide disabled:opacity-50";

/** Mehmon javobi (RSVP): haqiqiy so'rov serverga ketadi, muvaffaqiyat faqat server tasdiqlagandan keyin ko'rsatiladi. */
export function RsvpBox({ slug, lang, initialName = "" }: { slug: string; lang: Lang; initialName?: string }) {
  const d = dict(lang).rsvp;
  const [name, setName] = useState(initialName);
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"yes" | "no" | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || !response) return setError(d.need);
    setBusy(true);
    setError(null);
    try {
      await api(`/api/rsvp/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ guestName: name, response, guests }),
      });
      setDone(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : d.fail);
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p role="status" className="f-body mt-4 text-[21px]">{done === "yes" ? d.thanksYes : d.thanksNo}</p>;

  return (
    <form onSubmit={submit} className="mx-auto mt-5 max-w-[340px] text-left">
      <label className="block text-[16px]">
        {d.name}
        <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </label>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
        <label className="flex items-center gap-2"><input type="radio" name="rsvp" checked={response === "yes"} onChange={() => setResponse("yes")} /> {d.yes}</label>
        <label className="flex items-center gap-2"><input type="radio" name="rsvp" checked={response === "no"} onChange={() => setResponse("no")} /> {d.no}</label>
      </div>
      {response === "yes" && (
        <label className="mt-4 block text-[16px]">
          {d.guests}
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={field}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
      {error && <p role="alert" className="mt-3 text-[16px] text-red-600">{error}</p>}
      <div className="mt-5 text-center"><button type="submit" disabled={busy} className={btn}>{busy ? d.sending : d.send}</button></div>
    </form>
  );
}

type Wish = { guestName: string; message: string; createdAt: string };

/** Tilaklar kitobi: ro'yxat serverdan o'qiladi, yangi tilak serverga yoziladi va ro'yxat qayta yuklanadi. */
export function WishesBox({ slug, lang, initialName = "" }: { slug: string; lang: Lang; initialName?: string }) {
  const d = dict(lang).wish;
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api<{ wishes: Wish[] }>(`/api/wishes/${slug}`);
      setWishes(r.wishes);
      setLoadErr(false);
    } catch {
      setLoadErr(true);
    }
  }, [slug]);

  useEffect(() => {
    const id = setTimeout(load, 0);
    return () => clearTimeout(id);
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || !message.trim()) return setError(d.need);
    setBusy(true);
    setError(null);
    try {
      await api(`/api/wishes/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ guestName: name, message }),
      });
      setSent(true);
      setMessage("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : d.fail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="mx-auto mt-5 max-w-[340px] text-left">
        <label className="block text-[16px]">
          {d.name}
          <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
        </label>
        <label className="mt-3 block text-[16px]">
          {d.text}
          <textarea value={message} maxLength={300} rows={3} onChange={(e) => setMessage(e.target.value)} className={field} />
        </label>
        {error && <p role="alert" className="mt-3 text-[16px] text-red-600">{error}</p>}
        {sent && !error && <p role="status" className="mt-3 text-[16px]">{d.thanks}</p>}
        <div className="mt-4 text-center"><button type="submit" disabled={busy} className={btn}>{busy ? d.sending : d.send}</button></div>
      </form>
      <div className="mt-6 text-left">
        {loadErr && <p role="alert" className="text-center text-[16px]">{d.loadFail}</p>}
        {wishes && wishes.length === 0 && <p className="text-center text-[16px] iv-muted">{d.empty}</p>}
        {wishes && wishes.length > 0 && (
          <>
            <p className="mb-2 text-center text-[13.5px] uppercase tracking-[0.2em] iv-muted">{d.count(wishes.length)}</p>
            <ul className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {wishes.map((w) => (
                <li key={w.guestName + w.createdAt + w.message} className="rounded-xl border px-4 py-3 iv-line">
                  <p className="f-display text-[16px] iv-accent break-words">{w.guestName}</p>
                  <p className="f-body mt-1 whitespace-pre-line break-words text-[20px] leading-snug">{w.message}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
