import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, Product, ProductVariant } from "@/types/catalog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number | null | undefined) {
  const numberValue = Number(value || 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(numberValue);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPrice(product: Pick<Product, "price" | "discount_price">) {
  return product.discount_price && product.discount_price > 0
    ? product.discount_price
    : product.price;
}

export function variantLabel(variant?: ProductVariant | null) {
  if (!variant) {
    return "Standar";
  }

  const parts = [variant.variant_name, variant.size, variant.color].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : "Standar";
}

export function getAvailableVariants(product: Product) {
  return (product.product_variants || []).filter(
    (variant) => variant.is_available && variant.stock > 0
  );
}

export function getTotalStock(product: Product) {
  const variants = product.product_variants || [];

  if (variants.length === 0) {
    return product.status === "active" ? 99 : 0;
  }

  return variants.reduce((total, variant) => {
    if (!variant.is_available) {
      return total;
    }

    return total + Math.max(0, variant.stock);
  }, 0);
}

export function getTopLevelCategories(categories: Category[]) {
  return categories.filter((category) => !category.parent_category_id);
}

export function formatCategoryOptionLabel(category: Category, categories: Category[]) {
  const parent = category.parent_category_id
    ? categories.find((item) => item.id === category.parent_category_id)
    : null;

  return parent ? `${parent.name} / ${category.name}` : category.name;
}

export function normalizeOptionalUrl(value?: string | null) {
  const trimmed = (value || "").trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
