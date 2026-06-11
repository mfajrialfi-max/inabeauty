"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function FloatingCart() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 left-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-white text-ink shadow-button ring-1 ring-blush-100 transition hover:-translate-y-0.5 hover:bg-blush-50 focus:outline-none focus:ring-4 focus:ring-blush-200 sm:inline-flex"
      aria-label="Buka keranjang"
      title="Keranjang"
    >
      <ShoppingBag className="h-7 w-7" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-blush-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
