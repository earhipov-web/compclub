import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
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
  title: "CompClub: компьютерный клуб на 50 мест",
  description:
    "Три класса игровых ПК от 100 ₽ в час, приватная комната на двоих с 4K-мониторами 240 Гц, снек-бар и онлайн-бронь места.",
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
    <html lang="ru" className={`${text.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that scripts run, so entrance animations may hide content until it scrolls in. */}
        <script>{`document.documentElement.classList.add('js')`}</script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
