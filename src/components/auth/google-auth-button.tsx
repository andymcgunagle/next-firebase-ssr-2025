"use client";

import type { LogInDTO } from "@/app/api/auth/session/sign-in/route";
import { firebaseAuth } from "@/lib/firebase/client-app";
import { redirectRoutes } from "@/lib/navigation/routes";
import { fetchFromApi } from "@/lib/utils/fetch-from-api";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function GoogleAuthButton({ csrf }: { csrf: string }) {
  const router = useRouter();

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({ prompt: "select_account" });

      const userCredential = await signInWithPopup(firebaseAuth, provider);

      const idToken = await userCredential.user.getIdToken();

      const res = await fetchFromApi("/api/auth/session/sign-in", {
        body: JSON.stringify({ idToken } satisfies LogInDTO),
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        method: "POST",
      });

      if (!res.ok) throw new Error("Session sign-in failed");

      router.replace(redirectRoutes.onAuthenticated);
    } catch (error) {
      console.error("Google sign-in failed", error);

      /** Roll back client auth if server auth fails. */
      await signOut(firebaseAuth);
    }
  }

  return <button onClick={handleGoogleSignIn}>Continue with Google</button>;
}
