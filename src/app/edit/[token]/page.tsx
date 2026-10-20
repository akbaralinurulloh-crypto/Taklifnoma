import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateWizard } from "@/components/create/CreateWizard";
import { RsvpList } from "@/components/RsvpList";
import { Unconfigured } from "@/components/Unconfigured";
import { getRepo } from "@/lib/server/deps";
import { AppError } from "@/lib/server/errors";
import { getForEdit } from "@/lib/server/service";
import { defaultUrls } from "@/lib/server/storage";
import { backendConfigured, loadTracks } from "@/lib/server/tracks";
import { editableView } from "@/lib/server/views";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Taklifnomani tahrirlash",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function EditPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let row;
  try {
    row = await getForEdit(getRepo(), token);
  } catch (e) {
    if (e instanceof AppError) {
      if (e.code === "not_configured") return <Unconfigured />;
      if (e.status === 404) notFound();
    }
    throw e;
  }
  const view = editableView(row, defaultUrls);
  const tracks = await loadTracks();

  return (
    <main className="flex-1">
      <header className="border-b border-[#cfdcd9] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-serif text-xl text-ink">
            Taklifnoma
          </Link>
          <span className="text-sm text-muted">Tahrirlash</span>
        </div>
      </header>
      {row.status === "draft" && (
        <p role="alert" className="mx-auto mt-4 max-w-6xl rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bu taklifnoma administrator tomonidan nashrdan olingan: hozir ommaviy ochilmaydi.
        </p>
      )}
      <CreateWizard
        mode="edit"
        tracks={tracks}
        backendConfigured={backendConfigured()}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
        initial={{ form: view.form, photoUrl: view.photoUrl, slug: view.slug }}
        editToken={token}
      />
      <RsvpList token={token} />
    </main>
  );
}
