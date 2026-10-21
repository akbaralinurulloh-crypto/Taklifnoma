"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";

function useAction() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Amalni bajarib bo‘lmadi.");
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, run };
}

export function AdminLogin() {
  const [secret, setSecret] = useState("");
  const { busy, error, run } = useAction();
  return (
    <main className="mx-auto w-full max-w-sm flex-1 px-4 py-20">
      <h1 className="font-serif text-2xl text-ink">Admin panel</h1>
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => api("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret }) }));
        }}
      >
        <label className="block text-sm font-medium text-ink">
          Maxfiy kalit
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="current-password" className="mt-1 w-full rounded-lg border border-[#d3c3a0] px-3 py-2" />
        </label>
        {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy || !secret} className="mt-4 rounded-full bg-gold-dark px-6 py-2 text-sm text-white disabled:opacity-50">
          {busy ? "Tekshirilmoqda…" : "Kirish"}
        </button>
      </form>
    </main>
  );
}

export function LogoutButton() {
  const { busy, run } = useAction();
  return (
    <button type="button" disabled={busy} onClick={() => run(() => api("/api/admin/logout", { method: "POST" }))} className="text-sm underline">
      Chiqish
    </button>
  );
}

export function UnpublishButton({ id }: { id: string }) {
  const { busy, error, run } = useAction();
  return (
    <span>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (window.confirm("Taklifnoma nashrdan olinsinmi? Egasi uni qayta nashr qila olmaydi.")) {
            run(() => api(`/api/admin/invitations/${id}/unpublish`, { method: "POST" }));
          }
        }}
        className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-800 hover:bg-red-50 disabled:opacity-50"
      >
        Nashrdan olish
      </button>
      {error && <span role="alert" className="ml-2 text-xs text-red-700">{error}</span>}
    </span>
  );
}

export function MusicToggle({ id, active }: { id: string; active: boolean }) {
  const { busy, error, run } = useAction();
  return (
    <span>
      <button
        type="button"
        disabled={busy}
        onClick={() => run(() => api(`/api/admin/music/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ active: !active }) }))}
        className="rounded-full border border-[#d3c3a0] px-3 py-1 text-xs hover:bg-beige disabled:opacity-50"
      >
        {active ? "O‘chirib qo‘yish" : "Yoqish"}
      </button>
      {error && <span role="alert" className="ml-2 text-xs text-red-700">{error}</span>}
    </span>
  );
}

const AUDIO_EXT: Record<string, string> = { mp3: "mp3", ogg: "ogg", wav: "wav", m4a: "m4a", mp4: "m4a", aac: "m4a" };
const MAX_AUDIO = 15 * 1024 * 1024;

export function MusicUpload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [license, setLicense] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const { busy, error, run } = useAction();

  function pick(f: File | null) {
    setDone(null);
    setFile(f);
    if (f && !title.trim()) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 120));
  }

  async function upload() {
    if (!file) return;
    const ext = AUDIO_EXT[(file.name.split(".").pop() ?? "").toLowerCase()];
    if (!ext) throw new ApiError("Faqat MP3, OGG, WAV yoki M4A fayl qabul qilinadi.");
    if (file.size > MAX_AUDIO) throw new ApiError(`Fayl hajmi ${(file.size / 1048576).toFixed(1)} MB: 15 MB dan oshmasligi kerak.`);
    setDone(null);
    setStage("1/3: yuklash manzili olinmoqda…");
    const { path, uploadUrl } = await api<{ path: string; uploadUrl: string }>("/api/admin/music/sign", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ext }),
    });
    setStage(`2/3: fayl yuklanmoqda (${(file.size / 1048576).toFixed(1)} MB)…`);
    const fd = new FormData();
    fd.append("cacheControl", "3600");
    fd.append("", file);
    let res: Response;
    try {
      res = await fetch(uploadUrl, { method: "PUT", body: fd, headers: { "x-upsert": "false" } });
    } catch {
      throw new ApiError("Faylni omborga yuklab bo‘lmadi: internet aloqasi uzildi. Qayta urinib ko‘ring.");
    }
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new ApiError(`Faylni omborga yuklab bo‘lmadi (xato ${res.status}). ${t.slice(0, 160)}`);
    }
    setStage("3/3: fayl tekshirilmoqda…");
    await api("/api/admin/music/finish", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, path, licenseConfirmed: license }),
    });
    setDone(`“${title.trim()}” katalogga qo‘shildi va hozir foydalanishga tayyor.`);
    setTitle("");
    setFile(null);
    setLicense(false);
  }

  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-[#e6dcc6] bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          try {
            await upload();
          } finally {
            setStage(null);
          }
        });
      }}
    >
      <h3 className="text-sm font-medium text-ink">Yangi audio qo‘shish</h3>
      <label className="block text-sm">
        Fayl (MP3, OGG, WAV, M4A; 15 MB gacha)
        <input type="file" accept="audio/*,.mp3,.ogg,.wav,.m4a" onChange={(e) => pick(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
      </label>
      <label className="block text-sm">
        Nomi
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-[#d3c3a0] px-3 py-2" />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={license} onChange={(e) => setLicense(e.target.checked)} className="mt-1" />
        <span>Bu audio fayldan foydalanish uchun litsenziya/ruxsatim borligini tasdiqlayman.</span>
      </label>
      {stage && <p role="status" className="text-sm text-muted">{stage}</p>}
      {done && <p role="status" className="text-sm text-green-800">{done}</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy || !title.trim() || !file || !license} className="rounded-full bg-gold-dark px-5 py-2 text-sm text-white disabled:opacity-50">
        {busy ? "Yuklanmoqda…" : "Qo‘shish"}
      </button>
    </form>
  );
}
