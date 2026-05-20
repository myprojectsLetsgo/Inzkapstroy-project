export async function verifyTotpToken(token: string, secret: string): Promise<boolean> {
  // Временно отключаем проверку 2FA
  console.log('TOTP verification skipped - stub');
  return true;
}

export async function setupTotp(email: string) {
  return {
    secret: 'temporary-secret-key',
    qrCode: 'https://example.com/qr.png',
    otpauth: 'otpauth://totp/example'
  };
}
