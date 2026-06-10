"use client";

import type { Product, ProductVariant } from "@/types/catalog";
import { useCart } from "@/context/cart-context";
import { getProductPrice, variantLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  disabled?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
};

export function AddToCartButton({
  product,
  variant,
  quantity,
  disabled,
  compact,
  children
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const stock = variant ? variant.stock : 99;

  return (
    <button
      type="button"
      className={cn(
        compact
          ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-blush-600 text-white shadow-button transition hover:bg-blush-700 disabled:cursor-not-allowed disabled:opacity-50"
          : "button-primary w-full",
      )}
      disabled={disabled || stock <= 0}
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.main_image_url,
          variantId: variant?.id || null,
          variantLabel: variantLabel(variant),
          price: getProductPrice(product),
          quantity,
          stock
        })
      }
      title="Tambah ke pesanan"
    >
      {children || "Tambah ke Pesanan"}
    </button>
  );
}
