import { verifyAdminSession, SESSION_COOKIE } from "@/lib/auth/admin";
import { hasPermission } from "@/lib/auth/roles";
import { jsonError } from "@/lib/api/helpers";
import { deleteLead, updateLeadStatus } from "@/lib/storage/leads";
import { leadStatusSchema } from "@/lib/validation/lead";
import type { LeadStatus } from "@/lib/types/lead";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function requireSession(permission: "leads:read" | "leads:write" | "leads:delete") {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session || !hasPermission(session.role, permission)) return null;
  return session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireSession("leads:write"))) {
      return jsonError("Недостаточно прав", 403);
    }

    const { id } = await params;
    const body = await request.json();
    const statusResult = leadStatusSchema.safeParse(body.status);
    if (!statusResult.success) {
      return jsonError("Некорректный статус", 400);
    }

    const updated = await updateLeadStatus(id, statusResult.data as LeadStatus);
    if (!updated) {
      return jsonError("Заявка не найдена", 404);
    }

    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error("PATCH /api/leads/[id]", error);
    return jsonError("Ошибка сервера", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireSession("leads:delete"))) {
      return jsonError("Недостаточно прав", 403);
    }

    const { id } = await params;
    const ok = await deleteLead(id);
    if (!ok) {
      return jsonError("Заявка не найдена", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/leads/[id]", error);
    return jsonError("Ошибка сервера", 500);
  }
}
