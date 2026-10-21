import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InvitationView } from "@/components/InvitationView";
import { GuestActions } from "@/components/guest/GuestActions";
import { Unconfigured } from "@/components/Unconfigured";
import { getRepo } from "@/lib/server/deps";
import { AppError } from "@/lib/server/errors";
import { getPublicBySlug } from "@/lib/server/service";
import { defaultUrls } from "@/lib/server/storage";
import { whenText } from "@/lib/format";
import { defaultTrack } from "@/lib/builtin-music";
import { dict, parseLang } from "@/lib/i18n";

export const dynamic = "force-dynamic"; // har so'rovda bazadan o'qiladi: o'chirilgan/nashrdan olinganlar darhol yopiladi

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const load = cache(async (slug: string) => {
  try {
    return await getPublicBySlug(getRepo(), slug, defaultUrls);
  } catch (e) {
    if (e instanceof AppError && e.code === "not_configured") return "not_configured" as const;
    throw e;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data || data === "not_configured") return { title: "Taklifnoma", robots: { index: false, follow: false } };
  const when = whenText(data.weddingAt);
  const title = `${data.groomName} va ${data.brideName} to‘yiga taklif`;
  const description = when ? `${when.date}, soat ${when.time}. ${data.venueName}` : data.venueName;
  return {
    title,
    description,
    robots: { index: false, follow: false }, // shaxsiy taklifnomalar qidiruv tizimlarida chiqmasin
    openGraph: { title, description, images: data.photoUrl ? [data.photoUrl] : undefined },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const lang = parseLang(sp.lang);
  const rawGuest = Array.isArray(sp.mehmon) ? sp.mehmon[0] : sp.mehmon;
  const guest = rawGuest?.trim().slice(0, 80) || undefined; // faqat matn sifatida ko'rsatiladi (React escape qiladi)
  const other = lang === "uz" ? "ru" : "uz";
  const q = new URLSearchParams();
  if (guest) q.set("mehmon", guest);
  q.set("lang", other);
  const data = await load(slug);
  if (data === "not_configured") return <Unconfigured />;
  if (!data) notFound();

  return (
    <main className="flex-1 bg-[#efe6d3] py-0 sm:py-6">
      <>
        <InvitationView data={{ ...data, music: data.music ?? defaultTrack(data.design) }} gate lang={lang} slug={slug} guest={guest} langHref={`/i/${slug}?${q.toString()}`} />
        <div className="mx-auto mt-6 max-w-[420px] space-y-6 px-4 pb-10">
          {data.weddingAt && (
            <GuestActions
              title={dict(lang).actions.calTitle(data.groomName, data.brideName)}
              lang={lang}
              weddingAt={data.weddingAt}
              location={`${data.venueName}, ${data.venueAddress}`}
              url={`${(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "")}/i/${slug}`}
            />
          )}
        </div>
      </>
    </main>
  );
}
