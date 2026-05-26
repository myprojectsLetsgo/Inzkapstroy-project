import { NextResponse } from 'next/server';

// Временные тестовые данные
const testLeads = [
  { id: 1, name: 'Тест 1', phone: '+79001234567', email: 'test1@test.ru', status: 'new', created_at: new Date().toISOString() },
  { id: 2, name: 'Test beget', phone: '79504894400', email: 'test@bk.tu', status: 'new', created_at: new Date().toISOString() }
];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== 'Bearer admin-secret-2026') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  // Возвращаем тестовые данные вместо реальной БД
  return NextResponse.json({ leads: testLeads, count: testLeads.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 Тестовая заявка:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Заявка принята (тестовый режим)'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ошибка' }, { status: 500 });
  }
}