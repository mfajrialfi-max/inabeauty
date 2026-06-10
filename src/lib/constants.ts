import type { SiteSettings } from "@/types/catalog";

export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER || "6281234567890";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "local-settings",
  store_name: "INA BEAUTY",
  slogan: "Cantik Alami, Percaya Diri Setiap Hari",
  whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
  instagram_url: "https://instagram.com/",
  tiktok_url: "https://tiktok.com/",
  default_whatsapp_message:
    "Halo Admin INA BEAUTY, saya ingin bertanya tentang produk."
};

export const PRODUCT_STATUSES = ["active", "draft", "out_of_stock"] as const;
