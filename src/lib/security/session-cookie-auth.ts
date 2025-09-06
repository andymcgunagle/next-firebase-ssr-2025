import "server-only";

import { firebaseAdminAuth } from "@/lib/firebase/server-app";
import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { CsrfSecurity } from "./csrf-security";

export class SessionCookieAuth {
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

  static async getDecodedIdToken(): Promise<{
    decodedIdToken: DecodedIdToken | null;
  }> {
    try {
      const { sessionCookie } = await this.getSessionCookie();

      /** No need to throw an error if the session cookie is missing - just return early. */
      if (!sessionCookie) return { decodedIdToken: null };

      const decodedIdToken = await firebaseAdminAuth.verifySessionCookie(
        sessionCookie,
        /** When true, this sends an extra request to the Firebase Auth backend to check the tokensValidAfterTime time for the corresponding user. */
        true,
      );

      return { decodedIdToken };
    } catch (error) {
      console.error("Error getting decoded ID token", error);
      return { decodedIdToken: null };
    }
  }

  /** Used in middleware to check if the user is authenticated. */
  static async checkIsAuthenticated(): Promise<{
    isAuthenticated: boolean;
  }> {
    try {
      const { decodedIdToken } = await this.getDecodedIdToken();
      return { isAuthenticated: !!decodedIdToken };
    } catch (error) {
      console.error(error);
      return { isAuthenticated: false };
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
