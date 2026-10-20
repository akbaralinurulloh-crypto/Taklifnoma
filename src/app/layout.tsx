import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
