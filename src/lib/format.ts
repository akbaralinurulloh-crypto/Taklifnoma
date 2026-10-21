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

const MONTH_TITLES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];
export const WEEKDAY_SHORT = ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Ya"];

/** Oylik taqvim (hafta Dushanbadan boshlanadi), to'y kuni belgilanadi. Toshkent vaqti bo'yicha. */
export function monthGrid(iso: string | null): { title: string; year: number; day: number; cells: (number | null)[] } | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const d = new Date(t + 5 * 3600 * 1000);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay(); // 0 = yakshanba
  const offset = (first + 6) % 7; // dushanbadan boshlab
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= days; i++) cells.push(i);
  while (cells.length % 7) cells.push(null);
  return { title: MONTH_TITLES[m], year: y, day: d.getUTCDate(), cells };
}
