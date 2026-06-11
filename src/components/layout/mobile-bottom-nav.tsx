"use client";

import Link from "next/link";
import { Home, PackageSearch, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Produk", icon: PackageSearch },
  { href: "/cart", label: "Keranjang", icon: ShoppingBag }
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-blush-100 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 shadow-[0_-12px_32px_rgba(45,38,48,0.08)] backdrop-blur-xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const badge = item.href === "/cart" && count > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition",
                active ? "bg-blush-50 text-blush-700" : "text-zinc-500 hover:bg-blush-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {badge ? (
                <span className="absolute right-7 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blush-600 px-1 text-[10px] text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
