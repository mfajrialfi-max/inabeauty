"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        website
      })
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(data?.message || "Login tidak dapat diproses.");
      return;
    }

    router.replace(searchParams.get("redirectedFrom") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>
      <label className="block space-y-2">
        <span className="label-field">Email</span>
        <span className="relative block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-field pl-11"
            placeholder="nama@email.com"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </span>
      </label>
      <label className="block space-y-2">
        <span className="label-field">Password</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field pl-11"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </span>
      </label>
      {error ? (
        <p className="rounded-2xl bg-blush-50 px-4 py-3 text-sm font-semibold text-blush-700">
          {error}
        </p>
      ) : null}
      <button type="submit" className="button-primary w-full" disabled={loading}>
        {loading ? "Memproses..." : "Login Admin"}
      </button>
    </form>
  );
}
