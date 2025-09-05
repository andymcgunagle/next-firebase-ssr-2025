import type { Analytics } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

import { firebaseConfig } from "./config";

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
/**
 * As httpOnly cookies are to be used, do not persist any state client side.
 * @see https://firebase.google.com/docs/auth/admin/manage-cookies#sign_in
 */
firebaseAuth.setPersistence(inMemoryPersistence);

export const firebaseFunctions = getFunctions(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firestoreDb = getFirestore(firebaseApp);

let googleAnalytics: Analytics;

/** @see https://stackoverflow.com/a/70956222/14782928 */
if (typeof window !== "undefined") {
  googleAnalytics = getAnalytics(firebaseApp);
}

export { googleAnalytics };

if (process.env.NODE_ENV === "development") {
  /**
   * The 3rd argument for the port is the functions emulator port (5001), not the Firebase emulators port (4000).
   *
   * Run `firebase emulators:start --only functions --project <your-project-id>` to start the functions emulator.
   *
   * @see https://firebase.google.com/docs/functions/local-emulator
   */
  connectFunctionsEmulator(firebaseFunctions, "127.0.0.1", 5001);
}
