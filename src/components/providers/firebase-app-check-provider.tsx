"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import { firebaseApp } from "@/lib/firebase/client-app";

/** If Firebase App Check is enabled, then this is necessary for client-side auth and other Firebase services. */
export default function FirebaseAppCheckProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        throw new Error(
          "Firebase App Check can only be initialized in the browser.",
        );
      }

      if (!process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY) {
        throw new Error(
          "Missing NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY environment variable.",
        );
      }

      initializeAppCheck(firebaseApp, {
        isTokenAutoRefreshEnabled: true,
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY,
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return <>{children}</>;
}
