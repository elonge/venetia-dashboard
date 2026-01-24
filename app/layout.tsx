import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import MixpanelAnalytics from "@/components/analytics/MixpanelAnalytics";
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
    default: "The Venetia Project | The Secret Letters of H.H. Asquith",
    template: "%s | The Venetia Project",
  },
  description: "Explore the secret correspondence between Prime Minister H.H. Asquith and Venetia Stanley. An interactive archive of 500+ letters, diaries, and social networks from 1912–1915.",
  applicationName: "The Venetia Project",
  keywords: ["Venetia Stanley", "H.H. Asquith", "WWI", "History", "Letters", "Archive", "AI", "Data Visualization", "Edwardian Era", "Politics"],
  authors: [{ name: "The Venetia Project Team" }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },  
  openGraph: {
    title: "The Venetia Project",
    description: "A data-driven archive of Venetia Stanley, Asquith, and the secrets stitched across their letters.",
    url: "/",
    siteName: "The Venetia Project",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: '/og-image.jpg', // Make sure this image exists in /public (1200x630px is best)
        width: 1200,
        height: 630,
        alt: "The Venetia Project - Digital Archive",
      },
    ],    
  },
  twitter: {
    card: "summary_large_image",
    title: "The Venetia Project",
    description: "Explore the secret correspondence between Prime Minister H.H. Asquith and Venetia Stanley. An interactive archive from 1912–1915.",
    images: ['/og-image.jpg'], 
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Venetia Project',
    alternateName: ['TVP', 'Venetia Project'], // Optional short names
    url: 'https://www.thevenetiaproject.com/',
  };  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <MixpanelAnalytics />
        {children}
      </body>
    </html>
  );
}
