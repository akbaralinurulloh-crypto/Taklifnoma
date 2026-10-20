/** UTC ISO vaqtni Toshkent (UTC+5) bo'yicha forma maydonlari (YYYY-MM-DD va HH:mm) ko'rinishiga aylantiradi. */
export function whenParts(iso: string): { date: string; time: string } {
  const d = new Date(new Date(iso).getTime() + 5 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`,
    time: `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`,
  };
}
