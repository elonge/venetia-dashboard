import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Speculative Studio — Venetia Stanley Reimagined",
  description:
    "Venetia Stanley's replies were destroyed. Using AI and primary sources, we reconstruct her lost letters, imagined diary, Asquith's voice, and her speculative social media.",
  alternates: {
    canonical: "https://www.thevenetiaproject.com/lab",
  },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
