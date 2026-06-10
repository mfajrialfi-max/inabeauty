import Link from "next/link";
import { SearchX } from "lucide-react";

export function EmptyProducts() {
  return (
    <div className="rounded-[8px] border border-dashed border-blush-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush-50 text-blush-700">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-black text-ink">Produk belum ditemukan</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
        Coba ubah kata kunci atau filter kategori. Admin juga bisa menambahkan produk baru
        dari dashboard.
      </p>
      <Link href="/products" className="button-primary mt-6">
        Reset Filter
      </Link>
    </div>
  );
}
