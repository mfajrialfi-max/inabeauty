import { MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/types/catalog";
import { buildDefaultAdminUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp({ settings }: { settings: SiteSettings }) {
  return (
    <a
      href={buildDefaultAdminUrl(settings)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-button transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-5"
      aria-label="Tanya admin via WhatsApp"
      title="Tanya Admin"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
