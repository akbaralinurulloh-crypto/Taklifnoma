"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALLOWED_PHOTO_TYPES,
  DESIGNS,
  DESIGN_DESCRIPTIONS,
  DESIGN_LABELS,
  MAX_PHOTO_BYTES,
  invitationInputSchema,
  tashkentToIso,
  type Design,
} from "@/lib/schema";
import type { PublicInvitation } from "@/lib/types";
import { ApiError, api, randomToken } from "@/lib/client-api";
import { InvitationView } from "@/components/InvitationView";
import { PhonePreview } from "@/components/site/PhonePreview";
import { PublishedPanel } from "./ShareLinks";

export type Track = { id: string; title: string; url: string };

export type Form = {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  extraText: string;
  parents: string;
  dressCode: string;
  program: { time: string; title: string }[];
  design: Design;
  musicId: string | null;
};

export type WizardProps = {
  tracks: Track[];
  backendConfigured: boolean;
  siteUrl: string;
  mode?: "create" | "edit";
  initial?: { form: Form; photoUrl: string | null; slug: string; gallery?: { path: string; url: string }[] };
  editToken?: string;
  /** /create?dizayn=... orqali kelgan dizayn: qoralamadagi dizaynni bosib o'tadi. */
  initialDesign?: Design;
};

const EMPTY: Form = {
  groomName: "",
  brideName: "",
  date: "",
  time: "",
  venueName: "",
  venueAddress: "",
  extraText: "",
  parents: "",
  dressCode: "",
  program: [],
  design: "osmon",
  musicId: null,
};

const DRAFT_KEY = "taklifnoma:draft:v1";
const STEPS = ["Ma’lumotlar", "Rasm", "Dizayn", "Musiqa", "Ko‘rinish", "Saqlash"] as const;
const STEP1_FIELDS = ["groomName", "brideName", "date", "time", "venueName", "venueAddress", "extraText", "parents", "dressCode", "program"] as const;

/** Bo'sh qatorlar tashlab yuboriladi. */
const cleanProgram = (rows: Form["program"]) => rows.filter((r) => r.time.trim() || r.title.trim()).map((r) => ({ time: r.time.trim(), title: r.title.trim() }));

type Photo = { previewUrl: string; name: string; file?: File };
type GalleryItem = { key: string; previewUrl: string; path?: string; file?: File };
const MAX_GALLERY = 6;

