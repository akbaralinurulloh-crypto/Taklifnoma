// Brauzer va serverda ishlatiladigan sof mantiq. node:crypto bu yerda ISHLATILMAYDI.
import { z } from "zod";

export const DESIGNS = [
  "anor",
  "osmon",
  "zarrin",
  "oqqora",
  "zaytun",
  "shokolad",
  "gulchizma",
  "muhr",
  "firuza",
  "atlas",
  "gulbarg",
  "yulduz",
  "kapalak",
  "oltin",
  "yurak",
] as const;
export type Design = (typeof DESIGNS)[number];

export const DESIGN_LABELS: Record<Design, string> = {
  anor: "Anor",
  osmon: "Osmon",
  zarrin: "Zarrin",
  oqqora: "Oq va qora",
  zaytun: "Zaytun",
  shokolad: "Shokolad",
  gulchizma: "Gul chizma",
  muhr: "Muhr",
  firuza: "Firuza",
  atlas: "Atlas",
  gulbarg: "Gulbarg",
  yulduz: "Yulduzli tun",
  kapalak: "Kapalak",
  oltin: "Oltin yog‘du",
  yurak: "Yuraklar",
};

export const DESIGN_DESCRIPTIONS: Record<Design, string> = {
  anor: "To‘q qizil rang, atirgullar va rasm ustidagi ismlar.",
  osmon: "Havorang osmon, oltin muhrli konvert va yengil bulutlar.",
  zarrin: "Oltin ipak mato va yurakka bosib ochiladigan taklifnoma.",
  oqqora: "Oq-qora kino uslubi, qora parda surilib ochiladi.",
  zaytun: "Zaytun yashil ipak, lentali konvert va oval kartalar.",
  shokolad: "Shokolad va krem ranglari, lentali konvert.",
  gulchizma: "Oq qog‘ozda qalam bilan chizilgan gullar.",
  muhr: "Yashil mum muhrni bosganda konvert ochiladi.",
  firuza: "Samarqand feruzasi: mehrob, sakkiz qirrali yulduz va darvoza.",
  atlas: "Milliy atlas naqshlari: qizil, sariq va ko‘k ranglar.",
  gulbarg: "Pushti gulbarglar to‘kilib turadi, bo‘limlar to‘liq ekranda ochiladi.",
  yulduz: "Qorong‘i osmonda miltillagan yulduzlar va uchib o‘tuvchi yulduz.",
  kapalak: "Ekran bo‘ylab uchib yuruvchi kapalaklar, binafsha-pushti ranglar.",
  oltin: "Qora fonda yuqoriga ko‘tariluvchi oltin zarralar.",
  yurak: "Tepaga suzib chiqadigan yuraklar, oq qog‘ozda qizil chiziq gullar.",
};

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const TASHKENT_OFFSET = "+05:00"; // O'zbekistonda yozgi/qishki vaqt o'tishi yo'q

const nonBlank = (label: string, max: number) =>
  z
    .string({ error: `${label} kiritilishi shart` })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(1, `${label} kiritilishi shart`)
        .max(max, `${label} ${max} belgidan oshmasligi kerak`),
    );

const optionalText = (label: string, max: number) =>
  z
    .string()
    .max(max, `${label} ${max} belgidan oshmasligi kerak`)
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null));

export type ProgramItem = { time: string; title: string };

/** Forma maydonlari. Sana (YYYY-MM-DD) va vaqt (HH:mm) Asia/Tashkent bo'yicha. */
export const invitationInputSchema = z.object({
  groomName: nonBlank("Kuyovning ismi", 60),
  brideName: nonBlank("Kelinning ismi", 60),
  date: z
    .string({ error: "Sana kiritilishi shart" })
    .min(1, "Sana kiritilishi shart")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Sana formati noto'g'ri (YYYY-OO-KK)"),
  time: z
    .string({ error: "Vaqt kiritilishi shart" })
    .min(1, "Vaqt kiritilishi shart")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Vaqt formati noto'g'ri (SS:DD)"),
  venueName: nonBlank("To'yxona nomi", 120),
  venueAddress: nonBlank("To'yxona manzili", 240),
  extraText: z
    .string()
    .max(600, "Matn 600 belgidan oshmasligi kerak")
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
  design: z.enum(DESIGNS, { error: "Dizayn noto'g'ri tanlangan" }),
  musicId: z.string({ error: "Musiqa noto'g'ri tanlangan" }).uuid("Musiqa noto'g'ri tanlangan").nullable().optional(),
  parents: optionalText("Ota-ona matni", 200),
  dressCode: optionalText("Kiyim kodi matni", 300),
  program: z
    .array(
      z.object({
        time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Dastur vaqti SS:DD ko'rinishida bo'lsin"),
        title: nonBlank("Dastur nomi", 60),
      }),
      { error: "Dastur noto'g'ri" },
    )
    .max(8, "Dasturda ko'pi bilan 8 ta qator bo'lishi mumkin")
    .optional()
    .transform((v) => v ?? []),
});
export type InvitationInput = z.input<typeof invitationInputSchema>;
export type ValidInvitation = z.output<typeof invitationInputSchema>;

/** Toshkent mahalliy sana+vaqtini UTC ISO satriga aylantiradi. Mavjud bo'lmagan sana uchun null. */
export function tashkentToIso(date: string, time: string): string | null {
  const d = new Date(`${date}T${time}:00${TASHKENT_OFFSET}`);
  if (Number.isNaN(d.getTime())) return null;
  // 2025-02-31 kabi sanalar "siljib" ketmasligini tekshiramiz
  const [y, m, day] = date.split("-").map(Number);
  const back = new Date(d.getTime() + 5 * 3600 * 1000);
  if (
    back.getUTCFullYear() !== y ||
    back.getUTCMonth() + 1 !== m ||
    back.getUTCDate() !== day
  ) {
    return null;
  }
  return d.toISOString();
}

export type Countdown =
  | { state: "upcoming"; days: number; hours: number; minutes: number; seconds: number }
  | { state: "past" };

export function countdownTo(targetIso: string, now: Date = new Date()): Countdown {
  const diff = new Date(targetIso).getTime() - now.getTime();
  if (diff <= 0) return { state: "past" };
  const s = Math.floor(diff / 1000);
  return {
    state: "upcoming",
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function mapsUrl(address: string): string | null {
  const a = address.trim();
  if (!a) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
}

/** Fayl boshidagi baytlar (magic bytes) bo'yicha haqiqiy rasm turini aniqlaydi. */
export function sniffImageType(buf: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return "image/png";
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "image/webp";
  return null;
}
