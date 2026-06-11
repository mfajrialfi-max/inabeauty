import { createHash } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { userHasAdminAccess } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type AttemptState = {
  count: number;
  resetAt: number;
  lockedUntil: number;
};

const loginAttempts = new Map<string, AttemptState>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function getAttemptKey(request: NextRequest, email: string) {
  const ip = getClientIp(request);
  const emailHash = createHash("sha256").update(email.toLowerCase()).digest("hex");

  return `${ip}:${emailHash}`;
}

function getAttemptState(key: string) {
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || current.resetAt <= now) {
    const next = {
      count: 0,
      resetAt: now + ATTEMPT_WINDOW_MS,
      lockedUntil: 0
    };

    loginAttempts.set(key, next);
    return next;
  }

  return current;
}

function recordFailedAttempt(key: string) {
  const state = getAttemptState(key);
  state.count += 1;

  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = Date.now() + LOCKOUT_MS;
    state.count = 0;
  }

  loginAttempts.set(key, state);
}

function clearAttempts(key: string) {
  loginAttempts.delete(key);
}

function genericError(status = 401) {
  return NextResponse.json(
    { message: "Login tidak dapat diproses. Periksa kembali data login." },
    { status }
  );
}

export async function POST(request: NextRequest) {
  let payload: {
    email?: string;
    password?: string;
    website?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return genericError(400);
  }

  const email = (payload.email || "").trim().toLowerCase();
  const password = payload.password || "";
  const attemptKey = getAttemptKey(request, email || "empty");
  const attemptState = getAttemptState(attemptKey);

  if (attemptState.lockedUntil > Date.now()) {
    return NextResponse.json(
      { message: "Login ditunda sementara. Coba lagi beberapa menit lagi." },
      { status: 429 }
    );
  }

  if (payload.website || !email || !password || email.length > 254 || password.length > 256) {
    recordFailedAttempt(attemptKey);
    return genericError(400);
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { message: "Login admin belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const cookiesToSet: Parameters<NextResponse["cookies"]["set"]>[] = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nextCookies) {
          nextCookies.forEach(({ name, value, options }) => {
            cookiesToSet.push([name, value, options]);
          });
        }
      }
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user || !userHasAdminAccess(data.user)) {
    await supabase.auth.signOut();
    recordFailedAttempt(attemptKey);

    const response = genericError();
    cookiesToSet.forEach((cookie) => response.cookies.set(...cookie));
    return response;
  }

  clearAttempts(attemptKey);

  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  cookiesToSet.forEach((cookie) => response.cookies.set(...cookie));

  return response;
}
