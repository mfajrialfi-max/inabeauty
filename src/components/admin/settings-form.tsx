"use client";

import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useState } from "react";
import type { SiteSettings } from "@/types/catalog";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { normalizeOptionalUrl } from "@/lib/utils";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: keyof SiteSettings, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }

    setSaving(true);
    setMessage("");

    const instagramUrl = normalizeOptionalUrl(form.instagram_url);
    const tiktokUrl = normalizeOptionalUrl(form.tiktok_url);
    const facebookUrl = normalizeOptionalUrl(form.facebook_url);
    const whatsappChannelUrl = normalizeOptionalUrl(form.whatsapp_channel_url);
    const urlFields = [
      ["Instagram", form.instagram_url, instagramUrl],
      ["TikTok", form.tiktok_url, tiktokUrl],
      ["Facebook", form.facebook_url, facebookUrl],
      ["Saluran WhatsApp", form.whatsapp_channel_url, whatsappChannelUrl]
    ];
    const invalidUrl = urlFields.find(([, raw, normalized]) => raw && !normalized);

    if (invalidUrl) {
      setSaving(false);
      setMessage(`${invalidUrl[0]} harus berupa link yang valid.`);
      return;
    }

    const payload = {
      store_name: form.store_name,
      slogan: form.slogan,
      whatsapp_number: form.whatsapp_number,
      instagram_url: instagramUrl,
      tiktok_url: tiktokUrl,
      facebook_url: facebookUrl,
      whatsapp_channel_url: whatsappChannelUrl,
      default_whatsapp_message: form.default_whatsapp_message || null
    };

    const result =
      form.id === "local-settings"
        ? await supabase.from("site_settings").insert(payload)
        : await supabase.from("site_settings").update(payload).eq("id", form.id);

    setSaving(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Settings berhasil disimpan.");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="label-field">Nama toko</span>
          <input
            value={form.store_name}
            onChange={(event) => update("store_name", event.target.value)}
            className="input-field"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="label-field">Nomor WhatsApp admin</span>
          <input
            value={form.whatsapp_number}
            onChange={(event) => update("whatsapp_number", event.target.value)}
            className="input-field"
            placeholder="628xxxxxxxxxx"
            required
          />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="label-field">Slogan</span>
          <input
            value={form.slogan}
            onChange={(event) => update("slogan", event.target.value)}
            className="input-field"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="label-field">Instagram URL</span>
          <input
            value={form.instagram_url || ""}
            onChange={(event) => update("instagram_url", event.target.value)}
            className="input-field"
            placeholder="https://instagram.com/..."
          />
        </label>
        <label className="block space-y-2">
          <span className="label-field">TikTok URL</span>
          <input
            value={form.tiktok_url || ""}
            onChange={(event) => update("tiktok_url", event.target.value)}
            className="input-field"
            placeholder="https://tiktok.com/@..."
          />
        </label>
        <label className="block space-y-2">
          <span className="label-field">Facebook URL</span>
          <input
            value={form.facebook_url || ""}
            onChange={(event) => update("facebook_url", event.target.value)}
            className="input-field"
            placeholder="https://facebook.com/..."
          />
        </label>
        <label className="block space-y-2">
          <span className="label-field">Saluran WhatsApp URL</span>
          <input
            value={form.whatsapp_channel_url || ""}
            onChange={(event) => update("whatsapp_channel_url", event.target.value)}
            className="input-field"
            placeholder="https://whatsapp.com/channel/..."
          />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="label-field">Pesan default WhatsApp</span>
          <textarea
            value={form.default_whatsapp_message || ""}
            onChange={(event) => update("default_whatsapp_message", event.target.value)}
            className="input-field min-h-28 resize-y"
          />
        </label>
      </div>
      {message ? (
        <p className="mt-4 rounded-2xl bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">
          {message}
        </p>
      ) : null}
      <button type="submit" className="button-primary mt-5" disabled={saving}>
        <Save className="h-4 w-4" />
        {saving ? "Menyimpan..." : "Simpan Settings"}
      </button>
    </form>
  );
}
