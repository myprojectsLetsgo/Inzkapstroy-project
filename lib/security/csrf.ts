import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set (min 32 characters)");
  }
  return secret;
}

export function generateCsrfToken(): string {
  const secret = getSecret();
  const nonce = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", secret).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
}

export function verifyCsrfToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const secret = getSecret();
  const [nonce, sig] = token.split(".");
  if (!nonce || !sig || sig.length !== 64) return false;
  const expected = createHmac("sha256", secret).update(nonce).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export const CSRF_COOKIE = "iks_csrf";
export const CSRF_HEADER = "x-csrf-token";
