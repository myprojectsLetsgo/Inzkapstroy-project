import { generateCsrfToken, CSRF_COOKIE } from "@/lib/security/csrf";
import { isSecureRequest } from "@/lib/api/helpers";
import { sessionCookieOptions } from "@/lib/security/cookies";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const token = generateCsrfToken();
    const response = NextResponse.json({ token });
    response.cookies.set(
      CSRF_COOKIE,
      token,
      sessionCookieOptions(isSecureRequest(request), 60 * 60),
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Сервер не настроен. Обратитесь к администратору." },
      { status: 503 },
    );
  }
}
