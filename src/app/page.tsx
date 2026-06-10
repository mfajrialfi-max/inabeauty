import Link from "next/link";
import { ArrowRight, HeartHandshake, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { getCategories, getProducts, getSiteSettings } from "@/lib/supabase/queries";
import { buildDefaultAdminUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ featuredOnly: true })
  ]);

  return (
    <>
      <section className="container-page grid min-h-[calc(100svh-80px)] items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-blush-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blush-700 shadow-soft">
            Katalog kecantikan dan fashion
          </p>
          <h1 className="mt-6 text-5xl font-black leading-tight text-ink sm:text-6xl lg:text-7xl">
            {settings.store_name}
          </h1>
          <p className="mt-5 max-w-xl text-xl font-semibold leading-8 text-zinc-700">
            {settings.slogan}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Temukan skincare, makeup, pakaian wanita, dan aksesoris yang dipilih
            untuk gaya natural, bersih, dan premium. Pilih produk dulu, lalu
            konfirmasi pesanan langsung lewat WhatsApp admin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="button-primary">
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildDefaultAdminUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              Tanya Admin
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-[8px] border border-blush-100 bg-white shadow-soft">
            <div className="aspect-[1.05/1] bg-pearl p-5 sm:aspect-[4/5] sm:p-8">
              <div className="flex h-full flex-col items-center justify-center rounded-[8px] border border-blush-100 bg-white text-center">
                <img
                  src="/logo.svg"
                  alt="INA BEAUTY"
                  className="h-44 w-44 rounded-full object-contain sm:h-56 sm:w-56"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-[8px] border border-blush-100 bg-white p-4 shadow-soft sm:absolute sm:-bottom-5 sm:left-10 sm:mt-0 sm:w-72">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
              Pesan mudah
            </p>
            <p className="mt-1 text-sm font-bold text-ink">
              Pilih varian, isi jumlah, kirim otomatis ke WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                Kategori
              </p>
              <h2 className="mt-2 text-3xl font-black text-ink">Pilih kebutuhanmu</h2>
            </div>
            <Link href="/products" className="button-secondary w-fit">
              Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-[8px] border border-blush-100 bg-pearl p-5 transition hover:-translate-y-1 hover:border-blush-300 hover:bg-white"
              >
                <p className="text-lg font-black text-ink">{category.name}</p>
                <p className="mt-2 text-sm text-zinc-500">Lihat koleksi pilihan</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                Unggulan
              </p>
              <h2 className="mt-2 text-3xl font-black text-ink">Produk favorit</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Produk terkurasi",
              desc: "Pilihan produk kecantikan dan fashion yang mudah dipadukan untuk gaya harian."
            },
            {
              icon: ShieldCheck,
              title: "Konfirmasi stok",
              desc: "Pesanan dikirim ke admin agar stok, varian, dan detail pembelian bisa dipastikan."
            },
            {
              icon: HeartHandshake,
              title: "Layanan personal",
              desc: "Pelanggan bisa bertanya lebih dulu sebelum membeli produk yang paling cocok."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[8px] border border-blush-100 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-50 text-blush-700">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-block">
        <div className="rounded-[8px] bg-ink px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush-200">
              Siap dibantu admin
            </p>
            <h2 className="mt-2 text-3xl font-black">Mulai pilih produk INA BEAUTY</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-200">
              Buat daftar pesanan dari katalog, lalu WhatsApp otomatis akan membawa
              detail pesananmu ke admin.
            </p>
          </div>
          <Link href="/products" className="button-primary mt-6 bg-blush-500 lg:mt-0">
            Lihat Produk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
