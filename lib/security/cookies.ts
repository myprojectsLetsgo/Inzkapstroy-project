import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

type CookieBase = Pick<
  ResponseCookie,
  "httpOnly" | "secure" | "sameSite" | "path" | "maxAge"
>;

/** Сессионные и CSRF-куки: HttpOnly + Secure (в prod) + SameSite=Lax */
export function sessionCookieOptions(secure: boolean, maxAge: number): CookieBase {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}
