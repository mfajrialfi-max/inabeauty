"use client";

import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/types/catalog";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Header } from "@/components/layout/header";

type PublicChromeProps = {
  children: React.ReactNode;
  settings: SiteSettings;
};

export function PublicChrome({ children, settings }: PublicChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
