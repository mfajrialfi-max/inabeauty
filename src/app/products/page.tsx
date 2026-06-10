import { EmptyProducts } from "@/components/products/empty-products";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { getCategories, getProducts } from "@/lib/supabase/queries";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    filter?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: params.q,
      category: params.category,
      filter: params.filter
    })
  ]);

  return (
    <div className="container-page section-block">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Katalog</p>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-5xl">Produk INA BEAUTY</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Cari produk, pilih kategori, dan tambahkan item tersedia ke pesanan sementara.
        </p>
      </div>

      <ProductFilters
        categories={categories}
        defaultQuery={params.q}
        defaultCategory={params.category}
        defaultFilter={params.filter}
      />

      <div className="mt-8">
        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyProducts />
        )}
      </div>
    </div>
  );
}
