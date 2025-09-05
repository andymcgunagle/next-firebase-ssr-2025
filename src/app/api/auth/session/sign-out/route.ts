import { SessionCookieAuth } from "@/lib/security/session-cookie-auth";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  try {
    await SessionCookieAuth.endSession();
    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
