import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://the-venetia-project.vercel.app"),
  title: {
    default: "The Venetia Project",
    template: "%s | The Venetia Project",
  },
  description: "A data-driven archive of Venetia Stanley, Asquith, and the secrets stitched across their letters. Explore WWI history through a reconstructed timeline.",
  keywords: ["Venetia Stanley", "H.H. Asquith", "WWI", "History", "Letters", "Archive", "AI", "Data Visualization", "Edwardian Era", "Politics"],
  authors: [{ name: "The Venetia Project Team" }],
  openGraph: {
    title: "The Venetia Project",
    description: "A data-driven archive of Venetia Stanley, Asquith, and the secrets stitched across their letters.",
    url: "/",
    siteName: "The Venetia Project",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Venetia Project",
    description: "A data-driven archive of Venetia Stanley, Asquith, and the secrets stitched across their letters.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
