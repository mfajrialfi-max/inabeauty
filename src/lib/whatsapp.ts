import type { CartItem, CustomerOrder, Product, SiteSettings } from "@/types/catalog";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export function normalizeWhatsAppNumber(value?: string | null) {
  const raw = (value || DEFAULT_SETTINGS.whatsapp_number).replace(/\D/g, "");

  if (raw.startsWith("0")) {
    return `62${raw.slice(1)}`;
  }

  return raw;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const number = normalizeWhatsAppNumber(phone);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildDefaultAdminUrl(settings?: SiteSettings | null) {
  const data = settings || DEFAULT_SETTINGS;

  return buildWhatsAppUrl(
    data.whatsapp_number,
    data.default_whatsapp_message || DEFAULT_SETTINGS.default_whatsapp_message || ""
  );
}

export function buildProductQuestionUrl(product: Product, settings?: SiteSettings | null) {
  const data = settings || DEFAULT_SETTINGS;
  const message = `Halo Admin ${data.store_name}, saya ingin bertanya tentang produk ${product.name}.`;

  return buildWhatsAppUrl(data.whatsapp_number, message);
}

export function createOrderMessage(
  customer: CustomerOrder,
  items: CartItem[],
  settings?: SiteSettings | null
) {
  const data = settings || DEFAULT_SETTINGS;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = items.map((item, index) => {
    const subtotal = item.price * item.quantity;

    return [
      `${index + 1}. ${item.name}`,
      `   Varian: ${item.variantLabel}`,
      `   Jumlah: ${item.quantity}`,
      `   Harga: ${formatRupiah(item.price)}`,
      `   Subtotal: ${formatRupiah(subtotal)}`
    ].join("\n");
  });

  return [
    `Halo Admin ${data.store_name}, saya ingin pesan produk berikut:`,
    "",
    "Data Pelanggan:",
    `Nama: ${customer.name}`,
    customer.phone ? `No. WhatsApp: ${customer.phone}` : null,
    customer.address ? `Alamat: ${customer.address}` : null,
    "",
    "Detail Pesanan:",
    lines.join("\n\n"),
    "",
    `Total Estimasi: ${formatRupiah(total)}`,
    customer.note ? `Catatan: ${customer.note}` : null,
    "",
    "Mohon konfirmasi ketersediaan dan total pembayaran. Terima kasih."
  ]
    .filter(Boolean)
    .join("\n");
}
