import {
  bimCapabilities,
  company,
  expertiseOrgs,
  objectTypes,
  projects,
  services,
  team,
} from "@/lib/company";
import { buildSystemPrompt } from "@/lib/agent/prompt";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, "е");
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

const contactFooter = `\n\n📞 ${company.phone} · ✉️ ${company.email}\nОставьте заявку в форме на сайте — ответим в течение 2 часов в рабочее время.`;

export function respondLocally(userText: string): string {
  const q = normalize(userText);

  if (includesAny(q, ["привет", "здравств", "добрый", "hello", "hi"])) {
    return `Здравствуйте! Я консультант ${company.shortName}. Помогу разобраться в услугах, BIM/ИИ, экспертизах и примерах проектов. Чем могу помочь — тип объекта, сроки или стоимость?${contactFooter}`;
  }

  if (includesAny(q, ["контакт", "телефон", "позвон", "email", "почт", "адрес", "где наход", "офис"])) {
    return `Контакты ${company.name}:\n\n• Телефон: ${company.phone}\n• Email: ${company.email}\n• Адрес: ${company.address}\n• Режим: ${company.hours}${contactFooter}`;
  }

  if (includesAny(q, ["цен", "стоим", "сколько стоит", "прайс", "расчет", "расчёт", "смет", "бюджет", "кп"])) {
    return `Точная стоимость зависит от типа объекта, площади, стадии документации и требований к экспертизе. По спецпредложению главный инженер разберёт ТЗ и подготовит коммерческое предложение за 24 часа с фиксацией цены на 30 дней.\n\nСейчас доступно ${company.offer.slotsLeft} слота на аудит в этом месяце.${contactFooter}`;
  }

  if (includesAny(q, ["срок", "долго", "быстро", "когда", "время", "график"])) {
    return `${company.shortName} фиксирует сроки и стоимость в договоре и сопровождает проект приоритетно. Сроки зависят от стадии (эскиз, ПД, РД) и вида экспертизы. Для ориентира оставьте описание проекта — специалист оценит сроки после экспресс-анализа.${contactFooter}`;
  }

  if (includesAny(q, ["услуг", "чем заним", "направлен", "проектир", "реконструк", "под ключ"])) {
    const list = services.map((s) => `• ${s.title} — ${s.description}`).join("\n");
    return `Мы выполняем полный цикл проектирования «под ключ»:\n\n${list}\n\nТакже: обследование, инженерные изыскания, ПД/РД, BIM, прохождение экспертиз.${contactFooter}`;
  }

  if (includesAny(q, ["проект", "портфолио", "объект", "ранхигс", "жилищник", "мир", "фнс", "санатор"])) {
    const list = projects
      .map((p) => `• ${p.title} (${p.area}) — ${p.description}`)
      .join("\n");
    return `Реализовано ${company.stats.projects} крупных проектов, общая площадь ${company.stats.area}. Примеры:\n\n${list}${contactFooter}`;
  }

  if (includesAny(q, ["экспертиз", "мосгос", "главгос", "мособл", "согласован", "агр", "архитектурн"])) {
    const list = expertiseOrgs.map((e) => `• ${e}`).join("\n");
    return `Подтверждённый опыт прохождения экспертиз:\n\n${list}${contactFooter}`;
  }

  if (includesAny(q, ["bim", "ии", "нейросет", "коллиз", "модел", "ifc", "цифров"])) {
    const list = bimCapabilities.map((b) => `• ${b}`).join("\n");
    return `BIM и ИИ в ${company.shortName}:\n\n${list}\n\nЗаявленный эффект: до −30% времени на согласования и до −15% бюджетных расходов за счёт ранней проверки коллизий.${contactFooter}`;
  }

  if (includesAny(q, ["команд", "специалист", "директор", "архитектор", "инженер", "кто"])) {
    const list = team.map((t) => `• ${t.name} — ${t.role}, ${t.focus}`).join("\n");
    return `Ключевые специалисты (${company.stats.specialists} в штате):\n\n${list}${contactFooter}`;
  }

  if (includesAny(q, ["сро", "допуск", "300", "млн"])) {
    return `${company.name} имеет ${company.stats.sro}. Это позволяет реализовывать проекты повышенной сложности и стоимости.${contactFooter}`;
  }

  if (includesAny(q, ["аудит", "акци", "предложен", "24 час", "слот"])) {
    const benefits = company.offer.benefits.map((b) => `• ${b}`).join("\n");
    return `${company.offer.title}\n\n${benefits}\n\nВ этом месяце осталось ${company.offer.slotsLeft} слота на аудит.${contactFooter}`;
  }

  if (includesAny(q, ["тип объекта", "форма", "заявк", "оставить"])) {
    const types = objectTypes.map((t) => `• ${t}`).join("\n");
    return `На сайте можно выбрать тип объекта:\n\n${types}\n\nУкажите имя, телефон и краткое описание проекта — мы ответим в течение 2 часов в рабочее время.${contactFooter}`;
  }

  if (includesAny(q, ["воронеж", "москв", "регион", "территор"])) {
    return `Офис: ${company.address}. Работаем с объектами в Москве, Московской области и по России — включая Мосгосэкспертизу, Главгосэкспертизу и согласование АГР в Москве.${contactFooter}`;
  }

  return `Спасибо за вопрос! ${company.shortName} — ${company.tagline}. Могу рассказать об услугах, BIM/ИИ, экспертизах, проектах, команде или помочь с заявкой на расчёт.\n\nУточните, пожалуйста: тип объекта, площадь или интересующая услуга.${contactFooter}`;
}

export async function respondWithLlm(
  messages: ChatMessage[],
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 800,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI error", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}

export async function generateAgentReply(messages: ChatMessage[]): Promise<{
  content: string;
  source: "llm" | "local";
}> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return {
      content: `Здравствуйте! Я консультант ${company.shortName}. Задайте вопрос об услугах, проектах или оставьте заявку на расчёт.`,
      source: "local",
    };
  }

  const llmReply = await respondWithLlm(messages);
  if (llmReply) {
    return { content: llmReply, source: "llm" };
  }

  return { content: respondLocally(lastUser.content), source: "local" };
}
