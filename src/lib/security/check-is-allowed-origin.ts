import "server-only";

import { NextRequest } from "next/server";

export function checkIsAllowedOrigin(req: NextRequest): boolean {
  /** Origin check */
  const origin = req.headers.get("origin");
  const allowed = new URL(process.env.NEXT_PUBLIC_APP_URL!).origin;

  return !!origin && origin === allowed;
}
