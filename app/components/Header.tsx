"use client";

import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { company } from "@/lib/company";

const navLinks = [
  { name: "О компании", href: "#about" },
  { name: "Услуги", href: "#services" },
  { name: "Проекты", href: "#projects" },
  { name: "BIM и ИИ", href: "#bim" },
  { name: "Экспертиза", href: "#expertise" },
  { name: "Команда", href: "#team" },
  { name: "Контакты", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b-[3px] border-[var(--red)] bg-gradient-to-br from-[var(--blue-deep)] via-[var(--blue-dark)] to-[#003399]">
        <div className="container-custom">
          <nav className="flex min-h-[52px] items-center justify-between gap-2 py-2 md:min-h-[56px] md:py-2.5">
            <a
              href="#hero"
              onClick={(e) => scrollTo(e, "#hero")}
              className="min-w-0 shrink font-heading text-base font-black tracking-tight text-white sm:text-lg md:text-xl"
            >
              <span className="text-[#e87070]">И</span>нж
              <span className="text-[#e87070]">К</span>ап
              <span className="text-[#e87070]">С</span>трой
            </a>

            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-sm font-medium text-white/85 transition hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={company.phoneHref}
                className="hidden items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-amber-300 xl:inline-flex"
              >
                <Phone size={16} />
                {company.phone}
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, "#contact")}
                className="rounded-full bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--red-dark)]"
              >
                Обсудить проект
              </a>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white lg:hidden"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[var(--blue-deep)]/60 backdrop-blur-sm"
            aria-label="Закрыть меню"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(320px,88vw)] flex-col bg-gradient-to-b from-[var(--blue-deep)] to-[var(--blue-dark)] p-5 pt-14 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-white">Меню</span>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg bg-white/10 p-2 text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <a href={company.phoneHref} className="mt-4 block rounded-lg bg-white/10 px-3 py-3 text-center font-semibold text-white">
              {company.phone}
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, "#contact")}
              className="mt-3 block rounded-full bg-[var(--red)] py-3 text-center font-semibold text-white"
            >
              Обсудить проект
            </a>
          </div>
        </div>
      )}
    </>
  );
}
