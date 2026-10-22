import type { Design } from "./schema";

/** Loyiha ichidagi tayyor treklar (public/music). Baza sozlanmagan yoki musiqa tanlanmagan bo'lsa ham ishlaydi. */
export const DESIGN_DEFAULT_TRACK: Record<Design, { file: string; title: string }> = {
  deko: { file: "oqqora", title: "Oq va qora — tungi romans" },
  evkalipt: { file: "zaytun", title: "Zaytun bog‘i — gitara" },
  boho: { file: "atlas", title: "Atlas — bayramona doira" },
  jurnal: { file: "osmon", title: "Osmon — yengil qo‘ng‘iroqchalar" },
  yoqut: { file: "yoryor2", title: "Yor-yor 2 — sekin" },
  tong: { file: "ballada", title: "Romantik ballada" },
  ipak: { file: "kelin", title: "Kelin kutib olish" },
  bant: { file: "muhr", title: "Muhr — arfa" },
  krem: { file: "gulchizma", title: "Gul chizma — musiqa qutisi" },
  marmar: { file: "marsh", title: "To‘y marshi" },
  zarrin: { file: "zarrin", title: "Zarrin vals" },
  oqqora: { file: "oqqora", title: "Oq va qora — tungi romans" },
  osmon: { file: "osmon", title: "Osmon — yengil qo‘ng‘iroqchalar" },
  zaytun: { file: "zaytun", title: "Zaytun bog‘i — gitara" },
  shokolad: { file: "shokolad", title: "Shokolad — iliq jazz" },
};

/** Egasi musiqa tanlamagan bo'lsa, dizaynga mos tayyor trek qo'yiladi. */
export function defaultTrack(design: Design): { title: string; url: string } {
  const t = DESIGN_DEFAULT_TRACK[design];
  return { title: t.title, url: `/music/${t.file}.mp3` };
}
