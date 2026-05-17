import { company } from "@/lib/company";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — ИнжКапСтрой",
  description: "Политика обработки персональных данных ООО «ИнжКапСтрой»",
};

export default function PrivacyPage() {
  return (
    <article className="privacy-page">
      <div class="privacy-inner">
        <Link href="/" className="privacy-back">← На главную</Link>
        <h1>Политика конфиденциальности</h1>
        <p className="privacy-updated">Дата публикации: 17 мая 2026 г.</p>
        <section>
          <h2>1. Общие положения</h2>
          <p>Настоящая Политика определяет порядок обработки персональных данных пользователей сайта {company.shortName} ({company.name}).</p>
        </section>
        <section>
          <h2>2. Какие данные мы собираем</h2>
          <ul>
            <li>Имя, телефон, email (при заполнении формы)</li>
            <li>Описание проекта</li>
            <li>Технические данные (IP в обезличенном виде)</li>
          </ul>
        </section>
        <section>
          <h2>3. Цели обработки</h2>
          <p>Обработка заявок, обратная связь, подготовка коммерческих предложений, защита сайта от злоупотреблений.</p>
        </section>
        <section>
          <h2>4. Защита данных</h2>
          <p>Используется HTTPS, хэширование паролей администраторов (bcrypt), CSRF-защита форм, валидация входных данных.</p>
        </section>
        <section>
          <h2>5. Ваши права</h2>
          <p>Вы можете запросить доступ, исправление или удаление данных: {company.email}, {company.phone}.</p>
        </section>
        <section>
          <h2>6. Контакты</h2>
          <p>{company.name}, {company.address}</p>
        </section>
      </div>
    </article>
  );
}
