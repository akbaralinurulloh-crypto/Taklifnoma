import type { Metadata, Viewport } from "next";
import "./globals.css";

function siteBase() {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined;
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: siteBase(),
  openGraph: { type: "website", locale: "uz_UZ", siteName: "Taklifnoma" },
  title: "Taklifnoma — raqamli to'y taklifnomalari",
  description:
    "To'y taklifnomangizni o'zingiz yarating: dizayn va musiqani tanlang, noyob havolani oling va mehmonlarga yuboring.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
