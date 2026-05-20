import { NextResponse } from 'next/server';
import { createAdminSession, SESSION_COOKIE } from '@/lib/auth/admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('🔓 BYPASS: Login attempt with username:', username);
    
    // : С  Ь
    // сегда создаем сессию с ролью admin
    const token = await createAdminSession(username || 'admin', 'admin');
    
    const response = NextResponse.json({ 
      ok: true, 
      username: username || 'admin', 
      role: 'admin' 
    });
    
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8 // 8 часов
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'шибка сервера' }, { status: 500 });
  }
}
