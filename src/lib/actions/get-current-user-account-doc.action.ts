import "server-only";

import { firebaseAdminFirestoreDb } from "../firebase/server-app";
import type { AccountDoc } from "../schemas/firebase/documents/users/account-doc.schema";
import { getCurrentUser } from "./get-current-user.action";

export async function getCurrentUserAccountDoc(): Promise<{
  accountDoc: AccountDoc | null;
}> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) throw new Error("Current user not found");

    const result = await firebaseAdminFirestoreDb
      .doc(`accounts/${currentUser.uid}`)
      .get();

    if (!result.exists) throw new Error("No account doc found");

    return { accountDoc: result.data() as AccountDoc };
  } catch (error) {
    console.error(error);
    return { accountDoc: null };
  }
}
