"use client";

import { ArrowRight, CheckCircle } from "lucide-react";

export default function Hero() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92adab1?w=1600')] bg-cover bg-center opacity-10 pointer-events-none"></div>
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-primary/20">
            <span className="text-primary text-sm font-bold">🏗️ 12+ лет экспертизы</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-dark leading-tight">
            Комплексное проектирование <span className="text-primary">«под ключ»</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            BIM, искусственный интеллект и передовые технологии для создания зданий будущего. От концепции до экспертизы — полный цикл работ.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button onClick={scrollToContact} className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all hover:gap-3">
              Начать проект <ArrowRight size={20} />
            </button>
            <a href="#projects" onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary/30 px-7 py-3 rounded-full font-semibold text-lg hover:bg-primary/5 transition-all">
              Наши работы
            </a>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><CheckCircle size={18} className="text-primary"/> Экспертиза в 5 дней</div>
            <div className="flex items-center gap-2"><CheckCircle size={18} className="text-primary"/> BIM на всех этапах</div>
            <div className="flex items-center gap-2"><CheckCircle size={18} className="text-primary"/> ИИ-оптимизация решений</div>
          </div>
        </div>
      </div>
    </section>
  );
}