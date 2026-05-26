import { ChatAgent } from "@/app/components/ChatAgent";
import type { Metadata, Viewport } from "next";
import { Geologica, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const geologica = Geologica({ subsets: ["latin", "cyrillic"], variable: "--font-geologica" });

export const metadata: Metadata = {
  title: "ИнжКапСтрой — Комплексное проектирование «под ключ»",
  description: "ООО ИнжКапСтрой — комплексное проектирование зданий и сооружений. BIM-технологии, ИИ, экспертизы. 50+ специалистов, 400 000 м² реализовано.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0039A6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${geologica.variable}`}>
      <body className={inter.className}>
        {children}
        <ChatAgent />
      </body>
    </html>
  );
}