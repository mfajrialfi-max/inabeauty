import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductById, getCategories } from "@/lib/supabase/queries";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories({ includeInactive: true })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-blush-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produk</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Edit produk</h1>
      </div>
      <ProductForm categories={categories} initialProduct={product} />
    </div>
  );
}
