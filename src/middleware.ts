import { SessionCookieAuth } from "@/lib/security/session-cookie-auth";
import { NextRequest, NextResponse } from "next/server";
import { redirectRoutes } from "./lib/navigation/routes";
import { CsrfSecurity } from "./lib/security/csrf-security";

export const config = {
  matcher: [
    /** Skip Next.js internals and all static files, unless found in search params. */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    /** Always run for API routes. */
    "/(api|trpc)(.*)",
  ],
  runtime: "nodejs",
};

async function routingMiddleware(req: NextRequest) {
  const isAuthenticated = await SessionCookieAuth.verify();

  const path = req.nextUrl.pathname;

  /** @todo These can be improved as the app becomes more complex. */
  const isPublicRoute = path === "/" || path.startsWith("/auth");
  const isProtectedRoute = path === "/dashboard";

  if (isPublicRoute && isAuthenticated && path !== redirectRoutes.onAuthenticated) {
    return NextResponse.redirect(
      new URL(redirectRoutes.onAuthenticated, req.nextUrl),
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(redirectRoutes.onNotAuthenticated, req.nextUrl),
    );
  }

  /** @todo Protect API routes as needed. */
  // if (path.startsWith("/api")) {}

  return NextResponse.next();
}

export default CsrfSecurity.csrfMiddleware(routingMiddleware);
