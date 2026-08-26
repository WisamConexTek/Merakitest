import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Display — geometric grotesque, sentence case. Reads as engineering
   rather than advertising, which is the whole brief. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/* Body / UI */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Machine voice — layer codes, timestamps, metric readouts */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const DESCRIPTION =
  "Meraki-IT designs, builds and defends IT infrastructure — consolidation, data centre transformation, network services and 24/7 managed security. An MSSP running on AttackMetricX, Cloudflare and Acronis, from Greensboro, NC.";

export const metadata: Metadata = {
  metadataBase: new URL('https://meraki-it.com'),
  title: "Meraki-IT — Information Technology Simplified",
  description: DESCRIPTION,
  keywords: [
    "Meraki-IT",
    "IT Infrastructure",
    "Cyber Security",
    "MSSP",
    "Managed Security Services",
    "Data Center Transformation",
    "Network Services",
    "Helpdesk Support",
    "Greensboro NC",
  ],
  authors: [{ name: "Meraki-IT" }],
  icons: { icon: "/Meraki-IT-Logo-01.png" },
  openGraph: {
    title: "Meraki-IT — Information Technology Simplified",
    description: DESCRIPTION,
    url: '/',
    siteName: 'Meraki-IT',
    type: "website",
    images: [
      {
        url: "/Meraki-IT-Logo-01.png",
        width: 1200,
        height: 630,
        alt: "Meraki-IT Logo",
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Meraki-IT — Information Technology Simplified",
    description: DESCRIPTION,
    images: ["/Meraki-IT-Logo-01.png"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Meraki-IT",
  "url": "https://meraki-it.com",
  "logo": "https://meraki-it.com/Meraki-IT-Logo-01.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-888-499-9880",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.linkedin.com/company/mrkitusa/"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
