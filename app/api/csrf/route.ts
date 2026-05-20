export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ csrfToken: 'bypass-csp-' + Date.now() });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
