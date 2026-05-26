"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    message: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Валидация
    if (!formData.name.trim()) {
      setError("Пожалуйста, укажите ваше имя");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.phone.trim()) {
      setError("Пожалуйста, укажите телефон для связи");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setError("Пожалуйста, укажите email");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          description: formData.message.trim(),
          privacyAccepted: true
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || "Ошибка при отправке. Попробуйте позже.");
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError("Ошибка соединения. Проверьте интернет и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50">
              <MapPin className="text-primary w-6 h-6 mt-1" />
              <div>
                <h4 className="font-bold">Офис в Москве</h4>
                <p className="text-gray-600">Ленинградский проспект, 80, БЦ "ИнжКап"</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50">
              <Phone className="text-primary w-6 h-6 mt-1" />
              <div>
                <h4 className="font-bold">Телефон</h4>
                <p className="text-gray-600">+7 (495) 123-45-67</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50">
              <Mail className="text-primary w-6 h-6 mt-1" />
              <div>
                <h4 className="font-bold">Email</h4>
                <p className="text-gray-600">info@ingkapstroy.ru</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg border">
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Ваше имя *" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
            />
            
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="Телефон *" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
            />
            
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="Email *" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" 
            />
            
            <textarea 
              name="message" 
              rows={4} 
              value={formData.message} 
              onChange={handleChange} 
              required 
              placeholder="Опишите задачу или тип объекта *" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary outline-none"
            />
            
            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}
            
            {submitted && (
              <p className="text-green-600 text-center text-sm">
                ✔ Заявка отправлена! Менеджер свяжется с вами.
              </p>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}