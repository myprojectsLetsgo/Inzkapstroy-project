import Image from "next/image";

const team = [
  { name: 'Алексей Ковалёв', role: 'Главный инженер, CEO', exp: '20 лет в проектировании', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Елена Морозова', role: 'Руководитель BIM-отдела', exp: 'Эксперт по цифровым двойникам', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Дмитрий Белов', role: 'Главный архитектор', exp: 'Автор 15+ знаковых объектов', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

export default function Team() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-primary font-bold uppercase tracking-wider">Ключевые эксперты</span>
          <h2 className="section-title">50+ профессионалов своего дела</h2>
          <p className="section-sub">Мультидисциплинарная команда, объединённая страстью к инженерии</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden text-center transition-all hover:shadow-xl">
              <div className="h-72 overflow-hidden bg-gray-200 relative">
                <Image src={member.img} alt={member.name} width={300} height={300} className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-dark">{member.name}</h3>
                <p className="text-primary font-semibold mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-1">{member.exp}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 text-gray-500">+ 47 инженеров, проектировщиков, 3D-визуализаторов</div>
      </div>
    </section>
  );
}