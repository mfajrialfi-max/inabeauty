"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings
} from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    const supabase = getBrowserSupabase();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-ink">
      <aside className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white lg:bottom-0 lg:right-auto lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-3 px-4 lg:h-20 lg:px-6">
          <img src="/logo.svg" alt="INA BEAUTY" className="h-10 w-10 rounded-full object-contain" />
          <div>
            <p className="text-sm font-black">Admin katalog</p>
            <p className="text-xs text-zinc-500">Kelola produk</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-4">
          {links.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-fit items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition lg:w-full",
                  active
                    ? "bg-blush-50 text-blush-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-ink"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-4 py-4 lg:block">
          <div className="rounded-[8px] bg-ink p-4 text-white">
            <BarChart3 className="h-5 w-5 text-blush-200" />
            <p className="mt-3 text-sm font-bold">Kelola katalog</p>
            <p className="mt-1 text-xs leading-5 text-zinc-300">
              Update produk, stok varian, promo, dan nomor WhatsApp.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mx-4 mb-4 hidden w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-100 lg:flex"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="pt-28 lg:pl-72 lg:pt-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
