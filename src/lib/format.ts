const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];
const WEEKDAYS = [
  "yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba",
];

/** UTC ISO vaqtni Asia/Tashkent (UTC+5) bo'yicha o'zbekcha matnga aylantiradi. */
export function whenText(iso: string | null): { weekday: string; date: string; time: string } | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const d = new Date(t + 5 * 3600 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return {
    weekday: WEEKDAYS[d.getUTCDay()],
    date: `${d.getUTCDate()}-${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}-yil`,
    time: `${hh}:${mm}`,
  };
}

/** Sana qismlari alohida (katta raqam, oy nomi, yil) ko'rsatiladigan dizaynlar uchun. */
export function dateParts(iso: string | null): { day: string; month: string; year: string; weekday: string; time: string } | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const d = new Date(t + 5 * 3600 * 1000);
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: MONTHS[d.getUTCMonth()],
    year: String(d.getUTCFullYear()),
    weekday: WEEKDAYS[d.getUTCDay()],
    time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
  };
}
