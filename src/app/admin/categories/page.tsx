import { CategoriesManager } from "@/components/admin/categories-manager";
import { getCategories } from "@/lib/supabase/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ includeInactive: true });

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Kategori</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Kelola kategori</h1>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
