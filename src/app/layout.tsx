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
    type: "website",
    images: ["/Meraki-IT-Logo-01.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
