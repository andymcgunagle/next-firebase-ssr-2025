"use client";

import type { PropsWithChildren } from "react";
import FirebaseAppCheckProvider from "./firebase-app-check-provider";

export default function GlobalProviders({ children }: PropsWithChildren) {
  return <FirebaseAppCheckProvider>{children}</FirebaseAppCheckProvider>;
}
