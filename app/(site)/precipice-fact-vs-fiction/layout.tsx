import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robert Harris Precipice: Real History vs Fiction | The Venetia Project",
  description: "A guide to the historical reality behind the characters and events in Robert Harris's 2024 novel Precipice, focusing on Asquith and Venetia Stanley.",
};

export default function PrecipiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
