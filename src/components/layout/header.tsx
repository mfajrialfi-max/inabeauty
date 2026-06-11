"use client";

import Link from "next/link";
import { Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { buildDefaultAdminUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/catalog";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Produk" },
  { href: "/cart", label: "Pesanan" }
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-blush-100/80 bg-white/90 shadow-[0_10px_32px_rgba(45,38,48,0.04)] backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center rounded-full bg-white/80 p-1 ring-1 ring-blush-100 transition hover:bg-blush-50"
          aria-label={settings.store_name}
        >
          <img
            src="/logo.svg"
            alt={settings.store_name}
            className="h-12 w-12 rounded-full object-contain"
          />
        </Link>

        <nav className="hidden items-center rounded-full border border-blush-100 bg-white/80 p-1 shadow-soft md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-bold transition",
                (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                  ? "bg-blush-600 text-white shadow-button"
                  : "text-zinc-600 hover:bg-blush-50 hover:text-blush-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={buildDefaultAdminUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="hidden h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-bold text-white shadow-button transition hover:bg-emerald-600 lg:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Tanya Admin
          </a>
          <Link
            href="/cart"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-blush-100 bg-white text-ink shadow-soft transition hover:bg-blush-50"
            aria-label="Buka pesanan"
            title="Pesanan"
          >
            <ShoppingBag className="h-6 w-6" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-blush-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-blush-100 bg-white text-ink shadow-soft md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Buka menu"
            title="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-blush-100 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-3 py-3 text-sm font-bold",
                  (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                    ? "bg-blush-50 text-blush-700"
                    : "text-zinc-700 hover:bg-blush-50"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
