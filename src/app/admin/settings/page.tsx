import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/supabase/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Settings</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Pengaturan toko</h1>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
