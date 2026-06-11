"use client";

import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/types/catalog";
import { FloatingCart } from "@/components/layout/floating-cart";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

type PublicChromeProps = {
  children: React.ReactNode;
  settings: SiteSettings;
};

export function PublicChrome({ children, settings }: PublicChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isCart = pathname.startsWith("/cart");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header settings={settings} />
      <main
        className="public-main"
        data-page={isCart ? "cart" : "default"}
        style={
          {
            "--page-bg-image": `url(${
              isCart
                ? "/background/keranjangPembelian.png"
                : "/background/semuaHalamanKecualiKeranjang.png"
            })`
          } as React.CSSProperties
        }
      >
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingCart />
      <FloatingWhatsApp settings={settings} />
      <MobileBottomNav />
    </>
  );
}
