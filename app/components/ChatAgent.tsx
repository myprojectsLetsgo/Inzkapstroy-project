"use client";

import { company } from "@/lib/company";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Какие услуги вы оказываете?",
  "Как пройти экспертизу в Москве?",
  "Расскажите о BIM и ИИ",
  "Как получить расчёт за 24 часа?",
];

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: `Здравствуйте! Я виртуальный консультант ${company.shortName}. Помогу с услугами, экспертизами, BIM/ИИ и примерами проектов. Чем могу помочь?`,
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--assistant chat-typing" aria-live="polite">
      <span />
      <span />
      <span />
    </div>
  );
}

export function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { id: createId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = nextMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = (await res.json()) as { content?: string; error?: string };

      if (!res.ok || !data.content) {
        throw new Error(data.error ?? "Ошибка ответа");
      }

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: data.content! },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: `Извините, сейчас не удалось обработать запрос. Позвоните нам: ${company.phone} или напишите на ${company.email}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const showSuggestions = !loading && messages.length <= 2;

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="iks-chat-panel"
        aria-label={open ? "Закрыть чат" : "Открыть чат с консультантом"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        <span>Консультант</span>
      </button>

      {open && (
        <div id="iks-chat-panel" className="chat-panel" role="dialog" aria-label="Чат с консультантом">
          <header className="chat-header">
            <div>
              <strong>Консультант {company.shortName}</strong>
              <p>Услуги, BIM, экспертизы и заявки</p>
            </div>
          </header>

          <div ref={listRef} className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble chat-bubble--${m.role}`}>
                {m.content.split("\n").map((line, i) => (
                  <p key={`${m.id}-${i}`}>{line || "\u00A0"}</p>
                ))}
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>

          {showSuggestions && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chat-suggestion"
                  disabled={loading}
                  onClick={() => void sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
              placeholder="Ваш вопрос…"
              rows={2}
              maxLength={2000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Отправить">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
