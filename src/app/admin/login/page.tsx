import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-pearl px-4 py-10">
      <div className="w-full max-w-md rounded-[8px] border border-blush-100 bg-white p-6 shadow-soft">
        <div className="mb-6 text-center">
          <img src="/logo.svg" alt="INA BEAUTY" className="mx-auto h-24 w-24 rounded-full object-contain" />
          <h1 className="mt-4 text-2xl font-black text-ink">Login Admin</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Masuk untuk mengelola produk, kategori, dan pengaturan toko.
          </p>
        </div>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
