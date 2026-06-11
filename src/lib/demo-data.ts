import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { Category, Product, ProductVariant } from "@/types/catalog";

export const demoCategories: Category[] = [
  {
    id: "cat-skincare",
    name: "Skincare",
    slug: "skincare",
    parent_category_id: null,
    sort_order: 1,
    is_active: true
  },
  {
    id: "cat-makeup",
    name: "Makeup",
    slug: "makeup",
    parent_category_id: null,
    sort_order: 2,
    is_active: true
  },
  {
    id: "cat-fashion",
    name: "Fashion Wanita",
    slug: "fashion-wanita",
    parent_category_id: null,
    sort_order: 3,
    is_active: true
  },
  {
    id: "cat-accessories",
    name: "Aksesoris",
    slug: "aksesoris",
    parent_category_id: null,
    sort_order: 4,
    is_active: true
  },
  {
    id: "cat-skincare-serum",
    name: "Serum",
    slug: "serum",
    parent_category_id: "cat-skincare",
    sort_order: 11,
    is_active: true
  },
  {
    id: "cat-fashion-blouse",
    name: "Blouse",
    slug: "blouse",
    parent_category_id: "cat-fashion",
    sort_order: 31,
    is_active: true
  }
];

const variants: Record<string, ProductVariant[]> = {
  serum: [
    {
      id: "var-serum-30",
      product_id: "prod-serum",
      variant_name: "Bright Glow",
      size: "30 ml",
      color: null,
      stock: 18,
      is_available: true
    },
    {
      id: "var-serum-50",
      product_id: "prod-serum",
      variant_name: "Bright Glow",
      size: "50 ml",
      color: null,
      stock: 8,
      is_available: true
    }
  ],
  cushion: [
    {
      id: "var-cushion-light",
      product_id: "prod-cushion",
      variant_name: "Natural Satin",
      size: "15 g",
      color: "Light",
      stock: 12,
      is_available: true
    },
    {
      id: "var-cushion-medium",
      product_id: "prod-cushion",
      variant_name: "Natural Satin",
      size: "15 g",
      color: "Medium",
      stock: 0,
      is_available: false
    }
  ],
  blouse: [
    {
      id: "var-blouse-s",
      product_id: "prod-blouse",
      variant_name: "Soft Linen",
      size: "S",
      color: "Ivory",
      stock: 5,
      is_available: true
    },
    {
      id: "var-blouse-m",
      product_id: "prod-blouse",
      variant_name: "Soft Linen",
      size: "M",
      color: "Ivory",
      stock: 7,
      is_available: true
    }
  ],
  bracelet: [
    {
      id: "var-bracelet-gold",
      product_id: "prod-bracelet",
      variant_name: "Pearl Charm",
      size: "Adjustable",
      color: "Gold",
      stock: 16,
      is_available: true
    }
  ]
};

export const demoProducts: Product[] = [
  {
    id: "prod-serum",
    name: "Radiant Dew Serum",
    slug: "radiant-dew-serum",
    description:
      "Serum ringan untuk membantu kulit tampak lebih lembap, segar, dan bercahaya alami sepanjang hari.",
    category_id: "cat-skincare-serum",
    price: 145000,
    discount_price: 119000,
    main_image_url:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
    status: "active",
    is_featured: true,
    is_promo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: demoCategories[4],
    product_images: [
      {
        id: "img-serum-1",
        product_id: "prod-serum",
        image_url:
          "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
        sort_order: 0
      }
    ],
    product_variants: variants.serum
  },
  {
    id: "prod-cushion",
    name: "Velvet Skin Cushion",
    slug: "velvet-skin-cushion",
    description:
      "Cushion dengan hasil satin natural untuk tampilan kulit halus, ringan, dan siap beraktivitas.",
    category_id: "cat-makeup",
    price: 185000,
    discount_price: null,
    main_image_url:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    status: "active",
    is_featured: true,
    is_promo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: demoCategories[1],
    product_images: [],
    product_variants: variants.cushion
  },
  {
    id: "prod-blouse",
    name: "Mira Soft Linen Blouse",
    slug: "mira-soft-linen-blouse",
    description:
      "Blouse wanita dengan bahan nyaman dan potongan clean untuk gaya feminin yang tetap effortless.",
    category_id: "cat-fashion-blouse",
    price: 229000,
    discount_price: 199000,
    main_image_url:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80",
    status: "active",
    is_featured: true,
    is_promo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: demoCategories[5],
    product_images: [],
    product_variants: variants.blouse
  },
  {
    id: "prod-bracelet",
    name: "Pearl Charm Bracelet",
    slug: "pearl-charm-bracelet",
    description:
      "Gelang aksen mutiara dengan detail elegan untuk melengkapi tampilan harian maupun acara spesial.",
    category_id: "cat-accessories",
    price: 89000,
    discount_price: null,
    main_image_url:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    status: "active",
    is_featured: false,
    is_promo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: demoCategories[3],
    product_images: [],
    product_variants: variants.bracelet
  }
];

export const demoSettings = DEFAULT_SETTINGS;
