import { verifyAdminSession, SESSION_COOKIE } from "@/lib/auth/admin";
import { hasPermission } from "@/lib/auth/roles";
import { jsonError, isSecureRequest } from "@/lib/api/helpers";
import { createLead, listLeads } from "@/lib/storage/leads";
import { verifyCsrfToken, CSRF_COOKIE, CSRF_HEADER } from "@/lib/security/csrf";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIp } from "@/lib/security/ip";
import { leadCreateSchema } from "@/lib/validation/lead";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`lead:${ip ?? "unknown"}`, 5, 15 * 60 * 1000);
    if (!rate.ok) {
      return jsonError(
        `Слишком много заявок. Повторите через ${rate.retryAfterSec} сек.`,
        429,
      );
    }

    const headerToken = request.headers.get(CSRF_HEADER);
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
    const token = headerToken ?? cookieToken;

    if (!verifyCsrfToken(token)) {
      return jsonError("Недействительный CSRF-токен. Обновите страницу.", 403);
    }

    const body = await request.json();
    const parsed = leadCreateSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Некорректные данные";
      return jsonError(msg, 400);
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      description: parsed.data.description,
      ipHash: hashIp(ip),
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads", error);
    return jsonError("Не удалось сохранить заявку", 500);
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
    if (!session || !hasPermission(session.role, "leads:read")) {
      return jsonError("Недостаточно прав", 403);
    }

    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("GET /api/leads", error);
    return jsonError("Ошибка сервера", 500);
  }
}
