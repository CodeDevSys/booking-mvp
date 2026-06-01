import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "https://nexora.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEXORA | AI-Powered Scheduling & Automation",
    template: "%s | NEXORA",
  },
  description:
    "NEXORA helps businesses automate appointments and workflows using AI systems. Smart booking, dashboards, and Stripe-powered subscriptions.",
  keywords: [
    "appointment scheduling",
    "SaaS",
    "AI automation",
    "business booking",
    "NEXORA",
    "Terminbuchung",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "NEXORA | AI-Powered Scheduling",
    description: "Automate appointments and workflows for modern businesses.",
    type: "website",
    locale: "de_DE",
    siteName: "NEXORA",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXORA | AI-Powered Scheduling",
    description: "Automate appointments and workflows for modern businesses.",
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
