import type { Metadata } from "next";
import { CreateWizard } from "@/components/create/CreateWizard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DESIGNS, type Design } from "@/lib/schema";
import { backendConfigured, loadTracks } from "@/lib/server/tracks";

export const metadata: Metadata = { title: "Taklifnoma yaratish" };
export const dynamic = "force-dynamic"; // server sozlamasi va musiqa katalogi har so'rovda o'qiladi

export default async function CreatePage({ searchParams }: { searchParams: Promise<{ dizayn?: string }> }) {
  const { dizayn } = await searchParams;
  const initialDesign = (DESIGNS as readonly string[]).includes(dizayn ?? "") ? (dizayn as Design) : undefined;
  const tracks = await loadTracks();
  return (
    <main className="flex-1">
      <SiteHeader />
      <CreateWizard initialDesign={initialDesign} tracks={tracks} backendConfigured={backendConfigured()} siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""} />
    </main>
  );
}
