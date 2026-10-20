import type { Metadata } from "next";
import Link from "next/link";
import { CreateWizard } from "@/components/create/CreateWizard";
import { backendConfigured, loadTracks } from "@/lib/server/tracks";

export const metadata: Metadata = { title: "Taklifnoma yaratish" };
export const dynamic = "force-dynamic"; // server sozlamasi va musiqa katalogi har so'rovda o'qiladi

export default async function CreatePage() {
  const tracks = await loadTracks();
  return (
    <main className="flex-1">
      <header className="border-b border-[#cfdcd9] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-serif text-xl text-ink">
            Taklifnoma
          </Link>
          <span className="text-sm text-muted">Yangi taklifnoma</span>
        </div>
      </header>
      <CreateWizard tracks={tracks} backendConfigured={backendConfigured()} siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""} />
    </main>
  );
}
