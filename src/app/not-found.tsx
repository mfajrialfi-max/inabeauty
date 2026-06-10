import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page section-block text-center">
      <h1 className="text-4xl font-black text-ink">Halaman tidak ditemukan</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
        Produk atau halaman yang kamu cari belum tersedia.
      </p>
      <Link href="/products" className="button-primary mt-6">
        Kembali ke Katalog
      </Link>
    </div>
  );
}
