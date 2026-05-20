import { HardHat } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-4"><HardHat className="text-primary w-7 h-7" /><span className="font-heading font-black text-2xl text-white">ИнжКапСтрой</span></div>
            <p className="text-sm">Комплексное проектирование «под ключ» с использованием BIM и ИИ. Лидер в области инжиниринга.</p>
          </div>
          <div><h4 className="text-white font-bold text-lg mb-4">Навигация</h4><ul className="space-y-2 text-sm"><li><a href="#hero" className="hover:text-primary transition">Главная</a></li><li><a href="#services" className="hover:text-primary transition">Услуги</a></li><li><a href="#projects" className="hover:text-primary transition">Проекты</a></li><li><a href="#contact" className="hover:text-primary transition">Контакты</a></li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-4">Услуги</h4><ul className="space-y-2 text-sm"><li>BIM-проектирование</li><li>Инженерные изыскания</li><li>Экспертиза проектов</li><li>Технический надзор</li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-4">Контакты</h4><p className="text-sm">info@ingkapstroy.ru<br />+7 (495) 123-45-67</p></div>
        </div>
        <div className="text-center text-xs text-gray-500 pt-6">© 2025 ООО «ИнжКапСтрой». Все права защищены.</div>
      </div>
    </footer>
  );
}