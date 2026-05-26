const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let leads = [];

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>КапСтрой</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial; background: #0039A6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
            .form { background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 100%; }
            input, select, textarea, button { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #ddd; }
            button { background: #0039A6; color: white; border: none; cursor: pointer; font-size: 16px; }
            h1 { color: #0039A6; text-align: center; }
        </style>
    </head>
    <body>
        <div class="form">
            <h1>🏗️ КапСтрой</h1>
            <form id="form">
                <input type="text" id="name" placeholder="Имя *" required>
                <input type="tel" id="phone" placeholder="Телефон *" required>
                <input type="email" id="email" placeholder="Email">
                <select id="projectType">
                    <option value="">Тип объекта</option>
                    <option>Административно-бытовой</option>
                    <option>Производственно-складской</option>
                    <option>Социальный / Санаторий</option>
                    <option>Жилой / Коттеджный</option>
                </select>
                <textarea id="description" rows="3" placeholder="Описание проекта"></textarea>
                <button type="submit">Отправить заявку</button>
            </form>
            <div id="result"></div>
        </div>
        <script>
            document.getElementById('form').onsubmit = async (e) => {
                e.preventDefault();
                const result = document.getElementById('result');
                result.innerHTML = '⏳ Отправка...';
                try {
                    const res = await fetch('/api/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: document.getElementById('name').value,
                            phone: document.getElementById('phone').value,
                            email: document.getElementById('email').value,
                            projectType: document.getElementById('projectType').value,
                            description: document.getElementById('description').value
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        result.innerHTML = '<p style="color:green">✅ Заявка отправлена!</p>';
                        document.getElementById('form').reset();
                    } else {
                        result.innerHTML = '<p style="color:red">❌ Ошибка</p>';
                    }
                } catch (err) {
                    result.innerHTML = '<p style="color:red">❌ Ошибка сервера</p>';
                }
            };
        </script>
    </body>
    </html>
  `);
});

// API
app.post('/api/submit', (req, res) => {
  const { name, phone, email, projectType, description } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Имя и телефон обязательны' });
  }
  const newLead = { id: Date.now(), name, phone, email, projectType, description, createdAt: new Date() };
  leads.push(newLead);
  console.log('📝 Заявка:', name, phone);
  res.json({ success: true, message: 'Заявка отправлена!' });
});

app.get('/api/leads', (req, res) => {
  res.json(leads);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Сервер на порту ' + PORT);
});