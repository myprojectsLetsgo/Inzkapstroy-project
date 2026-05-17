import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { mkdir, readFile, writeFile } from "fs/promises";
import { ADMIN_FILE, DATA_DIR } from "@/lib/storage/paths";
import { parseRole, type UserRole } from "@/lib/auth/roles";
import { verifyTotpToken } from "@/lib/auth/totp";

export const SESSION_COOKIE = "iks_admin_session";
const SESSION_HOURS = 8;

export type AdminRecord = {
  username: string;
  passwordHash: string;
  role: UserRole;
  totpEnabled: boolean;
  totpSecret: string | null;
};

async function readAdmin(): Promise<AdminRecord | null> {
  try {
    const raw = await readFile(ADMIN_FILE, "utf8");
    const parsed = JSON.parse(raw) as AdminRecord;
    return {
      ...parsed,
      role: parseRole(parsed.role),
      totpEnabled: Boolean(parsed.totpEnabled),
      totpSecret: parsed.totpSecret ?? null,
    };
  } catch {
    return null;
  }
}

async function writeAdmin(record: AdminRecord): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ADMIN_FILE, JSON.stringify(record, null, 2), "utf8");
}

export async function ensureAdminUser(): Promise<AdminRecord> {
  const existing = await readAdmin();
  if (existing) return existing;

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error(
      "Set ADMIN_PASSWORD (min 12 chars) before first start to create admin account",
    );
  }

  const role = parseRole(process.env.ADMIN_ROLE ?? "admin");
  const passwordHash = await bcrypt.hash(password, 12);
  const record: AdminRecord = {
    username,
    passwordHash,
    role,
    totpEnabled: false,
    totpSecret: null,
  };
  await writeAdmin(record);
  return record;
}

export async function getAdminRecord(): Promise<AdminRecord | null> {
  return readAdmin();
}

export async function verifyAdminLogin(
  username: string,
  password: string,
  totpCode?: string,
): Promise<{ ok: true; role: UserRole } | { ok: false; reason: string }> {
  const admin = await ensureAdminUser();
  if (admin.username !== username) {
    await bcrypt.compare(password, "$2a$12$invalidhashinvalidhashinv");
    return { ok: false, reason: "invalid" };
  }

  const passwordOk = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordOk) {
    return { ok: false, reason: "invalid" };
  }

  if (admin.totpEnabled && admin.totpSecret) {
    if (!totpCode) {
      return { ok: false, reason: "totp_required" };
    }
    if (!verifyTotpToken(admin.totpSecret, totpCode)) {
      return { ok: false, reason: "invalid_totp" };
    }
  }

  return { ok: true, role: admin.role };
}

export async function updateAdminTotp(
  enable: boolean,
  secret?: string,
): Promise<AdminRecord> {
  const admin = await ensureAdminUser();
  const next: AdminRecord = {
    ...admin,
    totpEnabled: enable,
    totpSecret: enable ? (secret ?? admin.totpSecret) : null,
  };
  await writeAdmin(next);
  return next;
}

function sessionKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set (min 32 characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(
  username: string,
  role: UserRole,
): Promise<string> {
  return new SignJWT({ role, username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(sessionKey());
}

export type AdminSession = {
  username: string;
  role: UserRole;
};

export async function verifyAdminSession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionKey());
    if (typeof payload.sub !== "string") return null;
    const role = parseRole(payload.role);
    if (role === "user") return null;
    return { username: payload.sub, role };
  } catch {
    return null;
  }
}
