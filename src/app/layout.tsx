import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const text = Onest({
  variable: "--font-text",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Wide, heavy face for the name and the marquee only
const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CompClub: компьютерный клуб на 51 место",
    template: "%s · CompClub",
  },
  description:
    "Общий зал на 25 мест, буткемп на 20 и три VIP-комнаты на двоих. Игровые ПК от 100 ₽ в час, снек-бар и онлайн-бронь места.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${text.variable} ${display.variable}`}>
      <body className="antialiased">
        {children}
        <PageTransition />
      </body>
    </html>
  );
}
