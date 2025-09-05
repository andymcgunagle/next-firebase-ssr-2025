import { getFirebaseAdminAuthError } from "@/lib/firebase/get-firebase-admin-auth-error";
import { firebaseAdminAuth } from "@/lib/firebase/server-app";
import { checkIsAllowedOrigin } from "@/lib/security/check-is-allowed-origin";
import { CsrfSecurity } from "@/lib/security/csrf-security";
import { SessionCookieAuth } from "@/lib/security/session-cookie-auth";
import { type DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export type LogInDTO = {
  idToken: string;
};

/**
 * - Accepts a Firebase ID token from any provider (email/pass, OAuth, OIDC, SAML).
 * - Creates a secure HttpOnly session cookie (same claims as the ID token).
 */
export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ status: string } | { error: string }>> {
  if (!checkIsAllowedOrigin(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }

  if (!CsrfSecurity.checkIsValidCsrfToken(req)) {
    return NextResponse.json({ error: "Invalid CSRF" }, { status: 403 });
  }

  /** Parse request body. */
  let idToken: string;

  try {
    const body = (await req.json()) as Partial<LogInDTO>;
    idToken = body.idToken ?? "";
  } catch (error) {
    console.error("Failed to parse JSON", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  /** Verify ID token. */
  let decodedIdToken: DecodedIdToken;

  try {
    decodedIdToken = await firebaseAdminAuth.verifyIdToken(idToken, true);
  } catch (error: unknown) {
    console.error("verifyIdToken failed", error);

    const { codeAndMessage, status } = getFirebaseAdminAuthError(error);

    return NextResponse.json({ error: codeAndMessage }, { status });
  }

  /** Recency check. */
  const nowSeconds = Math.floor(Date.now() / 1000);
  const isIdTokenOutdated = nowSeconds - decodedIdToken.auth_time > 5 * 60;

  if (isIdTokenOutdated) {
    return NextResponse.json({ error: "Recent sign-in required" }, { status: 401 });
  }

  /** Set session cookie. */
  try {
    await SessionCookieAuth.startSession(idToken);
  } catch (error) {
    console.error("startSession failed", error);
    return NextResponse.json({ error: "Could not set session" }, { status: 500 });
  }

  return NextResponse.json({ status: "success" });
}
