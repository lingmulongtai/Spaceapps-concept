import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useLocaleStore } from "@/store/useLocaleStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbital Imagery Exploration Toolkit",
  description:
    "Orbital imagery workbench for NASA GIBS time-series datasets, annotations, and translation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocaleStore.getState().locale;

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0f0f10] text-[#ededed] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
