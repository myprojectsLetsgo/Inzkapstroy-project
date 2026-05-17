import { authenticator } from "otplib";

authenticator.options = { window: 1 };

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function verifyTotpToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token: token.replace(/\s/g, ""), secret });
  } catch {
    return false;
  }
}

export function getTotpUri(username: string, secret: string): string {
  const issuer = "InjKapStroy";
  return authenticator.keyuri(username, issuer, secret);
}
