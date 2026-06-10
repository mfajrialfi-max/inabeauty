"use client";

import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductVariant, SiteSettings } from "@/types/catalog";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { buildProductQuestionUrl } from "@/lib/whatsapp";
import {
  formatRupiah,
  getAvailableVariants,
  getProductPrice,
  variantLabel
} from "@/lib/utils";

export function ProductPurchasePanel({
  product,
  settings
}: {
  product: Product;
  settings: SiteSettings;
}) {
  const availableVariants = useMemo(() => getAvailableVariants(product), [product]);
  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id || ""
  );
  const selectedVariant =
    availableVariants.find((variant) => variant.id === selectedVariantId) ||
    availableVariants[0] ||
    null;
  const maxStock = selectedVariant ? selectedVariant.stock : product.status === "active" ? 99 : 0;
  const [quantity, setQuantity] = useState(1);
  const hasPromo = Boolean(product.discount_price && product.discount_price < product.price);
  const disabled = maxStock <= 0 || product.status !== "active";

  function updateQuantity(next: number) {
    setQuantity(Math.min(maxStock || 1, Math.max(1, next)));
  }

  return (
    <div className="rounded-[8px] border border-blush-100 bg-white p-5 shadow-soft">
      <div className="border-b border-blush-100 pb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">
          {product.category?.name || "Produk"}
        </p>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <p className="text-2xl font-black text-blush-700">
            {formatRupiah(getProductPrice(product))}
          </p>
          {hasPromo ? (
            <p className="text-base text-zinc-400 line-through">
              {formatRupiah(product.price)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 py-5">
        <div>
          <p className="label-field">Deskripsi</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {product.description || "Produk pilihan INA BEAUTY."}
          </p>
        </div>

        <div>
          <p className="label-field">Ukuran / Varian</p>
          {availableVariants.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {availableVariants.map((variant: ProductVariant) => (
                <label
                  key={variant.id}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-blush-100 bg-pearl/40 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selectedVariantId === variant.id}
                      onChange={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className="h-4 w-4 accent-blush-600"
                    />
                    <span className="font-semibold text-ink">{variantLabel(variant)}</span>
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    Stok {variant.stock}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-2 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
              Varian standar
            </p>
          )}
        </div>

        <div>
          <p className="label-field">Jumlah</p>
          <div className="mt-3 inline-flex h-12 items-center overflow-hidden rounded-full border border-blush-100 bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              className="flex h-12 w-12 items-center justify-center text-ink hover:bg-blush-50 disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Kurangi jumlah"
              title="Kurangi"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              value={quantity}
              onChange={(event) => updateQuantity(Number(event.target.value))}
              className="h-12 w-16 border-x border-blush-100 text-center text-sm font-bold outline-none"
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              className="flex h-12 w-12 items-center justify-center text-ink hover:bg-blush-50 disabled:opacity-40"
              disabled={quantity >= maxStock}
              aria-label="Tambah jumlah"
              title="Tambah"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
          disabled={disabled}
        >
          <ShoppingBag className="h-4 w-4" />
          Tambah ke Pesanan
        </AddToCartButton>
        <a
          href={buildProductQuestionUrl(product, settings)}
          target="_blank"
          rel="noreferrer"
          className="button-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          Tanya Admin
        </a>
      </div>
    </div>
  );
}
