import Link from "next/link";
import { Camera, MessageCircle, Music2 } from "lucide-react";
import type { SiteSettings } from "@/types/catalog";
import { buildDefaultAdminUrl } from "@/lib/whatsapp";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-blush-100 bg-white">
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
            <Link href="/admin/login" className="hover:text-blush-700">
              Admin
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
            {settings.instagram_url ? (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush-50 text-blush-700 transition hover:bg-blush-100"
                aria-label="Instagram INA BEAUTY"
                title="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
            ) : null}
            {settings.tiktok_url ? (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-700"
                aria-label="TikTok INA BEAUTY"
                title="TikTok"
              >
                <Music2 className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
