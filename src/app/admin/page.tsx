import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { AdminLogin, LogoutButton, MusicToggle, MusicUpload, UnpublishButton } from "@/components/admin/AdminClient";
import { ADMIN_COOKIE, adminConfigured, isValidAdminSession } from "@/lib/server/admin";
import { getRepo } from "@/lib/server/deps";
import { getSupabaseEnv } from "@/lib/server/repo.supabase";
import { defaultUrls } from "@/lib/server/storage";
import { DESIGNS, DESIGN_LABELS } from "@/lib/schema";
import { whenText } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin panel", robots: { index: false, follow: false } };

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-20">
      <h1 className="font-serif text-2xl text-ink">{title}</h1>
      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{children}</p>
    </main>
  );
}

export default async function AdminPage() {
  // Huquq serverda tekshiriladi: sessiya cookie'si imzolangan va muddatli
  if (!adminConfigured()) {
    return <Notice title="Admin panel tayyor emas">ADMIN_SECRET o‘rnatilmagan (kamida 16 belgi). Sozlanmaguncha admin panel ishlamaydi.</Notice>;
  }
  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidAdminSession(session)) return <AdminLogin />;
  if (!getSupabaseEnv()) {
    return <Notice title="Admin panel">Ma’lumotlar bazasi (Supabase) ulanmagan: ro‘yxat va ko‘rsatkichlarni ko‘rsatib bo‘lmaydi.</Notice>;
  }

  const repo = getRepo();
  const [counts, invitations, music] = await Promise.all([repo.countByStatus(), repo.listInvitations(100), repo.listMusic(false)]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Admin panel</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="underline">Sayt</Link>
          <LogoutButton />
        </div>
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3" aria-label="Ko‘rsatkichlar">
        {([["Nashr qilingan", counts.published], ["Nashrdan olingan", counts.draft], ["O‘chirilgan", counts.deleted]] as const).map(([l, n]) => (
          <div key={l} className="rounded-xl border border-[#cfe0d5] bg-white p-4">
            <p className="text-2xl font-semibold text-ink">{n}</p>
            <p className="text-xs text-muted">{l}</p>
          </div>
        ))}
      </section>

      <section className="mt-10" aria-labelledby="inv">
        <h2 id="inv" className="font-serif text-xl text-ink">Taklifnomalar (oxirgi 100 ta)</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-[#cfe0d5] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-beige/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2">Juftlik</th>
                <th className="px-3 py-2">To‘y sanasi</th>
                <th className="px-3 py-2">Dizayn</th>
                <th className="px-3 py-2">Holat</th>
                <th className="px-3 py-2">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfe0d5]">
              {invitations.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-4 text-muted">Hozircha taklifnomalar yo‘q.</td></tr>
              )}
              {invitations.map((i) => (
                <tr key={i.id}>
                  <td className="px-3 py-2">
                    {i.status === "published" ? (
                      <Link href={`/i/${i.slug}`} target="_blank" className="underline">{i.groom_name} va {i.bride_name}</Link>
                    ) : (
                      <span>{i.groom_name} va {i.bride_name}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{whenText(i.wedding_at)?.date ?? "—"}</td>
                  <td className="px-3 py-2">{DESIGN_LABELS[i.design]}</td>
                  <td className="px-3 py-2">{i.status === "published" ? "Nashr qilingan" : i.status === "draft" ? "Nashrdan olingan" : "O‘chirilgan"}</td>
                  <td className="px-3 py-2">{i.status === "published" && <UnpublishButton id={i.id} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="mus">
        <h2 id="mus" className="font-serif text-xl text-ink">Audio katalogi</h2>
        <ul className="mt-3 divide-y divide-[#cfe0d5] rounded-xl border border-[#cfe0d5] bg-white">
          {music.length === 0 && <li className="px-4 py-3 text-sm text-muted">Katalog bo‘sh.</li>}
          {music.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
              <span>{m.title} <span className="text-xs text-muted">({m.is_active ? "faol" : "o‘chirilgan"})</span></span>
              <audio controls preload="none" src={defaultUrls.music(m.storage_path)} className="h-8 max-w-[220px]" />
              <MusicToggle id={m.id} active={m.is_active} />
            </li>
          ))}
        </ul>
        <MusicUpload />
      </section>

      <section className="mt-10" aria-labelledby="des">
        <h2 id="des" className="font-serif text-xl text-ink">Dizaynlar</h2>
        <p className="mt-1 text-sm text-muted">
          Dizaynlar kod ichidagi template komponentlari bo‘lib, bu yerda faqat ro‘yxati ko‘rsatiladi (yangi dizayn
          qo‘shish dasturchi ishi).
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {DESIGNS.map((d) => (
            <li key={d} className="rounded-full bg-beige px-3 py-1">{DESIGN_LABELS[d]}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
