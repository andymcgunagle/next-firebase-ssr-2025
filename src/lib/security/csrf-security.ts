import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, type NextResponse } from "next/server";

type MiddlewareFunction = (req: NextRequest) => Promise<NextResponse> | NextResponse;

export class CsrfSecurity {
  /**
   * Use the __Host- prefix to force Secure, Path=/, and no Domain — this prevents subdomain cookie planting and narrows the blast radius.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie?utm_source=chatgpt.com#cookie_prefixes
   */
  static COOKIE_NAME = "__Host-csrfSecret";

  /** Ensures that the CSRF secret cookie is set on the response in the middleware. */
  static csrfMiddleware(middlewareFn: MiddlewareFunction): MiddlewareFunction {
    return async (req: NextRequest) => {
      const res = await middlewareFn(req);

      if (!req.cookies.get(this.COOKIE_NAME)) {
        const secret = randomBytes(32).toString("base64url");

        res.cookies.set({
          httpOnly: false, // readable by client (double-submit)
          maxAge: 60 * 60 * 24, // 1 day
          name: this.COOKIE_NAME,
          path: "/",
          sameSite: "strict",
          secure: true,
          value: secret,
        });
      }

      return res;
    };
  }

  /** Compare two strings (a and b) in a way that avoids leaking information via timing attacks. */
  private static safeCsrfEqual(a: string, b: string): boolean {
    const da = createHash("sha256").update(a).digest();
    const db = createHash("sha256").update(b).digest();
    return timingSafeEqual(da, db);
  }

  /**
   * - Validates the CSRF token using the double-submit cookie pattern in the /api/auth/session/sign-in route.
   * - The client sends the same secret via a cookie and a header.
   * - A malicious site can’t read your cookies (same-site protection), so it can’t forge the header.
   * - But your app can, because it read the cookie and injected the value into the header before sending the POST.
   */
  static checkIsValidCsrfToken(req: NextRequest): boolean {
    const cookieToken = req.cookies.get(this.COOKIE_NAME)?.value ?? "";
    const headerToken = req.headers.get("x-csrf-token") ?? "";

    return (
      cookieToken !== "" &&
      headerToken !== "" &&
      this.safeCsrfEqual(cookieToken, headerToken)
    );
  }
}
