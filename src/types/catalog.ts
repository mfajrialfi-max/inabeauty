export type ProductStatus = "active" | "draft" | "out_of_stock";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_category_id: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  variant_name: string | null;
  size: string | null;
  color: string | null;
  stock: number;
  is_available: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  discount_price: number | null;
  main_image_url: string | null;
  status: ProductStatus;
  is_featured: boolean;
  is_promo: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type SiteSettings = {
  id: string;
  store_name: string;
  slogan: string;
  whatsapp_number: string;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  whatsapp_channel_url: string | null;
  default_whatsapp_message: string | null;
};

export type CartItem = {
  cartId: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  variantId: string | null;
  variantLabel: string;
  price: number;
  quantity: number;
  stock: number;
};

export type CustomerOrder = {
  name: string;
  phone?: string;
  address?: string;
  note?: string;
};
