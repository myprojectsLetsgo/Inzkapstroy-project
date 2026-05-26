const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let leads = [];

app.post('/api/submit', (req, res) => {
  const { name, phone, email, projectType, description } = req.body;
  
  console.log('📝 Заявка от:', name, phone);
  
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Имя и телефон обязательны' });
  }
  
  const newLead = {
    id: Date.now(),
    name,
    phone,
    email: email || '',
    projectType: projectType || '',
    description: description || '',
    createdAt: new Date()
  };
  
  leads.push(newLead);
  console.log('✅ Сохранено. Всего заявок:', leads.length);
  
  res.json({ success: true, message: 'Заявка отправлена!' });
});

app.get('/api/leads', (req, res) => {
  res.json({ success: true, data: leads });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('🚀 Сервер запущен на http://localhost:' + PORT);
  console.log('📋 API: http://localhost:' + PORT + '/api/submit');
});