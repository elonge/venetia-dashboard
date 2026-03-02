import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is Robert Harris Precipice a True Story? Fact vs Fiction",
  description:
    "Is Precipice by Robert Harris a true story? A fact-checked guide to the real history, people, and events behind the novel.",
};

export default function PrecipiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
