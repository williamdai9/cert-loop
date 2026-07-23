import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSCA Certified Strength and Conditioning Specialist® | Cert Loop",
  description: "Complete preparation for the NSCA Certified Strength and Conditioning Specialist® examination, with Fifth Edition lessons, practice, review, and optional placement.",
};

export default function NscaCscsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
