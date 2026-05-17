<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ИнжКапСтрой — проект

Сайт ООО «ИнжКапСтрой»: комплексное проектирование «под ключ», BIM, экспертизы.

## Виртуальный консультант

- UI: `app/components/ChatAgent.tsx` (виджет в `app/layout.tsx`)
- API: `POST /api/chat` → `app/api/chat/route.ts`
- Логика: `lib/agent/respond.ts` (локальная база знаний + опционально OpenAI)
- Данные компании: `lib/company.ts`, системный промпт: `lib/agent/prompt.ts`
- Лендинг (статический HTML из макета): `public/landing.html`, главная — iframe в `app/page.tsx`

При изменении контента сайта обновляйте `lib/company.ts` и при необходимости `public/landing.html`.

Переменные окружения: см. `.env.example` (`OPENAI_API_KEY` для LLM-режима).
