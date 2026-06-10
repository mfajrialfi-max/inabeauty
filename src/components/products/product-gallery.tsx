"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => {
    const collection = [
      product.main_image_url,
      ...(product.product_images || []).map((image) => image.image_url)
    ].filter(Boolean) as string[];

    return Array.from(new Set(collection));
  }, [product]);
  const [active, setActive] = useState(images[0] || null);

  return (
    <div className="space-y-3">
      <div className="aspect-[4/5] overflow-hidden rounded-[8px] border border-blush-100 bg-white shadow-soft">
        {active ? (
          <img src={active} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-pearl text-sm font-bold text-blush-700">
            INA BEAUTY
          </div>
        )}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className={cn(
                "aspect-square overflow-hidden rounded-[8px] border bg-white",
                active === image ? "border-blush-500" : "border-blush-100"
              )}
              aria-label="Pilih foto produk"
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
