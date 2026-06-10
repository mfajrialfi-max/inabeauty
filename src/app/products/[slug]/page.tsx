import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductCard } from "@/components/products/product-card";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/supabase/queries";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings()
  ]);

  if (!product) {
    notFound();
  }

  const related = (await getProducts({ category: product.category?.slug }))
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-page section-block">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-blush-700 hover:text-blush-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke katalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} settings={settings} />
      </div>

      {related.length > 0 ? (
        <section className="pt-14">
          <h2 className="text-2xl font-black text-ink">Produk terkait</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
