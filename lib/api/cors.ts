import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Разрешенные домены
const ALLOWED_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://injkapstroy.ru', // замените на ваш домен
  'https://www.injkapstroy.ru',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

// Проверка разрешенного домена
export function isAllowedDomain(request: Request | NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  if (!origin && !referer) return true; // Разрешаем серверные запросы
  
  const checkUrl = (url: string | null) => {
    if (!url) return false;
    return ALLOWED_DOMAINS.some(domain => url.startsWith(domain));
  };
  
  return checkUrl(origin) || checkUrl(referer);
}

// Добавление CORS заголовков к ответу
export function addCorsHeaders(response: NextResponse, request: Request | NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  
  if (origin && ALLOWED_DOMAINS.some(domain => origin.startsWith(domain))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}

// Обработка OPTIONS запроса (preflight)
export function handleOptionsRequest(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}