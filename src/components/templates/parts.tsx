import { mapsUrl } from "@/lib/schema";

/** Manzil bo'lmasa hech narsa ko'rsatilmaydi: ishlamaydigan tugma yo'q. */
export function MapLink({ address, className = "" }: { address: string; className?: string }) {
  const href = mapsUrl(address);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      Xaritada ko‘rish / yo‘nalish olish
    </a>
  );
}

export function Photo({ url, alt, className = "" }: { url: string | null; alt: string; className?: string }) {
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={`object-cover ${className}`} />
  );
}
