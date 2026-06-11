# INA BEAUTY

Website katalog produk untuk INA BEAUTY dengan pemesanan via WhatsApp. Stack: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase Auth/Database/Storage, dan localStorage untuk keranjang sementara.

## Fitur MVP

- Home page dengan hero, kategori, produk unggulan, keunggulan toko, dan CTA WhatsApp.
- Katalog produk dengan search, filter kategori, filter promo/best seller/tersedia, empty state, dan tombol tambah pesanan.
- Detail produk dengan galeri, varian, stok per varian, jumlah, tambah pesanan, dan tanya admin via WhatsApp.
- Cart/order page dengan localStorage, form pelanggan, total estimasi, dan generator pesan WhatsApp otomatis.
- Floating WhatsApp button di kanan bawah.
- Admin login Supabase Auth.
- Admin dashboard, CRUD produk, CRUD kategori, dan settings toko.
- SQL schema Supabase + RLS + storage bucket `product-images`.

## Setup

1. Install dependency:

```bash
npm install
```

2. Buat file `.env.local` dari `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER=6281234567890
```

3. Buka Supabase SQL Editor, jalankan isi file:

```bash
supabase/schema.sql
```

4. Buat user admin di Supabase Auth. Setelah user dibuat, beri role admin pada `app_metadata` user tersebut:

```json
{
  "role": "admin"
}
```

Cara cepatnya: setelah user Auth dibuat, ubah email placeholder di file ini menjadi email admin asli, lalu jalankan di Supabase SQL Editor:

```bash
supabase/admin-role.sql
```

RLS dan UI admin sama-sama mensyaratkan `app_metadata.role = "admin"`. `ADMIN_EMAILS` adalah allowlist tambahan yang disimpan di environment variable, bukan ditampilkan di halaman login.

5. Update settings toko di `/admin/settings`, terutama nomor WhatsApp admin.

## Menjalankan

```bash
npm run dev
```

Buka:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

Jika `.env.local` belum diisi, public site tetap tampil memakai data demo lokal. Admin CRUD dan upload gambar memerlukan Supabase aktif.

## Deploy, hosting, dan domain

Rekomendasi paling sederhana untuk project ini:

1. Buat project Supabase, jalankan `supabase/schema.sql`, buat user admin, lalu isi settings toko.
2. Upload project ke GitHub.
3. Deploy ke Vercel sebagai project Next.js.
4. Di Vercel, isi Environment Variables yang sama seperti `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER=...
```

5. Beli domain dari registrar pilihan, misalnya penyedia domain lokal atau internasional.
6. Di Vercel, buka Project Settings > Domains, tambahkan domain, lalu ikuti instruksi DNS yang diberikan Vercel.
7. Di panel domain/registrar, arahkan DNS sesuai instruksi Vercel. Setelah propagasi DNS selesai, website akan aktif memakai domain tersebut.

Catatan: pembelian domain dan akun hosting harus memakai akun/pembayaran pemilik bisnis. Saya bisa bantu menyiapkan file, konfigurasi, deploy, dan mengarahkan domain selama akses akun yang dibutuhkan tersedia.

## Struktur penting

- `src/app` berisi route App Router.
- `src/components` berisi komponen publik, cart, dan admin.
- `src/context/cart-context.tsx` menyimpan keranjang ke localStorage.
- `src/lib/whatsapp.ts` membuat URL dan pesan otomatis WhatsApp.
- `src/lib/supabase` berisi client/server Supabase dan query data.
- `supabase/schema.sql` berisi schema database, RLS, seed settings/kategori, dan storage policy.
