import GoogleAuthButton from "@/components/auth/google-auth-button";
import { CsrfSecurity } from "@/lib/security/csrf-security";
import { cookies } from "next/headers";

export default async function Page() {
  const csrf = (await cookies()).get(CsrfSecurity.COOKIE_NAME)?.value ?? "";

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome!</h1>
        <p>Please sign in to continue.</p>
        <GoogleAuthButton csrf={csrf} />
      </div>
    </div>
  );
}
