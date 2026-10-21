"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

type Ctx = { start: () => void };
const MusicCtx = createContext<Ctx | null>(null);

/** Konvert ochilganda musiqani boshlash uchun (foydalanuvchi bosishi = brauzer ruxsati). */
export function useMusicStart(): (() => void) | null {
  return useContext(MusicCtx)?.start ?? null;
}

/**
 * Haqiqiy audio fayl. `bar` yoqilganda pastda doimiy "musiqani o'chirish/yoqish" tugmasi turadi.
 * Avtomatik boshlash faqat foydalanuvchi konvertni bosgandan keyin ishlaydi (brauzerlar boshqacha ruxsat bermaydi).
 */
export function MusicProvider({ track, lang, bar, children }: { track: { title: string; url: string } | null; lang: Lang; bar: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const m = dict(lang).music;

  const start = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = 0.8;
    a.play().catch(() => setError(true)); // ruxsat berilmasa pastdagi tugma orqali qo'lda yoqiladi
  }, []);

  async function toggle() {
    const a = ref.current;
    if (!a) return;
    try {
      setError(false);
      if (a.paused) await a.play();
      else a.pause();
    } catch {
      setError(true);
    }
  }

  return (
    <MusicCtx.Provider value={{ start }}>
      {children}
      {track && bar && (
        <>
          <audio key={track.url} ref={ref} src={track.url} preload="auto" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError(true); }} />
          <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[55] flex justify-center px-4">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-black/60 px-5 py-2.5 text-[15px] text-white shadow-lg backdrop-blur"
            >
              <span aria-hidden className="flex h-4 items-end gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} className="iv-eq block w-[3px] rounded-sm bg-white" style={{ height: playing ? undefined : 4, animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
              {error ? m.failPlay : playing ? m.off : m.on}
            </button>
          </div>
        </>
      )}
    </MusicCtx.Provider>
  );
}
