import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InvitationView } from "@/components/InvitationView";
import { RsvpForm } from "@/components/RsvpForm";
import { GuestActions } from "@/components/guest/GuestActions";
import { Unconfigured } from "@/components/Unconfigured";
import { getRepo } from "@/lib/server/deps";
import { AppError } from "@/lib/server/errors";
import { getPublicBySlug } from "@/lib/server/service";
import { defaultUrls } from "@/lib/server/storage";
import { whenText } from "@/lib/format";

export const dynamic = "force-dynamic"; // har so'rovda bazadan o'qiladi: o'chirilgan/nashrdan olinganlar darhol yopiladi

type Props = { params: Promise<{ slug: string }> };

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

export default async function PublicInvitationPage({ params }: Props) {
  const { slug } = await params;
  const data = await load(slug);
  if (data === "not_configured") return <Unconfigured />;
  if (!data) notFound();

  return (
    <main className="flex-1 bg-[#dfe8e1] py-0 sm:py-6">
      <>
        <InvitationView data={data} gate />
        <div className="mx-auto mt-6 max-w-[420px] space-y-6 px-4 pb-10">
          {data.weddingAt && (
            <GuestActions
              title={`${data.groomName} va ${data.brideName} to‘yi`}
              weddingAt={data.weddingAt}
              location={`${data.venueName}, ${data.venueAddress}`}
              url={`${(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "")}/i/${slug}`}
            />
          )}
          <RsvpForm slug={slug} />
        </div>
      </>
    </main>
  );
}
