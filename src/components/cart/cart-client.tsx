"use client";

import Link from "next/link";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { createOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatRupiah } from "@/lib/utils";
import type { CustomerOrder, SiteSettings } from "@/types/catalog";

export function CartClient({ settings }: { settings: SiteSettings }) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [customer, setCustomer] = useState<CustomerOrder>({
    name: "",
    phone: "",
    address: "",
    note: ""
  });
  const [error, setError] = useState("");

  function updateCustomer(field: keyof CustomerOrder, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function sendOrder() {
    if (items.length === 0) {
      setError("Tambahkan produk ke pesanan terlebih dahulu.");
      return;
    }

    if (!customer.name.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }

    const message = createOrderMessage(customer, items, settings);
    const url = buildWhatsAppUrl(settings.whatsapp_number, message);

    setError("");
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
  }

  return (
    <div className="container-page section-block">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Pesanan</p>
        <h1 className="mt-2 text-3xl font-black text-ink md:text-5xl">Keranjang sementara</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Produk disimpan di browser dengan localStorage. Pesanan final akan dikirim ke
          WhatsApp admin untuk konfirmasi stok dan pembayaran.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.cartId}
                className="grid gap-4 rounded-[8px] border border-blush-100 bg-white p-4 shadow-soft sm:grid-cols-[96px_1fr_auto]"
              >
                <div className="aspect-square overflow-hidden rounded-[8px] bg-pearl">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-blush-700">
                      INA
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-black text-ink hover:text-blush-700"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">{item.variantLabel}</p>
                  <p className="mt-2 text-sm font-bold text-ink">{formatRupiah(item.price)}</p>
                  <p className="mt-1 text-xs text-zinc-400">Stok tersedia {item.stock}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-blush-100">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center hover:bg-blush-50 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      aria-label="Kurangi"
                      title="Kurangi"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center hover:bg-blush-50 disabled:opacity-40"
                      disabled={item.quantity >= item.stock}
                      aria-label="Tambah"
                      title="Tambah"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-ink">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartId)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blush-700 hover:text-blush-900"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[8px] border border-dashed border-blush-200 bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-black text-ink">Belum ada produk</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Pilih produk dari katalog, tentukan varian, lalu kembali ke sini untuk
                mengirim pesanan via WhatsApp.
              </p>
              <Link href="/products" className="button-primary mt-6">
                Lihat Produk
              </Link>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[8px] border border-blush-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">Data pelanggan</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="label-field">Nama wajib</span>
              <input
                value={customer.name}
                onChange={(event) => updateCustomer("name", event.target.value)}
                className="input-field"
                placeholder="Nama lengkap"
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Nomor WhatsApp opsional</span>
              <input
                value={customer.phone}
                onChange={(event) => updateCustomer("phone", event.target.value)}
                className="input-field"
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Alamat opsional</span>
              <textarea
                value={customer.address}
                onChange={(event) => updateCustomer("address", event.target.value)}
                className="input-field min-h-24 resize-y"
                placeholder="Alamat pengiriman"
              />
            </label>
            <label className="block space-y-2">
              <span className="label-field">Catatan pesanan opsional</span>
              <textarea
                value={customer.note}
                onChange={(event) => updateCustomer("note", event.target.value)}
                className="input-field min-h-24 resize-y"
                placeholder="Contoh: warna alternatif, jam kirim, dan lainnya"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[8px] bg-pearl p-4">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>Total estimasi</span>
              <span className="text-xl font-black text-ink">{formatRupiah(total)}</span>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">
              {error}
            </p>
          ) : null}

          <button type="button" onClick={sendOrder} className="button-primary mt-5 w-full">
            <MessageCircle className="h-4 w-4" />
            Pesan via WhatsApp
          </button>
        </aside>
      </div>
    </div>
  );
}
