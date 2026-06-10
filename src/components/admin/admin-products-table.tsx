"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Power, Trash2 } from "lucide-react";
import type { Product } from "@/types/catalog";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { formatRupiah, getProductPrice, getTotalStock } from "@/lib/utils";

export function AdminProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function updateStatus(product: Product) {
    const supabase = getBrowserSupabase();

    if (!supabase) {
      alert("Supabase belum dikonfigurasi.");
      return;
    }

    const nextStatus = product.status === "active" ? "draft" : "active";
    const { error } = await supabase
      .from("products")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(`Hapus produk "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    const supabase = getBrowserSupabase();

    if (!supabase) {
      alert("Supabase belum dikonfigurasi.");
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
        <h2 className="text-xl font-black text-ink">Belum ada produk</h2>
        <p className="mt-2 text-sm text-zinc-500">Tambahkan produk pertama untuk katalog.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="px-4 py-4">Produk</th>
              <th className="px-4 py-4">Kategori</th>
              <th className="px-4 py-4">Harga</th>
              <th className="px-4 py-4">Stok</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-[8px] bg-pearl">
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-black text-ink">{product.name}</p>
                      <p className="text-xs text-zinc-500">/{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-zinc-600">{product.category?.name || "-"}</td>
                <td className="px-4 py-4 font-bold text-ink">
                  {formatRupiah(getProductPrice(product))}
                </td>
                <td className="px-4 py-4 text-zinc-600">{getTotalStock(product)}</td>
                <td className="px-4 py-4">
                  <span className="badge bg-zinc-100 text-zinc-700">{product.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50"
                      aria-label="Edit produk"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => updateStatus(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 hover:bg-zinc-50"
                      aria-label="Aktif/nonaktif produk"
                      title="Aktif/nonaktif"
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-blush-700 hover:bg-blush-50"
                      aria-label="Hapus produk"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
