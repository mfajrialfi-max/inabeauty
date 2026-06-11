import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { userHasAdminAccess } from "@/lib/admin-auth";

function hasRealSupabaseEnv(url?: string, key?: string) {
  return Boolean(
    url &&
      key &&
      !url.includes("your-project.supabase.co") &&
      key !== "your-anon-key"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasRealSupabaseEnv(supabaseUrl, supabaseKey)) {
    if (isLoginRoute) {
      return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirectedFrom", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next({
    request
  });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAllowedAdmin = userHasAdminAccess(user);

  if (!isLoginRoute && !isAllowedAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirectedFrom", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && isAllowedAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
