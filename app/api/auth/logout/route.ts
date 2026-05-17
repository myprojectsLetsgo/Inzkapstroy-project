import { SESSION_COOKIE } from "@/lib/auth/admin";
import { isSecureRequest } from "@/lib/api/helpers";
import { sessionCookieOptions } from "@/lib/security/cookies";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(isSecureRequest(request), 0),
    maxAge: 0,
  });
  return response;
}
