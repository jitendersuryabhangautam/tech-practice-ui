import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/icon")) return true;
  if (pathname.startsWith("/content")) return true;
  if (pathname.startsWith("/data")) return true;
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|txt)$/)) return true;
  return false;
}

function isAdminPath(pathname) {
  return pathname.startsWith("/admin");
}

function isAuthApi(pathname) {
  return pathname.startsWith("/api/auth/");
}

function isAdminApi(pathname) {
  if (pathname.startsWith("/api/admin/")) return true;
  if (pathname.startsWith("/api/content/")) return true;
  return false;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname) || isAuthApi(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((isAdminPath(pathname) || isAdminApi(pathname)) && session.role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
