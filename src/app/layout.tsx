import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { PublicChrome } from "@/components/layout/public-chrome";
import { getSiteSettings } from "@/lib/supabase/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "INA BEAUTY | Katalog Produk",
  description: "Cantik Alami, Percaya Diri Setiap Hari"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <PublicChrome settings={settings}>{children}</PublicChrome>
        </CartProvider>
      </body>
    </html>
  );
}
