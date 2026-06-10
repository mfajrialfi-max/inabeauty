import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/catalog";
import { formatRupiah, getAvailableVariants, getProductPrice, getTotalStock } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const totalStock = getTotalStock(product);
  const available = totalStock > 0 && product.status === "active";
  const hasPromo = Boolean(product.discount_price && product.discount_price < product.price);

  return (
    <article className="group overflow-hidden rounded-[8px] border border-blush-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-blush-200">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-blush-50">
          {product.main_image_url ? (
            <img
              src={product.main_image_url}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-pearl p-8 text-center text-sm font-semibold text-blush-700">
              INA BEAUTY
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {hasPromo ? (
              <span className="badge bg-blush-600 text-white">Promo</span>
            ) : null}
            {product.is_featured ? (
              <span className="badge bg-ink text-white">Best Seller</span>
            ) : null}
          </div>
          <span
            className={`badge absolute bottom-3 left-3 ${
              available ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {available ? `Stok ${totalStock}` : "Stok habis"}
          </span>
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
            {product.category?.name || "Produk"}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 line-clamp-2 text-base font-bold text-ink transition hover:text-blush-700">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-lg font-black text-ink">{formatRupiah(getProductPrice(product))}</p>
            {hasPromo ? (
              <p className="text-sm text-zinc-400 line-through">
                {formatRupiah(product.price)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="button-secondary h-11 px-4 py-0"
          >
            <Eye className="h-4 w-4" />
            Detail
          </Link>
          <AddToCartButton
            product={product}
            quantity={1}
            variant={getAvailableVariants(product)[0] || null}
            disabled={!available}
            compact
          >
            <ShoppingBag className="h-4 w-4" />
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
