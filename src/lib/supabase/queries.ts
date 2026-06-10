import { demoCategories, demoProducts, demoSettings } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTotalStock } from "@/lib/utils";
import type { Category, Product, SiteSettings } from "@/types/catalog";

const productSelect =
  "*, category:categories(*), product_images(*), product_variants(*)";

type ProductFilters = {
  search?: string;
  category?: string;
  filter?: string;
  featuredOnly?: boolean;
};

function mapProduct(item: Record<string, unknown>): Product {
  return {
    ...(item as unknown as Product),
    category: (item.category as Product["category"]) || null,
    product_images: (item.product_images as Product["product_images"]) || [],
    product_variants: (item.product_variants as Product["product_variants"]) || []
  };
}

function filterLocalProducts(filters: ProductFilters = {}) {
  const query = (filters.search || "").toLowerCase();

  return demoProducts.filter((product) => {
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      (product.description || "").toLowerCase().includes(query);
    const matchesCategory =
      !filters.category ||
      product.category?.slug === filters.category ||
      product.category_id === filters.category;
    const matchesFeatured = !filters.featuredOnly || product.is_featured;
    const matchesFilter =
      !filters.filter ||
      filters.filter === "all" ||
      (filters.filter === "promo" && product.is_promo) ||
      (filters.filter === "featured" && product.is_featured) ||
      (filters.filter === "available" && getTotalStock(product) > 0);

    return matchesSearch && matchesCategory && matchesFeatured && matchesFilter;
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return demoSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return demoSettings;
  }

  return data as SiteSettings;
}

export async function getCategories({ includeInactive = false } = {}): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return includeInactive ? demoCategories : demoCategories.filter((category) => category.is_active);
  }

  let query = supabase.from("categories").select("*").order("sort_order", {
    ascending: true
  });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    return includeInactive ? demoCategories : demoCategories.filter((category) => category.is_active);
  }

  return data as Category[];
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return filterLocalProducts(filters);
  }

  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (filters.filter === "promo") {
    query = query.eq("is_promo", true);
  }

  if (filters.filter === "featured") {
    query = query.eq("is_featured", true);
  }

  if (filters.category) {
    const categories = await getCategories();
    const selected = categories.find((category) => category.slug === filters.category);

    if (!selected) {
      return [];
    }

    query = query.eq("category_id", selected.id);
  }

  const { data, error } = await query;

  if (error || !data) {
    return filterLocalProducts(filters);
  }

  const products = data.map((item) => mapProduct(item as Record<string, unknown>));

  if (filters.filter === "available") {
    return products.filter((product) => getTotalStock(product) > 0);
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return demoProducts.find((product) => product.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    return demoProducts.find((product) => product.slug === slug) || null;
  }

  if (!data) {
    return null;
  }

  return mapProduct(data as Record<string, unknown>);
}

export async function getAdminProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return filterLocalProducts(filters);
  }

  let query = supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }

  if (filters.filter && filters.filter !== "all") {
    query = query.eq("status", filters.filter);
  }

  const { data, error } = await query;

  if (error || !data) {
    return filterLocalProducts(filters);
  }

  return data.map((item) => mapProduct(item as Record<string, unknown>));
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return demoProducts.find((product) => product.id === id) || null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return demoProducts.find((product) => product.id === id) || null;
  }

  if (!data) {
    return null;
  }

  return mapProduct(data as Record<string, unknown>);
}

export async function getAdminStats() {
  const products = await getAdminProducts();

  return {
    total: products.length,
    active: products.filter((product) => product.status === "active").length,
    outOfStock: products.filter(
      (product) => product.status === "out_of_stock" || getTotalStock(product) === 0
    ).length,
    promo: products.filter((product) => product.is_promo).length
  };
}
