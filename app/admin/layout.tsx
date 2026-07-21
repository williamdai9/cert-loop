import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Inspector — Cert Loop",
  description: "Private curriculum, question, media, and research audit console.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
