import { getRepo } from "./deps";
import { getSupabaseEnv } from "./repo.supabase";
import { defaultUrls } from "./storage";

export function backendConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/** Faol musiqa katalogi. Baza sozlanmagan yoki xato bo'lsa bo'sh ro'yxat (tugmalar ko'rsatilmaydi). */
export async function loadTracks() {
  if (!backendConfigured()) return [];
  try {
    const rows = await getRepo().listMusic(true);
    return rows.map((m) => ({ id: m.id, title: m.title, url: defaultUrls.music(m.storage_path) }));
  } catch (e) {
    console.error("[tracks] katalog yuklanmadi:", e instanceof Error ? e.message : e);
    return [];
  }
}
