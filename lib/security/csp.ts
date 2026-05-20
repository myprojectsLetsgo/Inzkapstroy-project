/**
 * Строгий CSP для production, более гибкий для development
 */
export function buildContentSecurityPolicy(isDev: boolean): string {
  if (isDev) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",       
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' ws: wss: http://localhost:* https://localhost:*",  
      "frame-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  return [
    "default-src 'none'",
    "script-src 'self' 'unsafe-inline'",  // 🔧 Добавили unsafe-inline
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export const HSTS_HEADER =
  'max-age=31536000; includeSubDomains; preload';
