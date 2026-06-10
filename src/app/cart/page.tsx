import { CartClient } from "@/components/cart/cart-client";
import { getSiteSettings } from "@/lib/supabase/queries";

export default async function CartPage() {
  const settings = await getSiteSettings();

  return <CartClient settings={settings} />;
}
