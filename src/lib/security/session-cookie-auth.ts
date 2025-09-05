import "server-only";

import { firebaseAdminAuth } from "@/lib/firebase/server-app";
import type { DecodedIdToken } from "firebase-admin/auth";
import { importX509, jwtVerify, type JWTHeaderParameters, type KeyLike } from "jose";
import { cookies } from "next/headers";
import { CsrfSecurity } from "./csrf-security";

export class SessionCookieAuth {
  /**
   * The session cookie's header must correspond to one of the public keys listed at the `CERTS_URL`.
   * @see https://firebase.google.com/docs/auth/admin/manage-cookies#verify_session_cookies_using_a_third-party_jwt_library
   */
  private static CERTS_URL =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";

  private static PROJECT_ID =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  private static JWS_ALGORITHM = "RS256";

  /** Keep cookie name Firebase-friendly for Hosting/CDN integrations. */
  static COOKIE_NAME = "__session";

  /** Used in /api/auth/session/sign-in route. */
  static async startSession(idToken: string): Promise<void> {
    const maxAgeMs = 14 * 24 * 60 * 60 * 1000; // 14 days

    const sessionCookie = await firebaseAdminAuth.createSessionCookie(idToken, {
      expiresIn: maxAgeMs,
    });

    (await cookies()).set({
      httpOnly: true,
      maxAge: Math.floor(maxAgeMs / 1000),
      name: this.COOKIE_NAME,
      path: "/",
      sameSite: "lax",
      secure: true,
      value: sessionCookie,
    });
  }

  /** Returning an object here to ensure consistent `sessionCookie` naming plus provide `jar` for convenience. */
  static async getSessionCookie(): Promise<{
    jar: Awaited<ReturnType<typeof cookies>>;
    sessionCookie: string | null;
  }> {
    const jar = await cookies();

    return {
      jar,
      sessionCookie: jar.get(this.COOKIE_NAME)?.value ?? null,
    };
  }

  /** Helper to resolve keys for JWT verification in `verify` method. */
  private static async keyResolver(header: JWTHeaderParameters): Promise<KeyLike> {
    if (!header.kid) throw new Error("Missing kid");

    const res = await fetch(this.CERTS_URL, { cache: "no-store" });

    if (!res.ok) throw new Error(`Cert fetch failed: ${res.status}`);

    const certs = (await res.json()) as Record<string, string>;

    const pem = certs[header.kid];

    if (!pem) throw new Error(`No cert for kid=${header.kid}`);

    return importX509(pem, this.JWS_ALGORITHM);
  }

  /** Used in middleware to check if the user is authenticated. */
  static async verify(): Promise<boolean> {
    try {
      if (!this.PROJECT_ID) throw new Error("Missing project ID");

      const { sessionCookie } = await this.getSessionCookie();

      /** No need to throw an error if the session cookie is missing - just return false. */
      if (!sessionCookie) return false;

      const { payload } = await jwtVerify(
        sessionCookie,
        (header) => this.keyResolver(header),
        {
          algorithms: [this.JWS_ALGORITHM],
          audience: this.PROJECT_ID,
          clockTolerance: "5s",
          issuer: `https://session.firebase.google.com/${this.PROJECT_ID}`,
        },
      );

      if (!payload.sub) throw new Error("Missing sub");

      if (payload.auth_time && Number(payload.auth_time) * 1000 > Date.now()) {
        throw new Error("auth_time in future");
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async getDecodedIdToken(checkRevoked: boolean = true): Promise<{
    decodedIdToken: DecodedIdToken | null;
  }> {
    try {
      const { sessionCookie } = await this.getSessionCookie();

      if (!sessionCookie) throw new Error("No session cookie found");

      const decodedIdToken = await firebaseAdminAuth.verifySessionCookie(
        sessionCookie,
        /** When true, this sends an extra request to the Firebase Auth backend to check the tokensValidAfterTime time for the corresponding user. */
        checkRevoked,
      );

      return { decodedIdToken };
    } catch (error) {
      console.error("Error getting decoded ID token", error);
      return { decodedIdToken: null };
    }
  }

  /** Used in /api/auth/session/sign-out route. */
  static async endSession(): Promise<void> {
    const { jar, sessionCookie } = await this.getSessionCookie();

    /** Delete cookies. */
    jar.delete(this.COOKIE_NAME);
    jar.delete(CsrfSecurity.COOKIE_NAME);

    let decodedIdToken: DecodedIdToken | null = null;

    if (sessionCookie) {
      try {
        decodedIdToken = await firebaseAdminAuth.verifySessionCookie(sessionCookie);
      } catch (error) {
        console.error("Failed to verify session cookie", error);
      }
    }

    if (decodedIdToken) {
      try {
        /** Calling the revocation API revokes the session and also revokes all the user's other sessions, forcing new login. */
        await firebaseAdminAuth.revokeRefreshTokens(decodedIdToken.sub);
      } catch (error) {
        console.error("Failed to revoke refresh tokens", error);
      }
    }
  }
}
