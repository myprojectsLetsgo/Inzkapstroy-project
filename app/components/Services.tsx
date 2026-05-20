import { DraftingCompass, Building2, ClipboardCheck, BarChart3, Cpu, Layers } from "lucide-react";

const services = [
  { icon: <DraftingCompass size={40} />, title: 'Архитектурное проектирование', desc: 'Создаём эстетичные и функциональные решения для жилых, коммерческих и промышленных объектов.' },
  { icon: <Building2 size={40} />, title: 'Инженерные изыскания', desc: 'Геодезия, геология, экология — точные данные для надёжного фундамента.' },
  { icon: <Cpu size={40} />, title: 'BIM-моделирование', desc: 'Цифровые двойники зданий с полной детализацией и управлением данными.' },
  { icon: <ClipboardCheck size={40} />, title: 'Экспертиза & согласование', desc: 'Сопровождение в госэкспертизе, получение разрешений и оптимизация сроков.' },
  { icon: <Layers size={40} />, title: 'Конструктивные решения', desc: 'Расчёт и проектирование ж/б, металлоконструкций с использованием САПР.' },
  { icon: <BarChart3 size={40} />, title: 'Технический надзор', desc: 'Контроль качества строительства и авторский надзор на объекте.' }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">Компетенции</span>
          <h2 className="section-title">Полный спектр услуг</h2>
          <p className="section-sub">Реализуем проекты любой сложности — от частных домов до промышленных комплексов</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-7 hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="text-primary mb-5 transition-transform group-hover:scale-110 inline-block">{service.icon}</div>
              <h3 className="text-xl font-bold text-dark mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}