export default function Expertise() {
    return (
      <section id="expertise" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-primary font-bold uppercase tracking-wider text-sm">Экспертиза и согласования</span>
            <h2 className="section-title">Успешное прохождение экспертиз любого уровня</h2>
            <p className="section-sub">Подтверждённый опыт согласования в ведущих российских экспертных организациях</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10 flex gap-4 items-start">
              <div className="text-3xl">📄</div><div><h3 className="font-bold text-lg">ГАУ «Московская государственная экспертиза»</h3><p className="text-gray-600">Согласование проектов на территории Москвы и Новой Москвы</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10 flex gap-4 items-start">
              <div className="text-3xl">🏛️</div><div><h3 className="font-bold text-lg">ФАУ «Главгосэкспертиза России»</h3><p className="text-gray-600">Федеральные и крупные инфраструктурные объекты</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10 flex gap-4 items-start">
              <div className="text-3xl">📑</div><div><h3 className="font-bold text-lg">ГАУ МО «Мособлгосэкспертиза»</h3><p className="text-gray-600">Проектирование объектов в Московской области</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10 flex gap-4 items-start">
              <div className="text-3xl">🔍</div><div><h3 className="font-bold text-lg">Ведомственные экспертизы</h3><p className="text-gray-600">Специализированные проверки в ведомственных структурах</p></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Согласование АГР в Москве — полный цикл</h3>
            <div className="grid md:grid-cols-5 gap-4 text-sm">
              <div><span className="font-bold">1.</span> BIM-модель IFC</div>
              <div><span className="font-bold">2.</span> Полигональные модели</div>
              <div><span className="font-bold">3.</span> Буклет АГР</div>
              <div><span className="font-bold">4.</span> Подача документов</div>
              <div><span className="font-bold">5.</span> Согласование</div>
            </div>
          </div>
        </div>
      </section>
    );
  }