"use client";

import { useState, useEffect } from "react";

export default function AdminJSON() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submit-lead", {
      headers: { "Authorization": "Bearer admin-secret-2026" }
    })
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Загрузка...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0039A6" }}>📋 Заявки (JSON)</h1>
      <p>Всего заявок: <strong>{leads.length}</strong></p>
      <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#0039A6", color: "white" }}>
          <tr>
            <th>ID</th><th>Дата</th><th>Имя</th><th>Телефон</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{new Date(lead.createdAt).toLocaleString()}</td>
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td>{lead.email || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
