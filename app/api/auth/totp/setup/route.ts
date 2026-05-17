import { verifyAdminSession, SESSION_COOKIE, updateAdminTotp, getAdminRecord } from "@/lib/auth/admin";
import { generateTotpSecret, getTotpUri } from "@/lib/auth/totp";
import { hasPermission } from "@/lib/auth/roles";
import { jsonError } from "@/lib/api/helpers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session || !hasPermission(session.role, "admin:settings")) {
    return jsonError("Доступ запрещён", 403);
  }

  const admin = await getAdminRecord();
  if (!admin) return jsonError("Администратор не найден", 404);

  const secret = admin.totpSecret ?? generateTotpSecret();
  const uri = getTotpUri(admin.username, secret);

  return NextResponse.json({
    secret,
    uri,
    enabled: admin.totpEnabled,
    hint: "Отсканируйте URI в приложении Google Authenticator / Authy, затем подтвердите кодом POST /api/auth/totp/setup",
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session || !hasPermission(session.role, "admin:settings")) {
    return jsonError("Доступ запрещён", 403);
  }

  const body = (await request.json()) as { secret?: string; code?: string; enable?: boolean };
  if (!body.secret || !body.code) {
    return jsonError("Укажите secret и code", 400);
  }

  const { verifyTotpToken: verifyCode } = await import("@/lib/auth/totp");
  if (!verifyCode(body.secret, body.code)) {
    return jsonError("Неверный код 2FA", 400);
  }

  await updateAdminTotp(body.enable !== false, body.secret);
  return NextResponse.json({ ok: true, totpEnabled: true });
}
