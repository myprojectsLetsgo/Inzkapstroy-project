export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  // ростая заглушка для CSRF
  return NextResponse.json({ 
    csrfToken: 'bypass-csp-' + Date.now() 
  });
}
