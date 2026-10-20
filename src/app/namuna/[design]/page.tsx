import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/InvitationView";
import { DESIGNS, DESIGN_DESCRIPTIONS, DESIGN_LABELS, type Design } from "@/lib/schema";
import { sampleInvitation } from "@/lib/sample";

export const dynamicParams = false;
export function generateStaticParams() {
  return DESIGNS.map((design) => ({ design }));
}

type Props = { params: Promise<{ design: string }> };

const isDesign = (v: string): v is Design => (DESIGNS as readonly string[]).includes(v);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { design } = await params;
  if (!isDesign(design)) return { title: "Namuna" };
  return { title: `${DESIGN_LABELS[design]}: namuna`, description: DESIGN_DESCRIPTIONS[design] };
}

export default async function SamplePage({ params }: Props) {
  const { design } = await params;
  if (!isDesign(design)) notFound();
  const i = DESIGNS.indexOf(design);
  const prev = DESIGNS[(i + DESIGNS.length - 1) % DESIGNS.length];
  const next = DESIGNS[(i + 1) % DESIGNS.length];

  return (
    <main className="flex-1 bg-[#dfe8e1] pb-28">
      <div className="sticky top-0 z-30 border-b border-[#cfe0d5] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <Link href="/dizaynlar" className="text-ink underline underline-offset-4">Barcha dizaynlar</Link>
          <span className="font-serif text-lg text-ink">{DESIGN_LABELS[design]}</span>
          <span className="hidden text-muted sm:inline">{i + 1} / {DESIGNS.length}</span>
        </div>
      </div>

      <p className="mx-auto max-w-md px-4 py-3 text-center text-xs text-muted">Namuna: ismlar va ma’lumotlar to‘qima.</p>
      <InvitationView data={sampleInvitation(design)} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#cfe0d5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <Link href={`/namuna/${prev}`} aria-label={`Oldingi dizayn: ${DESIGN_LABELS[prev]}`} className="rounded-full border border-[#b7cdbf] px-4 py-2.5 text-sm text-ink">←</Link>
          <Link href={`/create?dizayn=${design}`} className="flex-1 rounded-full bg-gold-dark py-2.5 text-center text-sm font-medium text-white hover:bg-ink">
            Shu dizaynda yaratish
          </Link>
          <Link href={`/namuna/${next}`} aria-label={`Keyingi dizayn: ${DESIGN_LABELS[next]}`} className="rounded-full border border-[#b7cdbf] px-4 py-2.5 text-sm text-ink">→</Link>
        </div>
      </div>
    </main>
  );
}