const inputCls =
  "mt-1 w-full rounded-lg border border-[#b7cdbf] bg-white px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      {children}
      {hint && !error && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-xs font-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

export function CreateWizard({ tracks, backendConfigured, siteUrl, mode = "create", initial, editToken, initialDesign }: WizardProps) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState<Form>(initial?.form ?? EMPTY);
  const [baseline, setBaseline] = useState<Form>(initial?.form ?? EMPTY);
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(initial?.photoUrl ? { previewUrl: initial.photoUrl, name: "Joriy rasm" } : null);
  const [photoDirty, setPhotoDirty] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => (initial?.gallery ?? []).map((g) => ({ key: g.path, previewUrl: g.url, path: g.path })));
  const [galleryDirty, setGalleryDirty] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const galleryUploads = useRef(new Map<File, string>());
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [serverFields, setServerFields] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ url: string; editUrl: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const objectUrlRef = useRef<string | null>(null);
  const uploadedRef = useRef<{ file: File; path: string } | null>(null);
  // Takroriy bosish/qayta urinishda bir xil kalitlar ishlatiladi: server dublikat yaratmaydi
  const keysRef = useRef<{ idempotencyKey: string; editToken: string } | null>(null);

  // Qoralamani brauzerdan tiklash (faqat qulaylik uchun, serverda saqlash o'rnini bosmaydi)
  useEffect(() => {
    if (isEdit) return;
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const p = JSON.parse(raw) as Partial<Form>;
          const str = (v: unknown) => (typeof v === "string" ? v : "");
          setForm({
            groomName: str(p.groomName),
            brideName: str(p.brideName),
            date: str(p.date),
            time: str(p.time),
            venueName: str(p.venueName),
            venueAddress: str(p.venueAddress),
            extraText: str(p.extraText),
            parents: str(p.parents),
            dressCode: str(p.dressCode),
            program: Array.isArray(p.program)
              ? p.program.slice(0, 8).map((r) => ({ time: str((r as { time?: unknown })?.time), title: str((r as { title?: unknown })?.title) }))
              : [],
            design: initialDesign ?? (DESIGNS.includes(p.design as Design) ? (p.design as Design) : "osmon"),
            musicId: null,
          });
        } else if (initialDesign) {
          setForm((f) => ({ ...f, design: initialDesign }));
        }
      } catch {
        /* localStorage mavjud emas yoki buzilgan: qoralamasiz davom etamiz */
      }
      setDraftLoaded(true);
    }, 0);
    return () => clearTimeout(id);
  }, [isEdit, initialDesign]);

  useEffect(() => {
    if (isEdit || !draftLoaded || result) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* e'tiborsiz */
    }
  }, [form, draftLoaded, isEdit, result]);

  const dirty = !result && !deleted && (JSON.stringify(form) !== JSON.stringify(baseline) || photoDirty || galleryDirty);
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    const parsed = invitationInputSchema.safeParse({ ...form, program: cleanProgram(form.program) });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!(key in out)) out[key] = issue.message;
      }
    }
    if (!out.date && !out.time && form.date && form.time && !tashkentToIso(form.date, form.time)) {
      out.date = "Bunday sana mavjud emas";
    }
    return out;
  }, [form]);

  const step1Invalid = STEP1_FIELDS.some((k) => errors[k]);
  const allValid = Object.keys(errors).length === 0;

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setServerFields({});
    setSavedNote(null);
  }

  function onPhoto(file: File | undefined) {
    if (!file) return;
    if (!(ALLOWED_PHOTO_TYPES as readonly string[]).includes(file.type)) {
      setPhotoError("Faqat JPG, PNG yoki WebP rasm yuklash mumkin.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Rasm hajmi 8 MB dan oshmasligi kerak.");
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPhotoError(null);
    setPhoto({ previewUrl: url, name: file.name, file });
    setPhotoDirty(true);
  }

  function addGallery(files: FileList | null) {
    if (!files) return;
    const next = [...gallery];
    let err: string | null = null;
    for (const file of Array.from(files)) {
      if (next.length >= MAX_GALLERY) { err = `Galereyaga ${MAX_GALLERY} tagacha rasm qo‘shish mumkin.`; break; }
      if (!(ALLOWED_PHOTO_TYPES as readonly string[]).includes(file.type)) { err = "Faqat JPG, PNG yoki WebP rasm yuklash mumkin."; continue; }
      if (file.size > MAX_PHOTO_BYTES) { err = "Har bir rasm 8 MB dan oshmasligi kerak."; continue; }
      next.push({ key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`, previewUrl: URL.createObjectURL(file), file });
    }
    setGalleryError(err);
    setGallery(next);
    setGalleryDirty(true);
  }

  function removeGallery(key: string) {
    setGallery((g) => g.filter((x) => x.key !== key));
    setGalleryDirty(true);
    setGalleryError(null);
  }

  function moveGallery(key: string, d: -1 | 1) {
    setGallery((g) => {
      const i = g.findIndex((x) => x.key === key);
      const j = i + d;
      if (i < 0 || j < 0 || j >= g.length) return g;
      const c = [...g];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
    setGalleryDirty(true);
  }

  /** Galereya fayllarini ketma-ket yuklaydi; yuklanganlari qayta urinishda qayta yuklanmaydi. */
  async function uploadGallery(): Promise<string[]> {
    const paths: string[] = [];
    for (const g of gallery) {
      if (g.path) { paths.push(g.path); continue; }
      const file = g.file!;
      let path = galleryUploads.current.get(file);
      if (!path) {
        const fd = new FormData();
        fd.set("file", file);
        path = (await api<{ path: string }>("/api/photos", { method: "POST", body: fd })).path;
        galleryUploads.current.set(file, path);
      }
      paths.push(path);
    }
    return paths;
  }

  function removePhoto() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    uploadedRef.current = null;
    setPhoto(null);
    setPhotoDirty(true);
  }

  function next() {
    if (step === 0 && step1Invalid) {
      setShowErrors(true);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function uploadPhoto(file: File): Promise<string> {
    if (uploadedRef.current?.file === file) return uploadedRef.current.path; // qayta urinishda qayta yuklanmaydi
    const fd = new FormData();
    fd.set("file", file);
    const data = await api<{ path: string }>("/api/photos", { method: "POST", body: fd });
    uploadedRef.current = { file, path: data.path };
    return data.path;
  }

  async function save() {
    if (saving) return; // takroriy bosish
    if (!allValid) {
      setShowErrors(true);
      setStep(0);
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSavedNote(null);
    setServerFields({});
    try {
      const payload: Record<string, unknown> = {
        groomName: form.groomName,
        brideName: form.brideName,
        date: form.date,
        time: form.time,
        venueName: form.venueName,
        venueAddress: form.venueAddress,
        extraText: form.extraText,
        parents: form.parents,
        dressCode: form.dressCode,
        program: cleanProgram(form.program),
        design: form.design,
        musicId: form.musicId,
      };

      if (!isEdit) {
        if (photo?.file) payload.photoPath = await uploadPhoto(photo.file);
        payload.gallery = await uploadGallery();
        keysRef.current ??= { idempotencyKey: randomToken(24), editToken: randomToken(32) };
        const created = await api<{ slug: string }>("/api/invitations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...payload, ...keysRef.current }),
        });
        // Serverdan qayta o'qib tasdiqlash: "saqlandi" faqat haqiqatan o'qilgandan keyin ko'rsatiladi
        const stored = await api<PublicInvitation>(`/api/public/${created.slug}`);
        if (stored.groomName !== form.groomName.trim() || stored.brideName !== form.brideName.trim()) {
          throw new ApiError("Taklifnoma saqlandi, lekin serverdan o‘qilgan ma’lumot mos kelmadi. Iltimos, qayta tekshiring.");
        }
        const origin = siteUrl || window.location.origin;
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* e'tiborsiz */
        }
        setResult({ url: `${origin}/i/${created.slug}`, editUrl: `${origin}/edit/${keysRef.current.editToken}` });
      } else {
        if (photoDirty) payload.photoPath = photo?.file ? await uploadPhoto(photo.file) : null;
        if (galleryDirty) payload.gallery = await uploadGallery();
        const updated = await api<{ form: Form }>(`/api/edit/${editToken}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (updated.form.groomName !== form.groomName.trim()) {
          throw new ApiError("O‘zgarish saqlandi, lekin serverdan o‘qilgan ma’lumot mos kelmadi.");
        }
        setBaseline(form);
        setPhotoDirty(false);
        setGalleryDirty(false);
        setSavedNote("O‘zgarishlar serverga saqlandi va ommaviy sahifada ko‘rinadi.");
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setSaveError(e.message);
        if (e.fields) {
          setServerFields(e.fields);
          if (STEP1_FIELDS.some((k) => e.fields?.[k])) {
            setShowErrors(true);
            setStep(0);
          }
        }
      } else {
        setSaveError("Kutilmagan xato yuz berdi. Qayta urinib ko‘ring.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await api(`/api/edit/${editToken}`, { method: "DELETE" });
      setDeleted(true);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "O‘chirib bo‘lmadi. Qayta urinib ko‘ring.");
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  const track = tracks.find((t) => t.id === form.musicId) ?? null;
  const preview: PublicInvitation = {
    groomName: form.groomName.trim() || "Kuyov ismi",
    brideName: form.brideName.trim() || "Kelin ismi",
    weddingAt: form.date && form.time ? tashkentToIso(form.date, form.time) : null,
    venueName: form.venueName.trim() || "To‘yxona nomi",
    venueAddress: form.venueAddress.trim(),
    extraText: form.extraText.trim() || null,
    parents: form.parents.trim() || null,
    dressCode: form.dressCode.trim() || null,
    program: cleanProgram(form.program).filter((r) => /^([01]\d|2[0-3]):[0-5]\d$/.test(r.time) && r.title),
    photoUrl: photo?.previewUrl ?? null,
    gallery: gallery.map((g) => g.previewUrl),
    design: form.design,
    music: track ? { title: track.title, url: track.url } : null,
  };

  const err = (k: string) => serverFields[k] ?? (showErrors ? errors[k] : undefined);

  if (deleted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="font-serif text-2xl text-ink">Taklifnoma o‘chirildi</h2>
        <p className="mt-2 text-sm text-muted">Ommaviy havola endi ochilmaydi.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-gold-dark px-6 py-2 text-sm text-white">Bosh sahifa</Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="px-4 py-10">
        <PublishedPanel url={result.url} editUrl={result.editUrl} title={`${form.groomName.trim()} va ${form.brideName.trim()}`} />
      </div>
    );
  }

  const canSave = backendConfigured && !saving;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[1fr_440px]">
      <div>
        <ol className="flex flex-wrap gap-2 text-sm" aria-label="Bosqichlar">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  if (i > 0 && step === 0 && step1Invalid) {
                    setShowErrors(true);
                    return;
                  }
                  setStep(i);
                }}
                aria-current={i === step ? "step" : undefined}
                className={`rounded-full px-3 py-1.5 ${i === step ? "bg-gold-dark text-white" : "bg-beige text-ink hover:bg-[#c5d9cc]"}`}
              >
                {i + 1}. {label}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-2xl border border-[#cfe0d5] bg-white p-5 shadow-sm">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kuyovning ismi" error={err("groomName")}>
                <input className={inputCls} value={form.groomName} maxLength={60} autoComplete="off" onChange={(e) => set("groomName", e.target.value)} />
              </Field>
              <Field label="Kelinning ismi" error={err("brideName")}>
                <input className={inputCls} value={form.brideName} maxLength={60} autoComplete="off" onChange={(e) => set("brideName", e.target.value)} />
              </Field>
              <Field label="To‘y sanasi" error={err("date")} hint="Toshkent vaqti bo‘yicha">
                <input type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </Field>
              <Field label="Boshlanish vaqti" error={err("time")}>
                <input type="time" className={inputCls} value={form.time} onChange={(e) => set("time", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Restoran yoki to‘yxona nomi" error={err("venueName")}>
                  <input className={inputCls} value={form.venueName} maxLength={120} onChange={(e) => set("venueName", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="To‘yxona manzili" error={err("venueAddress")} hint="Xarita havolasi shu manzildan yasaladi">
                  <input className={inputCls} value={form.venueAddress} maxLength={240} onChange={(e) => set("venueAddress", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Qo‘shimcha taklifnoma matni (ixtiyoriy)" error={err("extraText")}>
                  <textarea className={`${inputCls} min-h-28`} value={form.extraText} maxLength={600} onChange={(e) => set("extraText", e.target.value)} />
                  <span className="mt-1 block text-right text-xs font-normal text-muted">{form.extraText.length}/600</span>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Ota-ona nomidan taklif (ixtiyoriy)" error={err("parents")} hint="Masalan: Karim va Dilfuza oilalari nomidan">
                  <input className={inputCls} value={form.parents} maxLength={200} onChange={(e) => set("parents", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Kiyim kodi (ixtiyoriy)" error={err("dressCode")} hint="Masalan: janoblar klassik kostyumda, xonimlar pastel ranglarda">
                  <textarea className={`${inputCls} min-h-20`} value={form.dressCode} maxLength={300} onChange={(e) => set("dressCode", e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-ink">To‘y dasturi (ixtiyoriy)</p>
                <p className="mt-1 text-xs text-muted">Vaqt va nomini yozing, masalan: 16:00 Mehmonlarni kutib olish. Ko‘pi bilan 8 ta qator.</p>
                <ul className="mt-3 space-y-2">
                  {form.program.map((row, i) => (
                    <li key={i} className="flex gap-2">
                      <input
                        type="time"
                        aria-label={`Dastur ${i + 1}: vaqt`}
                        className={`${inputCls} mt-0 w-32 shrink-0`}
                        value={row.time}
                        onChange={(e) => set("program", form.program.map((r, j) => (j === i ? { ...r, time: e.target.value } : r)))}
                      />
                      <input
                        aria-label={`Dastur ${i + 1}: nomi`}
                        className={`${inputCls} mt-0`}
                        value={row.title}
                        maxLength={60}
                        placeholder="Masalan: Nikoh marosimi"
                        onChange={(e) => set("program", form.program.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))}
                      />
                      <button type="button" aria-label={`Dastur ${i + 1} qatorini o‘chirish`} className="rounded-lg border border-[#b7cdbf] px-3 text-red-700" onClick={() => set("program", form.program.filter((_, j) => j !== i))}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                {err("program") && <p role="alert" className="mt-2 text-xs text-red-700">{err("program")}</p>}
                {form.program.length < 8 && (
                  <button type="button" className="mt-3 rounded-full border border-[#b7cdbf] px-4 py-2 text-sm" onClick={() => set("program", [...form.program, { time: "", title: "" }])}>
                    + Qator qo‘shish
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm font-medium text-ink">Juftlik rasmi (ixtiyoriy)</p>
              <p className="mt-1 text-xs text-muted">JPG, PNG yoki WebP, 8 MB gacha.</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="mt-3 block w-full text-sm"
                aria-label="Rasm tanlash"
                onChange={(e) => {
                  onPhoto(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {(photoError || serverFields.photo) && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                  {photoError ?? serverFields.photo}
                </p>
              )}
              {photo && (
                <div className="mt-4 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl} alt="Tanlangan rasm" className="h-24 w-24 rounded-lg object-cover" />
                  <div className="text-sm">
                    <p className="break-all">{photo.name}</p>
                    <button type="button" onClick={removePhoto} className="mt-2 text-red-700 underline">
                      Rasmni olib tashlash
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-8 border-t border-[#cfe0d5] pt-6">
                <p className="text-sm font-medium text-ink">Galereya: bir nechta rasm (ixtiyoriy)</p>
                <p className="mt-1 text-xs text-muted">{MAX_GALLERY} tagacha rasm. Tartibini ←/→ tugmalari bilan o‘zgartiring.</p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-3 block w-full text-sm"
                  aria-label="Galereya rasmlarini tanlash"
                  onChange={(e) => {
                    addGallery(e.target.files);
                    e.target.value = "";
                  }}
                />
                {(galleryError || serverFields.gallery) && (
                  <p role="alert" className="mt-2 text-sm text-red-700">{galleryError ?? serverFields.gallery}</p>
                )}
                {gallery.length > 0 && (
                  <ul className="mt-4 grid grid-cols-3 gap-3">
                    {gallery.map((g, i) => (
                      <li key={g.key} className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.previewUrl} alt={`Galereya ${i + 1}`} className="h-24 w-full rounded-lg object-cover" />
                        <div className="mt-1 flex items-center justify-center gap-2 text-sm">
                          <button type="button" aria-label="Oldinga" disabled={i === 0} onClick={() => moveGallery(g.key, -1)} className="px-1 disabled:opacity-30">←</button>
                          <button type="button" onClick={() => removeGallery(g.key)} className="text-red-700 underline">O‘chirish</button>
                          <button type="button" aria-label="Orqaga" disabled={i === gallery.length - 1} onClick={() => moveGallery(g.key, 1)} className="px-1 disabled:opacity-30">→</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="mt-4 text-xs text-muted">
                Rasm “Saqlash” bosilganda serverga yuklanadi va faqat muvaffaqiyatli yuklangandan keyin taklifnomaga bog‘lanadi.
              </p>
            </div>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="text-sm font-medium text-ink">Dizaynni tanlang</legend>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DESIGNS.map((d) => (
                  <label
                    key={d}
                    className={`cursor-pointer rounded-xl border p-4 ${form.design === d ? "border-gold bg-[#e8f3ec] ring-2 ring-gold/40" : "border-[#cfe0d5] hover:bg-beige/40"}`}
                  >
                    <input type="radio" name="design" value={d} checked={form.design === d} onChange={() => set("design", d)} className="sr-only" />
                    <PhonePreview data={{ ...preview, design: d }} width={150} height={250} className="mx-auto" />
                    <span className="mt-3 block font-serif text-lg text-ink">{DESIGN_LABELS[d]}</span>
                    <span className="mt-1 block text-xs text-muted">{DESIGN_DESCRIPTIONS[d]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-medium text-ink">Musiqa</p>
              {tracks.length === 0 ? (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  Musiqa katalogi hozircha bo‘sh: litsenziyasi tasdiqlangan audio fayllar hali qo‘shilmagan. Fayllar
                  qo‘shilgach bu yerda tanlash va tinglash imkoni paydo bo‘ladi. Taklifnomani musiqasiz ham yaratish mumkin.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  <li>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="music" checked={form.musicId === null} onChange={() => set("musicId", null)} />
                      Musiqasiz
                    </label>
                  </li>
                  {tracks.map((t) => (
                    <li key={t.id} className="rounded-lg border border-[#cfe0d5] p-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input type="radio" name="music" checked={form.musicId === t.id} onChange={() => set("musicId", t.id)} />
                        {t.title}
                      </label>
                      <audio
                        data-preview
                        controls
                        preload="none"
                        src={t.url}
                        className="mt-2 w-full"
                        onPlay={(e) => {
                          document.querySelectorAll<HTMLAudioElement>("audio[data-preview]").forEach((a) => {
                            if (a !== e.currentTarget) a.pause();
                          });
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 4 && (
            <p className="text-sm text-muted">
              Taklifnomaning jonli ko‘rinishi quyida. Ma’lumot, rasm, dizayn yoki musiqani o‘zgartirish uchun avvalgi
              bosqichlarga qayting: kiritganlaringiz yo‘qolmaydi.
            </p>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-serif text-xl text-ink">{isEdit ? "O‘zgarishlarni saqlash" : "Saqlash va nashr qilish"}</h2>
              {!allValid && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  Majburiy maydonlarni to‘ldiring: {Object.values(errors).join("; ")}.
                </p>
              )}
              {saveError && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  {saveError}
                </p>
              )}
              {savedNote && (
                <p role="status" className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-900">
                  {savedNote}{" "}
                  {initial && (
                    <a href={`/i/${initial.slug}`} target="_blank" rel="noopener noreferrer" className="underline">
                      Taklifnomani ko‘rish
                    </a>
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className={`mt-4 rounded-full px-6 py-3 text-sm font-medium ${canSave ? "bg-gold-dark text-white hover:bg-gold" : "cursor-not-allowed bg-gray-300 text-gray-600"}`}
              >
                {saving ? "Saqlanmoqda…" : isEdit ? "O‘zgarishlarni saqlash" : "Saqlash va nashr qilish"}
              </button>
              {!backendConfigured && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  Server (Supabase) hali ulanmagan, shuning uchun saqlash mumkin emas. Tugma o‘chirilgan: hech narsa
                  saqlanmaydi va soxta havola berilmaydi.
                </p>
              )}
              {!isEdit && (
                <p className="mt-3 text-xs text-muted">
                  Kiritgan ma’lumotlaringiz qulaylik uchun shu brauzerda qoralama sifatida saqlanib turadi (rasm va
                  musiqa tanlovi bundan mustasno).
                </p>
              )}

              {isEdit && (
                <div className="mt-8 border-t border-[#cfe0d5] pt-6">
                  <h3 className="text-sm font-medium text-red-800">Taklifnomani o‘chirish</h3>
                  <p className="mt-1 text-xs text-muted">O‘chirilgach ommaviy havola ishlamaydi va qayta tiklanmaydi.</p>
                  {!confirmDelete ? (
                    <button type="button" onClick={() => setConfirmDelete(true)} className="mt-3 rounded-full border border-red-300 px-5 py-2 text-sm text-red-800 hover:bg-red-50">
                      O‘chirish
                    </button>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-3" role="alertdialog" aria-label="O‘chirishni tasdiqlash">
                      <span className="text-sm">Haqiqatan ham o‘chirilsinmi?</span>
                      <button type="button" onClick={remove} disabled={saving} className="rounded-full bg-red-700 px-5 py-2 text-sm text-white disabled:opacity-50">
                        Ha, o‘chirish
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full border border-[#b7cdbf] px-5 py-2 text-sm">
                        Bekor qilish
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              className="rounded-full border border-[#b7cdbf] px-5 py-2 text-sm disabled:opacity-40"
            >
              Orqaga
            </button>
            {step < STEPS.length - 1 && (
              <button type="button" onClick={next} className="rounded-full bg-gold-dark px-6 py-2 text-sm font-medium text-white hover:bg-gold">
                Keyingisi
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className={`${step === 4 ? "block" : "hidden lg:block"} self-start lg:sticky lg:top-4`} aria-label="Jonli ko‘rinish">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted">Jonli ko‘rinish</p>
        <div className="max-h-[80vh] overflow-y-auto rounded-2xl border border-[#cfe0d5] bg-white shadow-sm">
          <InvitationView data={preview} />
        </div>
      </aside>
    </div>
  );
}
