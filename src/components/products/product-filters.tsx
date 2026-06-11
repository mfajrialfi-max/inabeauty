import { Search } from "lucide-react";
import type { Category } from "@/types/catalog";
import { formatCategoryOptionLabel } from "@/lib/utils";

type ProductFiltersProps = {
  categories: Category[];
  defaultQuery?: string;
  defaultCategory?: string;
  defaultFilter?: string;
};

export function ProductFilters({
  categories,
  defaultQuery,
  defaultCategory,
  defaultFilter
}: ProductFiltersProps) {
  return (
    <form className="grid gap-3 rounded-[8px] border border-blush-100 bg-white p-3 shadow-soft md:grid-cols-[1fr_220px_220px_auto]">
      <label className="relative block">
        <span className="sr-only">Cari produk</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Cari serum, blouse, cushion..."
          className="input-field pl-11"
        />
      </label>

      <label>
        <span className="sr-only">Kategori</span>
        <select name="category" defaultValue={defaultCategory || ""} className="input-field">
          <option value="">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {formatCategoryOptionLabel(category, categories)}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Filter produk</span>
        <select name="filter" defaultValue={defaultFilter || "all"} className="input-field">
          <option value="all">Semua status</option>
          <option value="promo">Promo</option>
          <option value="featured">Best seller</option>
          <option value="available">Tersedia</option>
        </select>
      </label>

      <button type="submit" className="button-primary rounded-2xl px-6">
        Terapkan
      </button>
    </form>
  );
}
