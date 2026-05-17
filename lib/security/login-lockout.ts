import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const LOCKOUT_FILE = path.join(process.cwd(), "data", "login-lockouts.json");
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;

type LockoutStore = Record<
  string,
  { attempts: number; lockedUntil: number | null; lastAttempt: number }
>;

async function load(): Promise<LockoutStore> {
  try {
    const raw = await readFile(LOCKOUT_FILE, "utf8");
    return JSON.parse(raw) as LockoutStore;
  } catch {
    return {};
  }
}

async function save(store: LockoutStore): Promise<void> {
  await mkdir(path.dirname(LOCKOUT_FILE), { recursive: true });
  await writeFile(LOCKOUT_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function isIpLocked(ip: string): Promise<{
  locked: boolean;
  retryAfterSec?: number;
}> {
  const store = await load();
  const entry = store[ip];
  if (!entry?.lockedUntil) return { locked: false };
  const now = Date.now();
  if (now < entry.lockedUntil) {
    return {
      locked: true,
      retryAfterSec: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }
  delete store[ip];
  await save(store);
  return { locked: false };
}

export async function recordFailedLogin(ip: string): Promise<void> {
  const store = await load();
  const now = Date.now();
  const entry = store[ip] ?? { attempts: 0, lockedUntil: null, lastAttempt: now };
  entry.attempts += 1;
  entry.lastAttempt = now;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  store[ip] = entry;
  await save(store);
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const store = await load();
  delete store[ip];
  await save(store);
}
