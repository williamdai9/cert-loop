import type { Metadata } from "next";
import { Noto_Sans_SC, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const noto = Noto_Sans_SC({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const newsreader = Newsreader({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"] });

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const protocol = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Cert Loop — End-to-End Certification Learning";
  const description = "Complete learning systems for professional certifications: full lessons, visual instruction, practice, review, progress, and exam readiness.";
  return {
    metadataBase: new URL(origin), title, description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, type: "website", images: [{ url: `${origin}/og-v2.png`, width: 1734, height: 907, alt: "Cert Loop end-to-end certification learning platform" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og-v2.png`] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto.variable} ${newsreader.variable}`}>{children}</body>
    </html>
  );
}
