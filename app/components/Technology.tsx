import { Cpu, Box, Braces, Cloud } from "lucide-react";

const techItems = [
  { icon: <Cpu size={36} />, title: 'Искусственный интеллект', desc: 'Оптимизация конструкций и энергоэффективность' },
  { icon: <Box size={36} />, title: 'BIM 360 / Revit', desc: 'Цифровое проектирование и коллаборация' },
  { icon: <Braces size={36} />, title: 'Топографическое моделирование', desc: 'ГИС-системы и лазерное сканирование' },
  { icon: <Cloud size={36} />, title: 'Облачные платформы', desc: 'Удалённый доступ к моделям и данным' },
];

export default function Technology() {
  return (
    <section id="technology" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">Цифровая трансформация</span>
          <h2 className="section-title">Технологии нового поколения</h2>
          <p className="section-sub">Интеграция ИИ, BIM и передового ПО для точности и скорости проектирования</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {techItems.map((tech, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-primary/10 transition-all hover:shadow-md">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">{tech.icon}</div>
              <h3 className="text-xl font-bold text-dark mb-2">{tech.title}</h3>
              <p className="text-gray-600 text-sm">{tech.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-dark">Внедряем стандарты информационного моделирования (BIM)</h3>
              <p className="text-gray-600 mt-1">Снижение ошибок на 40%, экономия бюджета до 25%</p>
            </div>
            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-primary/90">Узнать подробнее</button>
          </div>
        </div>
      </div>
    </section>
  );
}