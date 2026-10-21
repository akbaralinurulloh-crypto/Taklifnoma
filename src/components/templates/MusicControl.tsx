"use client";

import { useRef, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

type Props = {
  track: { title: string; url: string } | null;
  className?: string;
  lang?: Lang;
};

/** Haqiqiy audio fayldan ijro etadi. Track bo'lmasa hech narsa ko'rsatilmaydi (soxta tugma yo'q). */
export function MusicControl({ track, className = "", lang = "uz" }: Props) {
  const m = dict(lang).music;
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);

  if (!track) return null;

  async function toggle() {
    const a = ref.current;
    if (!a) return;
    try {
      setError(null);
      if (a.paused) await a.play();
      else a.pause();
    } catch {
      setError(m.failPlay);
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <audio
        key={track.url}
        ref={ref}
        src={track.url}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError(m.failLoad);
        }}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className="rounded-full border border-current px-4 py-2 text-sm"
        >
          {playing ? m.stop : m.play}
        </button>
        <label className="flex items-center gap-2 text-xs">
          <span>{m.volume}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            aria-label={m.ariaVolume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (ref.current) ref.current.volume = v;
            }}
          />
        </label>
      </div>
      <p className="text-xs opacity-70">{track.title}</p>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
