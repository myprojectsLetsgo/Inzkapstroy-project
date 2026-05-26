export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'leads.json');

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Логируем полученную заявку
    console.log('📝 Получена новая заявка:', {
      ...formData,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // Валидация
    if (!formData.name?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Пожалуйста, укажите ваше имя' 
      }, { status: 400 });
    }
    
    if (!formData.phone?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Пожалуйста, укажите телефон для связи' 
      }, { status: 400 });
    }
    
    // Сохраняем заявку в файл
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      leads = JSON.parse(content);
    }
    
    const newLead = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || '',
      description: formData.description?.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'new',
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    
    console.log(`✅ Заявка сохранена! ID: ${newLead.id}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.',
      leadId: newLead.id
    });
    
  } catch (error) {
    console.error('Ошибка при обработке заявки:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.' 
    }, { status: 500 });
  }
}

// GET - просмотр всех заявок (для администратора)
export async function GET(request: Request) {
  // Простая защита - замените на свою аутентификацию
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer admin-secret-2026') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }
  
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const leads = JSON.parse(content);
      return NextResponse.json({ leads, count: leads.length });
    }
    return NextResponse.json({ leads: [], count: 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка чтения' }, { status: 500 });
  }
}