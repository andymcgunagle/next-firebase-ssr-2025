"use client";

import { redirectRoutes } from "@/lib/navigation/routes";
import { fetchFromApi } from "@/lib/utils/fetch-from-api";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const res = await fetchFromApi("/api/auth/session/sign-out", {
        method: "POST",
      });

      if (!res.ok) {
        console.error("Session sign-out failed");
        return;
      }

      router.replace(redirectRoutes.onNotAuthenticated);
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  }

  return <button onClick={handleSignOut}>Sign Out</button>;
}
