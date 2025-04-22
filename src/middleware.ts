import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // En login ya logueado, redirigir al dashboard.
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Chequeando si tiene acceso
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isVerified = !!token.emailVerified;
    const isAdmin = token.role === "admin";

    //No está verificado, check email
    if (!isVerified) {
      return NextResponse.redirect(new URL("/check-email", req.url));
    }

    //No es admin y tiene usuario (?)
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url)); // Or a 403 page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
