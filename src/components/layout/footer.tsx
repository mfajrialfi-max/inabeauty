import Link from "next/link";
import { Camera, Megaphone, MessageCircle, Music2, ThumbsUp } from "lucide-react";
import type { SiteSettings } from "@/types/catalog";
import { buildDefaultAdminUrl } from "@/lib/whatsapp";
import { normalizeOptionalUrl } from "@/lib/utils";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socialLinks = [
    {
      label: "Instagram",
      href: normalizeOptionalUrl(settings.instagram_url),
      icon: Camera,
      className: "bg-blush-50 text-blush-700 hover:bg-blush-100"
    },
    {
      label: "TikTok",
      href: normalizeOptionalUrl(settings.tiktok_url),
      icon: Music2,
      className: "bg-zinc-900 text-white hover:bg-zinc-700"
    },
    {
      label: "Facebook",
      href: normalizeOptionalUrl(settings.facebook_url),
      icon: ThumbsUp,
      className: "bg-blue-50 text-blue-700 hover:bg-blue-100"
    },
    {
      label: "Saluran WhatsApp",
      href: normalizeOptionalUrl(settings.whatsapp_channel_url),
      icon: Megaphone,
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
    }
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-blush-100 bg-white pb-24 sm:pb-0">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="max-w-md">
          <img
            src="/logo.svg"
            alt={settings.store_name}
            className="h-20 w-20 rounded-full object-contain"
          />
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Katalog skincare, makeup, fashion wanita, dan aksesoris pilihan untuk
            tampilan natural yang percaya diri.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-ink">Menu</p>
          <div className="mt-4 grid gap-3 text-sm text-zinc-600">
            <Link href="/products" className="hover:text-blush-700">
              Katalog Produk
            </Link>
            <Link href="/cart" className="hover:text-blush-700">
              Pesanan Saya
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-ink">Hubungi</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={buildDefaultAdminUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
              aria-label="WhatsApp INA BEAUTY"
              title="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href || "#"}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${item.className}`}
                aria-label={`${item.label} INA BEAUTY`}
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
