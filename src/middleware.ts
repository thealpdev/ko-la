import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userRole = session?.user?.user_metadata?.role;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  const isStudentPage = request.nextUrl.pathname.startsWith("/student");

  // 1. Oturum açılmamışsa korumalı sayfalardan girişe yönlendir
  if ((isDashboardPage || isStudentPage) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Oturum açılmışsa ve Giriş sayfasındaysa role göre yönlendir
  if (isAuthPage && session) {
    const target = userRole === "COACH" ? "/dashboard" : "/student";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Role-based erişim kontrolü
  if (isDashboardPage && userRole === "STUDENT") {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (isStudentPage && userRole === "COACH") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/student/:path*", "/login"],
};
