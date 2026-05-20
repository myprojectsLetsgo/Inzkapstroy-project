export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // огируем полученную заявку
    console.log('📝 олучена новая заявка:', {
      ...formData,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // десь вы можете добавить:
    // 1. Сохранение в базу данных (SQLite, PostgreSQL и т.д.)
    // 2. тправку email уведомления
    // 3. Сохранение в Google Sheets
    // 4. тправку в CRM систему
    
    // ока просто возвращаем успех
    return NextResponse.json({ 
      success: true, 
      message: 'Спасибо! аша заявка принята. ы свяжемся с вами в ближайшее время.' 
    });
    
  } catch (error) {
    console.error('шибка при обработке заявки:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'роизошла ошибка при отправке. ожалуйста, попробуйте еще раз.' 
    }, { status: 500 });
  }
}
