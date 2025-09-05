import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const firebaseAdminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          projectId: process.env.FIREBASE_PROJECT_ID,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

export const firebaseAdminAuth = getAuth(firebaseAdminApp);
export const firebaseAdminFirestoreDb = getFirestore(firebaseAdminApp);
export const firebaseAdminStorage = getStorage(firebaseAdminApp);
