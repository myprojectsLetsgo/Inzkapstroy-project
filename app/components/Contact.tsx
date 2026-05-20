"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Заявка с сайта — ${formData.name}`);
    const body = encodeURIComponent(`Имя: ${formData.name}\nEmail: ${formData.email}\n\nСообщение:\n${formData.message}`);
    window.location.href = `mailto:info@iks-pro.ru?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-wider">Связь</span>
          <h2 className="section-title">Обсудите ваш проект</h2>
          <p className="section-sub">Оставьте заявку — мы свяжемся с вами в течение 24 часов</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50"><MapPin className="text-primary w-6 h-6 mt-1" /><div><h4 className="font-bold">Офис в Москве</h4><p className="text-gray-600">Ленинградский проспект, 80, БЦ "ИнжКап"</p></div></div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50"><Phone className="text-primary w-6 h-6 mt-1" /><div><h4 className="font-bold">Телефон</h4><p className="text-gray-600">+7 (495) 123-45-67</p></div></div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50"><Mail className="text-primary w-6 h-6 mt-1" /><div><h4 className="font-bold">Email</h4><p className="text-gray-600">info@ingkapstroy.ru</p></div></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg border">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ваше имя" className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
            <textarea name="message" rows={4} value={formData.message} onChange={handleChange} required placeholder="Опишите задачу или тип объекта" className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary outline-none"></textarea>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md">Отправить заявку <Send size={18} /></button>
            {submitted && <p className="text-green-600 text-center text-sm">✔ Заявка отправлена! Менеджер свяжется с вами.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}