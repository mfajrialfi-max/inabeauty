"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

const LOGIN_ATTEMPTS_KEY = "ina-beauty-admin-login-attempts";
const LOGIN_LOCKED_UNTIL_KEY = "ina-beauty-admin-login-locked-until";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lockedUntil = Number(window.localStorage.getItem(LOGIN_LOCKED_UNTIL_KEY) || 0);

    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
      setError(`Terlalu banyak percobaan. Coba lagi sekitar ${minutesLeft} menit.`);
      return;
    }

    const supabase = getBrowserSupabase();

    if (!supabase) {
      setError("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (signInError) {
      const attempts = Number(window.localStorage.getItem(LOGIN_ATTEMPTS_KEY) || 0) + 1;
      window.localStorage.setItem(LOGIN_ATTEMPTS_KEY, String(attempts));

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        window.localStorage.setItem(
          LOGIN_LOCKED_UNTIL_KEY,
          String(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        );
        window.localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
        setError(`Login dikunci sementara selama ${LOCKOUT_MINUTES} menit.`);
        return;
      }

      setError("Email atau password admin tidak sesuai.");
      return;
    }

    window.localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    window.localStorage.removeItem(LOGIN_LOCKED_UNTIL_KEY);
    router.replace(searchParams.get("redirectedFrom") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="block space-y-2">
        <span className="label-field">Email admin</span>
        <span className="relative block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-field pl-11"
            placeholder="muhammadfajrialkhafizi@gmail.com"
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
