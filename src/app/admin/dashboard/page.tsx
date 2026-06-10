import Link from "next/link";
import { AlertCircle, BadgePercent, PackageCheck, PackagePlus, ShoppingBag } from "lucide-react";
import { getAdminStats } from "@/lib/supabase/queries";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const cards = [
    { label: "Total produk", value: stats.total, icon: ShoppingBag },
    { label: "Produk aktif", value: stats.active, icon: PackageCheck },
    { label: "Stok habis", value: stats.outOfStock, icon: AlertCircle },
    { label: "Produk promo", value: stats.promo, icon: BadgePercent }
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Ringkasan toko</h1>
        </div>
        <Link href="/admin/products/new" className="button-primary w-fit">
          <PackagePlus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-500">{card.label}</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-50 text-blush-700">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-4xl font-black text-ink">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
