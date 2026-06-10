"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { SiteSettings } from "@/types/catalog";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Produk" },
  { href: "/cart", label: "Pesanan" }
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-blush-100/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between py-3">
        <Link href="/" className="flex min-w-0 items-center" aria-label={settings.store_name}>
          <img
            src="/logo.svg"
            alt={settings.store_name}
            className="h-14 w-14 rounded-full object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-blush-50 hover:text-blush-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-blush-100 bg-white text-ink transition hover:bg-blush-50"
            aria-label="Buka pesanan"
            title="Pesanan"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blush-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blush-100 bg-white text-ink md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Buka menu"
            title="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-blush-100 bg-white md:hidden">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-3 text-sm font-semibold text-zinc-700 hover:bg-blush-50"
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
