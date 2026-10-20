import Link from "next/link";
import { InvitationView } from "@/components/InvitationView";
import type { PublicInvitation } from "@/lib/types";

/**
 * Dizaynni kichraytirib ko'rsatadi (faqat ko'rinish: aria-hidden, bosilmaydi).
 * `href` berilsa, ustiga alohida havola qo'yiladi (ichma-ich <a> bo'lmasligi uchun havola rasmni o'ramaydi).
 */
export function PhonePreview({
  data,
  width = 250,
  height = 430,
  className = "",
  href,
  label,
}: {
  data: PublicInvitation;
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  label?: string;
}) {
  const scale = width / 420;
  return (
    <div className={`group relative transition-transform hover:-translate-y-1 ${className}`} style={{ width, height }}>
      <div aria-hidden className="pointer-events-none relative h-full w-full select-none overflow-hidden rounded-2xl border border-[#cfe0d5] bg-white shadow-[0_20px_40px_-24px_rgba(20,48,42,.55)]">
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: 420, transform: `scale(${scale})` }}>
          <InvitationView data={data} />
        </div>
      </div>
      {href && (
        <Link href={href} aria-label={label} className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-dark" />
      )}
    </div>
  );
}
