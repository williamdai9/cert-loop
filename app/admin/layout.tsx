import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Inspector — Cert Loop",
  description: "Private curriculum, question, and source inspector.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
