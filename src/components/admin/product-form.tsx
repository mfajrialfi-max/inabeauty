"use client";

import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Product, ProductImage, ProductStatus, ProductVariant } from "@/types/catalog";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { formatCategoryOptionLabel, slugify } from "@/lib/utils";

type DraftVariant = Omit<ProductVariant, "id" | "product_id"> & {
  id?: string;
};

type DraftImage = Pick<ProductImage, "image_url" | "sort_order"> & {
  id?: string;
};

type ProductFormProps = {
  categories: Category[];
  initialProduct?: Product | null;
};

const emptyVariant: DraftVariant = {
  variant_name: "",
  size: "",
  color: "",
  stock: 0,
  is_available: true
};

async function uploadImage(file: File, slug: string) {
  const supabase = getBrowserSupabase();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `products/${slug}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);

  return data.publicUrl;
}

export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || "");
  const [price, setPrice] = useState(String(initialProduct?.price || ""));
  const [discountPrice, setDiscountPrice] = useState(
    initialProduct?.discount_price ? String(initialProduct.discount_price) : ""
  );
  const [mainImageUrl, setMainImageUrl] = useState(initialProduct?.main_image_url || "");
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || "active");
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.is_featured));
  const [isPromo, setIsPromo] = useState(Boolean(initialProduct?.is_promo));
  const [variants, setVariants] = useState<DraftVariant[]>(
    initialProduct?.product_variants?.length
      ? initialProduct.product_variants.map((variant) => ({ ...variant }))
      : [{ ...emptyVariant }]
  );
  const [images, setImages] = useState<DraftImage[]>(
    initialProduct?.product_images?.map((image) => ({
      id: image.id,
      image_url: image.image_url,
      sort_order: image.sort_order
    })) || []
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const generatedSlug = useMemo(() => slugify(name), [name]);

  function updateName(value: string) {
    setName(value);

    if (!isEditing || slug === generatedSlug || !slug) {
      setSlug(slugify(value));
    }
  }

  function updateVariant(index: number, field: keyof DraftVariant, value: string | number | boolean) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      )
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = getBrowserSupabase();

      if (!supabase) {
        throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
      }

      const form = new FormData(event.currentTarget);
      const mainFile = form.get("main_image") as File | null;
      const galleryFiles = form.getAll("gallery_images").filter((file): file is File => {
        return file instanceof File && file.size > 0;
      });
      const finalSlug = slug || slugify(name);
      let finalMainImageUrl = mainImageUrl;

      if (mainFile && mainFile.size > 0) {
        finalMainImageUrl = await uploadImage(mainFile, finalSlug);
      }

      const uploadedGallery = await Promise.all(
        galleryFiles.map((file, index) => uploadImage(file, `${finalSlug}-gallery-${index}`))
      );
      const finalImages: DraftImage[] = [
        ...images,
        ...uploadedGallery.map((imageUrl, index) => ({
          image_url: imageUrl,
          sort_order: images.length + index
        }))
      ];

      const payload = {
        name,
        slug: finalSlug,
        description,
        category_id: categoryId || null,
        price: Number(price || 0),
        discount_price: discountPrice ? Number(discountPrice) : null,
        main_image_url: finalMainImageUrl || null,
        status,
        is_featured: isFeatured,
        is_promo: isPromo,
        updated_at: new Date().toISOString()
      };

      const productResult = isEditing
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", initialProduct!.id)
            .select("id")
            .single()
        : await supabase
            .from("products")
            .insert(payload)
            .select("id")
            .single();

      if (productResult.error) {
        throw productResult.error;
      }

      const productId = productResult.data.id as string;

      await supabase.from("product_variants").delete().eq("product_id", productId);

      const cleanVariants = variants
        .filter((variant) => variant.variant_name || variant.size || variant.color || variant.stock > 0)
        .map((variant) => ({
          product_id: productId,
          variant_name: variant.variant_name || null,
          size: variant.size || null,
          color: variant.color || null,
          stock: Number(variant.stock || 0),
          is_available: Boolean(variant.is_available)
        }));

      if (cleanVariants.length > 0) {
        const { error } = await supabase.from("product_variants").insert(cleanVariants);

        if (error) {
          throw error;
        }
      }

      await supabase.from("product_images").delete().eq("product_id", productId);

      if (finalImages.length > 0) {
        const { error } = await supabase.from("product_images").insert(
          finalImages.map((image, index) => ({
            product_id: productId,
            image_url: image.image_url,
            sort_order: index
          }))
        );

        if (error) {
          throw error;
        }
      }

      setMessage("Produk berhasil disimpan.");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">Informasi produk</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 sm:col-span-2">
              <span className="label-field">Nama produk</span>
              <input
                value={name}
                onChange={(event) => updateName(event.target.value)}
                className="input-field"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Slug</span>
              <input
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                className="input-field"
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Kategori</span>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="input-field"
              >
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {formatCategoryOptionLabel(category, categories)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="label-field">Harga</span>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="input-field"
                min={0}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Harga promo opsional</span>
              <input
                type="number"
                value={discountPrice}
                onChange={(event) => setDiscountPrice(event.target.value)}
                className="input-field"
                min={0}
              />
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="label-field">Deskripsi</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="input-field min-h-36 resize-y"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-ink">Varian</h2>
            <button
              type="button"
              onClick={() => setVariants((current) => [...current, { ...emptyVariant }])}
              className="button-secondary px-4 py-2"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="rounded-[8px] border border-zinc-100 bg-zinc-50 p-4">
                <div className="grid gap-3 sm:grid-cols-4">
                  <input
                    value={variant.variant_name || ""}
                    onChange={(event) => updateVariant(index, "variant_name", event.target.value)}
                    className="input-field"
                    placeholder="Nama varian"
                  />
                  <input
                    value={variant.size || ""}
                    onChange={(event) => updateVariant(index, "size", event.target.value)}
                    className="input-field"
                    placeholder="Ukuran"
                  />
                  <input
                    value={variant.color || ""}
                    onChange={(event) => updateVariant(index, "color", event.target.value)}
                    className="input-field"
                    placeholder="Warna"
                  />
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(event) => updateVariant(index, "stock", Number(event.target.value))}
                    className="input-field"
                    placeholder="Stok"
                    min={0}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
                    <input
                      type="checkbox"
                      checked={variant.is_available}
                      onChange={(event) => updateVariant(index, "is_available", event.target.checked)}
                      className="h-4 w-4 accent-blush-600"
                    />
                    Tersedia
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="inline-flex items-center gap-1 text-sm font-bold text-blush-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">Status</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="label-field">Status produk</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as ProductStatus)}
                className="input-field"
              >
                {PRODUCT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                className="h-4 w-4 accent-blush-600"
              />
              Featured / best seller
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
              <input
                type="checkbox"
                checked={isPromo}
                onChange={(event) => setIsPromo(event.target.checked)}
                className="h-4 w-4 accent-blush-600"
              />
              Promo
            </label>
          </div>
        </section>

        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">Gambar</h2>
          <div className="mt-5 space-y-4">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt="Main product"
                className="aspect-[4/3] w-full rounded-[8px] object-cover"
              />
            ) : null}
            <label className="block space-y-2">
              <span className="label-field">URL gambar utama</span>
              <input
                value={mainImageUrl}
                onChange={(event) => setMainImageUrl(event.target.value)}
                className="input-field"
                placeholder="https://..."
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Upload gambar utama</span>
              <input name="main_image" type="file" accept="image/*" className="input-field" />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Upload galeri</span>
              <input
                name="gallery_images"
                type="file"
                accept="image/*"
                multiple
                className="input-field"
              />
            </label>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={`${image.image_url}-${index}`} className="relative">
                    <img
                      src={image.image_url}
                      alt=""
                      className="aspect-square rounded-[8px] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
                      }
                      className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-blush-700 shadow"
                      aria-label="Hapus gambar"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {message ? (
          <p className="rounded-2xl bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">
            {message}
          </p>
        ) : null}

        <button type="submit" disabled={saving} className="button-primary w-full">
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </aside>
    </form>
  );
}
