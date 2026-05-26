import { SESSION_COOKIE } from "@/lib/auth/admin";
import { isSecureRequest } from "@/lib/api/helpers";
import { sessionCookieOptions } from "@/lib/security/cookies";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Разрешенные домены (белый список)
const ALLOWED_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://injkapstroy.ru',     // Замените на ваш домен
  'https://www.injkapstroy.ru', // Замените на ваш домен с www
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

// Функция проверки домена
function isAllowedDomain(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Для запросов без origin (сервер-сервер) разрешаем
  if (!origin && !referer) return true;
  
  // Проверяем origin и referer
  const checkUrl = (url: string | null) => {
    if (!url) return false;
    return ALLOWED_DOMAINS.some(domain => url.startsWith(domain));
  };
  
  return checkUrl(origin) || checkUrl(referer);
}

// Функция добавления CORS заголовков
function addCorsHeaders(response: NextResponse, request: Request): NextResponse {
  const origin = request.headers.get('origin');
  
  if (origin && ALLOWED_DOMAINS.some(domain => origin.startsWith(domain))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}

// Обработка OPTIONS запроса (preflight CORS)
export async function OPTIONS() {
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

// Основной обработчик POST
export async function POST(request: Request) {
  // ПРОВЕРКА ДОМЕНА
  if (!isAllowedDomain(request)) {
    return NextResponse.json(
      { 
        error: "Доступ запрещен", 
        message: "Запрос с неразрешенного домена" 
      },
      { status: 403 }
    );
  }
  // ОСНОВНАЯ ЛОГИКА ВЫХОДА
  const response = NextResponse.json({ ok: true });
  
  // Добавляем CORS заголовки
  addCorsHeaders(response, request);
  
  // Удаляем сессионную cookie
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(isSecureRequest(request), 0),
    maxAge: 0,
  });
  
  return response;
}