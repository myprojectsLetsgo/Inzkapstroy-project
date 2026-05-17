"use client";

import type { Lead, LeadStatus } from "@/lib/types/lead";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
  rejected: "Отклонена",
};

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const load = useCallback(async () => {
    const sessionRes = await fetch("/api/auth/session");
    if (!sessionRes.ok) {
      window.location.href = "/admin/login";
      return;
    }
    const session = (await sessionRes.json()) as { username: string };
    setUsername(session.username);

    const res = await fetch("/api/leads");
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { leads: Lead[] };
    setLeads(data.leads);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { lead: Lead };
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить заявку?")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const counts = {
    new: leads.filter((l) => l.status === "new").length,
    in_progress: leads.filter((l) => l.status === "in_progress").length,
    done: leads.filter((l) => l.status === "done").length,
  };

  return (
    <>
      <header className="admin-header">
        <h1>Заявки с сайта — {username}</h1>
        <div className="admin-header-actions">
          <Link href="/">На сайт</Link>
          <button type="button" onClick={() => void load()}>
            Обновить
          </button>
          <button type="button" onClick={() => void logout()}>
            Выйти
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{counts.new}</strong>
            <span>Новые</span>
          </div>
          <div className="admin-stat">
            <strong>{counts.in_progress}</strong>
            <span>В работе</span>
          </div>
          <div className="admin-stat">
            <strong>{counts.done}</strong>
            <span>Завершённые</span>
          </div>
          <div className="admin-stat">
            <strong>{leads.length}</strong>
            <span>Всего</span>
          </div>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <p className="admin-empty">Загрузка…</p>
          ) : leads.length === 0 ? (
            <p className="admin-empty">Заявок пока нет</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Контакты</th>
                  <th>Описание</th>
                  <th>Статус</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      {new Date(lead.createdAt).toLocaleString("ru-RU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{lead.name}</td>
                    <td>
                      <div>{lead.phone}</div>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      )}
                    </td>
                    <td>{lead.description || "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${lead.status}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                      <br />
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          void updateStatus(lead.id, e.target.value as LeadStatus)
                        }
                        aria-label="Статус заявки"
                      >
                        {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => void remove(lead.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}

