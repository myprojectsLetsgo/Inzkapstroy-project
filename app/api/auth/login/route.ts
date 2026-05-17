import {
  createAdminSession,
  SESSION_COOKIE,
  verifyAdminLogin,
  ensureAdminUser,
} from "@/lib/auth/admin";
import { jsonError, isSecureRequest } from "@/lib/api/helpers";
import { sessionCookieOptions } from "@/lib/security/cookies";
import {
  clearLoginAttempts,
  isIpLocked,
  recordFailedLogin,
} from "@/lib/security/login-lockout";
import { getClientIp } from "@/lib/security/ip";
import { loginSchema } from "@/lib/validation/lead";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const loginBodySchema = loginSchema.extend({
  totp: z.string().trim().max(8).optional(),
});

const SESSION_MAX_AGE = 8 * 60 * 60;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request) ?? "unknown";
    const lock = await isIpLocked(ip);
    if (lock.locked) {
      return jsonError(
        `IP заблокирован после 5 неудачных попыток. Повторите через ${lock.retryAfterSec} сек.`,
        429,
      );
    }

    await ensureAdminUser();

    const body = await request.json();
    const parsed = loginBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Некорректные учётные данные", 400);
    }

    const result = await verifyAdminLogin(
      parsed.data.username,
      parsed.data.password,
      parsed.data.totp,
    );

    if (!result.ok) {
      if (result.reason === "totp_required") {
        return NextResponse.json(
          { error: "Требуется код 2FA", requiresTotp: true },
          { status: 401 },
        );
      }
      await recordFailedLogin(ip);
      return jsonError("Неверный логин, пароль или код 2FA", 401);
    }

    await clearLoginAttempts(ip);

    const token = await createAdminSession(parsed.data.username, result.role);
    const secure = isSecureRequest(request);
    const response = NextResponse.json({
      ok: true,
      username: parsed.data.username,
      role: result.role,
    });
    response.cookies.set(
      SESSION_COOKIE,
      token,
      sessionCookieOptions(secure, SESSION_MAX_AGE),
    );
    return response;
  } catch (error) {
    console.error("POST /api/auth/login", error);
    const message =
      error instanceof Error && error.message.includes("ADMIN_PASSWORD")
        ? "Администратор не настроен. Задайте ADMIN_PASSWORD в .env.local"
        : "Ошибка входа";
    return jsonError(message, 503);
  }
}
