import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

function applySecurityHeaders(
  response: NextResponse,
  pathname: string,
): NextResponse {
  const isAdmin = pathname.startsWith("/admin");
  
  // Для landing.html НЕ применяем CSP
  const isLanding = pathname === "/" || pathname === "/landing.html" || pathname === "/index.html";
  
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", isAdmin ? "DENY" : "SAMEORIGIN");  
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  
  // Применяем CSP только для НЕ landing страниц
  if (!isLanding && !isDev) {
    // Минимальный CSP для остальных страниц
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );
  }

  if (!isDev) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

function enforceHttps(request: NextRequest): NextResponse | null {
  if (isDev) return null;

  const proto = request.headers.get("x-forwarded-proto");
  if (proto && proto.split(",")[0]?.trim() === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const httpsRedirect = enforceHttps(request);
  if (httpsRedirect) {
    return applySecurityHeaders(httpsRedirect, pathname);
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("iks_admin_session")?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return applySecurityHeaders(
        NextResponse.redirect(loginUrl),
        pathname,
      );
    }
  }

  return applySecurityHeaders(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
