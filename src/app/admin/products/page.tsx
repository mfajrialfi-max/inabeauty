import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { getAdminProducts, getCategories } from "@/lib/supabase/queries";
import { formatCategoryOptionLabel } from "@/lib/utils";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getAdminProducts({
      search: params.q,
      category: params.category,
      filter: params.status
    }),
    getCategories({ includeInactive: true })
  ]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produk</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Kelola produk</h1>
        </div>
        <Link href="/admin/products/new" className="button-primary w-fit">
          <PackagePlus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      <form className="mt-6 grid gap-3 rounded-[8px] border border-zinc-200 bg-white p-3 shadow-soft md:grid-cols-[1fr_220px_180px_auto]">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Cari produk"
            className="input-field pl-11"
          />
        </label>
        <select name="category" defaultValue={params.category || ""} className="input-field">
          <option value="">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {formatCategoryOptionLabel(category, categories)}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={params.status || "all"} className="input-field">
          <option value="all">Semua status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
        <button type="submit" className="button-primary rounded-2xl">
          Filter
        </button>
      </form>

      <div className="mt-6">
        <AdminProductsTable products={products} />
      </div>
    </div>
  );
}
