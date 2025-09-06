import "server-only";

import { SessionCookieAuth } from "@/lib/security/session-cookie-auth";
import type { DecodedIdToken } from "firebase-admin/auth";
import { z } from "zod/v4";

/** @todo Add custom claims you care about. */
export type CurrentUserDTO = Pick<
  DecodedIdToken,
  "email" | "email_verified" | "uid" | "picture"
>;

const CurrentUserDTOSchema: z.ZodType<CurrentUserDTO> = z.object({
  email: z.email().optional(),
  email_verified: z.boolean().optional(),
  picture: z.url().optional(),
  uid: z.string(),
});

export async function getCurrentUser(): Promise<{
  currentUser: CurrentUserDTO | null;
}> {
  try {
    const { decodedIdToken } = await SessionCookieAuth.getDecodedIdToken();

    if (!decodedIdToken) {
      throw new Error("No decoded ID token found");
    }

    const currentUser = CurrentUserDTOSchema.safeParse(decodedIdToken);

    if (!currentUser.success) {
      throw new Error(z.prettifyError(currentUser.error));
    }

    return { currentUser: currentUser.data };
  } catch (error) {
    console.error(error);
    return { currentUser: null };
  }
}
