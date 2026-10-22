// Brauzer va serverda ishlatiladigan sof mantiq. node:crypto bu yerda ISHLATILMAYDI.
import { z } from "zod";

export const DESIGNS = ["kumush", "marvarid", "safir", "zumrad", "lino", "chizma", "gulpush", "lavanda", "shox", "kokgul", "deko", "evkalipt", "boho", "jurnal", "yoqut", "tong", "ipak", "bant", "krem", "marmar", "zarrin", "oqqora", "osmon", "zaytun", "shokolad"] as const;
export type Design = (typeof DESIGNS)[number];

export const DESIGN_LABELS: Record<Design, string> = {
  kumush: "Kumush ipak",
  marvarid: "Marvarid",
  safir: "Safir",
  zumrad: "Zumrad",
  lino: "Lino",
  chizma: "Gul chizma",
  gulpush: "Pushti gul",
  lavanda: "Lavanda",
  shox: "Zaytun shox",
  kokgul: "Ko‘k gul",
  deko: "Art-deko",
  evkalipt: "Evkalipt",
  boho: "Boho",
  jurnal: "Jurnal",
  yoqut: "Yoqut ipak",
  tong: "Moviy tong",
  ipak: "Oltin ipak",
  bant: "Yashil bant",
  krem: "Krem bant",
  marmar: "Marmar",
  zarrin: "Oltin klassika",
  oqqora: "Qora va oltin",
  osmon: "Kechki ko‘k",
  zaytun: "Zaytun",
  shokolad: "Shampan",
};

export const DESIGN_DESCRIPTIONS: Record<Design, string> = {
  kumush: "Kumush ipak to‘lqinlari, oq yozuv va surib ochiladigan sahifa.",
  marvarid: "Marvarid va shampan ranglari, nafis arka va mum muhrli konvert.",
  safir: "Chuqur ko‘k safir rangi, oltin chiziqlar va ikki darvoza.",
  zumrad: "To‘q zumrad yashil, oltin yozuv va chap tekislangan hikoya.",
  lino: "Zig‘ir mato rangi, qora yozuv, ofset ramkali rasm. Sodda va toza.",
  chizma: "Oq qog‘ozda qalam bilan chizilgan gullar, qo‘lyozma ismlar.",
  gulpush: "Pushti-qizil chizma gullar, yumshoq panellar va yurakli ochilish.",
  lavanda: "Binafsha chizma gullar, chap tekislangan yo‘l ko‘rinishi.",
  shox: "Yashil zaytun shoxlari chizmasi va mum muhrli konvert.",
  kokgul: "Havorang chizma gullar, konvert va ramkali panellar.",
  deko: "Qora fon, oltin yelpig‘ich naqsh va qat’iy ramka. Klassik hashamat.",
  evkalipt: "Yumshoq yashil evkalipt shoxlari va krem qog‘oz. Tabiiy, sokin uslub.",
  boho: "Terrakota va qum ranglaridagi ichma-ich yoylar. Iliq, zamonaviy.",
  jurnal: "Jurnal sahifasidek: katta serif yozuv, nozik chiziqlar, oq qog‘oz.",
  yoqut: "To‘q yoqut rangli ipak va oltin chiziqlar, yurakka bosib ochiladi.",
  tong: "Yumshoq osmon ranglari, nur taralgan arka va konvert ochilishi.",
  ipak: "Oltin ipak mato to‘lqinlari va yurakka bosib ochiladigan taklifnoma.",
  bant: "Zaytun ipak, oq oval karta, bant va mum muhrli konvert.",
  krem: "Shampan ipak, jigarrang muhrli konvert, yurakli taqvim.",
  marmar: "Oq marmar, qora va oltin chiziqlar, surib ochiladigan sahifa.",
  zarrin: "Krem qog‘oz, oltin chiziqlar va konvert ochilishi. Sokin, klassik hashamat.",
  oqqora: "Qora fon, oltin yozuv va ikki darvoza. Qat’iy, zamonaviy hashamat.",
  osmon: "To‘q ko‘k tun, oq-krem yozuv va oltin muhrli konvert.",
  zaytun: "Zaytun yashil va krem, mum muhr va chap tekislangan hikoya.",
  shokolad: "Shampan va jigarrang, toza ramka va yengil karta ochilishi.",
};

/** Eski (o‘chirilgan) dizaynlar bazada qolgan bo‘lsa, ularga yangi dizayn beriladi. */
const LEGACY_DESIGN: Record<string, Design> = {
  anor: "zarrin", gulbarg: "shokolad", yurak: "shokolad", kapalak: "shokolad", gulchizma: "shokolad", muhr: "zaytun",
  yulduz: "osmon", firuza: "osmon", atlas: "zarrin", oltin: "oqqora",
};
export function normalizeDesign(v: string): Design {
  if ((DESIGNS as readonly string[]).includes(v)) return v as Design;
  return LEGACY_DESIGN[v] ?? "zarrin";
}

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
