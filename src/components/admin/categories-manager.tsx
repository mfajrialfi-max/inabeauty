"use client";

import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/types/catalog";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

type CategoryDraft = Pick<Category, "name" | "slug" | "sort_order" | "is_active"> & {
  id?: string;
};

const emptyCategory: CategoryDraft = {
  name: "",
  slug: "",
  sort_order: 0,
  is_active: true
};

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<CategoryDraft>(emptyCategory);
  const [message, setMessage] = useState("");

  function edit(category: Category) {
    setDraft(category);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }

    const payload = {
      name: draft.name,
      slug: draft.slug || slugify(draft.name),
      sort_order: Number(draft.sort_order || 0),
      is_active: draft.is_active
    };

    const result = draft.id
      ? await supabase.from("categories").update(payload).eq("id", draft.id)
      : await supabase.from("categories").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Kategori berhasil disimpan.");
    setDraft(emptyCategory);
    router.refresh();
  }

  async function remove(category: Category) {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) {
      return;
    }

    const supabase = getBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }

    const { error } = await supabase.from("categories").delete().eq("id", category.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={save} className="h-fit rounded-[8px] border border-zinc-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-ink">
          {draft.id ? "Edit kategori" : "Tambah kategori"}
        </h2>
        <div className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="label-field">Nama kategori</span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.id ? current.slug : slugify(event.target.value)
                }))
              }
              className="input-field"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="label-field">Slug</span>
            <input
              value={draft.slug}
              onChange={(event) =>
                setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))
              }
              className="input-field"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="label-field">Urutan tampil</span>
            <input
              type="number"
              value={draft.sort_order}
              onChange={(event) =>
                setDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))
              }
              className="input-field"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(event) =>
                setDraft((current) => ({ ...current, is_active: event.target.checked }))
              }
              className="h-4 w-4 accent-blush-600"
            />
            Aktif
          </label>
        </div>
        {message ? (
          <p className="mt-4 rounded-2xl bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">
            {message}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button type="submit" className="button-primary flex-1">
            {draft.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Simpan
          </button>
          {draft.id ? (
            <button
              type="button"
              onClick={() => setDraft(emptyCategory)}
              className="button-secondary"
            >
              Batal
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-4">Nama</th>
                <th className="px-4 py-4">Slug</th>
                <th className="px-4 py-4">Urutan</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-4 font-black text-ink">{category.name}</td>
                  <td className="px-4 py-4 text-zinc-600">{category.slug}</td>
                  <td className="px-4 py-4 text-zinc-600">{category.sort_order}</td>
                  <td className="px-4 py-4">
                    <span className="badge bg-zinc-100 text-zinc-700">
                      {category.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => edit(category)}
                        className="button-secondary px-4 py-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(category)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-blush-700 hover:bg-blush-50"
                        aria-label="Hapus kategori"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
