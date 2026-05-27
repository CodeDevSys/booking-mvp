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

export const metadata: Metadata = {
  title: "NEXORA | AI-Powered Scheduling & Automation",
  description:
    "NEXORA helps businesses automate appointments and workflows using AI systems. Smart booking, dashboards, and Stripe-powered subscriptions.",
  keywords: [
    "appointment scheduling",
    "SaaS",
    "AI automation",
    "business booking",
    "NEXORA",
  ],
  openGraph: {
    title: "NEXORA | AI-Powered Scheduling",
    description: "Automate appointments and workflows for modern businesses.",
    type: "website",
  },
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
