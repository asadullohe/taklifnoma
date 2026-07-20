import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cormorant_Garamond,
  Pinyon_Script,
  Playfair_Display,
} from "next/font/google";
import { site, title, description, keywords } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pinyon",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

// Sanoqli kunlar raqamlari uchun — kontrastli nafis display serif.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  keywords,
  authors: [{ name: `${site.groom} & ${site.bride}` }],
  applicationName: "Taklifnoma",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: title,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#4a543d",
  width: "device-width",
  initialScale: 1,
};

// schema.org Event — qidiruv tizimlari uchun boy natija (rich result)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: title,
  startDate: site.dateISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description,
  location: {
    "@type": "Place",
    name: site.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.venueAddress,
      addressRegion: "Farg'ona",
      addressCountry: "UZ",
    },
  },
  organizer: { "@type": "Person", name: `${site.groom} & ${site.bride}` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${cormorant.variable} ${pinyon.variable} ${amiri.variable} ${playfair.variable}`}
    >
      <body className="locked">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
