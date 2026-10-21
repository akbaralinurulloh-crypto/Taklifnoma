import type { Design } from "./schema";

/** Loyiha ichidagi tayyor treklar (public/music). Baza sozlanmagan yoki musiqa tanlanmagan bo'lsa ham ishlaydi. */
export const DESIGN_DEFAULT_TRACK: Record<Design, { file: string; title: string }> = {
  anor: { file: "anor", title: "Anor — iliq lirik ohang" },
  osmon: { file: "osmon", title: "Osmon — yengil qo‘ng‘iroqchalar" },
  zarrin: { file: "zarrin", title: "Zarrin vals" },
  oqqora: { file: "oqqora", title: "Oq va qora — tungi romans" },
  zaytun: { file: "zaytun", title: "Zaytun bog‘i — gitara" },
  shokolad: { file: "shokolad", title: "Shokolad — iliq jazz" },
  gulchizma: { file: "gulchizma", title: "Gul chizma — musiqa qutisi" },
  muhr: { file: "muhr", title: "Muhr — arfa" },
  firuza: { file: "firuza", title: "Firuza — sharqona kecha" },
  atlas: { file: "atlas", title: "Atlas — bayramona doira" },
  gulbarg: { file: "kelin", title: "Kelin kutib olish" },
  yulduz: { file: "ballada", title: "Romantik ballada" },
  kapalak: { file: "gulchizma", title: "Gul chizma — musiqa qutisi" },
  oltin: { file: "marsh", title: "To‘y marshi" },
  yurak: { file: "yoryor2", title: "Yor-yor 2 — sekin" },
};

/** Egasi musiqa tanlamagan bo'lsa, dizaynga mos tayyor trek qo'yiladi. */
export function defaultTrack(design: Design): { title: string; url: string } {
  const t = DESIGN_DEFAULT_TRACK[design];
  return { title: t.title, url: `/music/${t.file}.mp3` };
}
