import Image from "next/image";

const projects = [
  { name: 'ЖК «Атмосфера»', desc: 'Многофункциональный жилой комплекс 85 000 м², BIM на всех этапах', img: 'https://picsum.photos/id/104/600/400', category: 'Жилая недвижимость' },
  { name: 'Технопарк «Инновации»', desc: 'Бизнес-центр класса А с интеллектуальными системами управления', img: 'https://picsum.photos/id/20/600/400', category: 'Коммерческая' },
  { name: 'Завод «СтройИндустрия»', desc: 'Промышленный комплекс с логистикой и инженерной инфраструктурой', img: 'https://picsum.photos/id/15/600/400', category: 'Промышленная' }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">Портфолио</span>
          <h2 className="section-title">Реализованные проекты</h2>
          <p className="section-sub">Более 400 000 м² качественной архитектуры по всей России</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden h-64">
                <Image src={project.img} alt={project.name} width={600} height={400} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-semibold bg-primary/80 px-3 py-1 rounded-full">{project.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.desc}</p>
                <button className="inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all">Подробнее →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}