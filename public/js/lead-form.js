// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('leadForm');
  
  if (!form) {
    console.error('Форма не найдена!');
    return;
  }
  
  console.log('✅ Форма найдена, скрипт загружен');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('📝 Форма отправлена');
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    const formData = {
      name: document.getElementById('fn')?.value || '',
      phone: document.getElementById('fp')?.value || '',
      email: document.getElementById('fe')?.value || '',
      description: document.getElementById('fd')?.value || '',
      privacyAccepted: document.getElementById('consent')?.checked || false
    };
    
    console.log('📤 Отправка данных:', formData);
    
    if (!formData.name) {
      alert('Пожалуйста, укажите ваше имя');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    if (!formData.phone) {
      alert('Пожалуйста, укажите телефон для связи');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('📥 Ответ сервера:', data);
      
      if (response.ok && data.success) {
        const formContent = document.getElementById('formContent');
        const formOk = document.getElementById('formOk');
        
        if (formContent && formOk) {
          formContent.style.display = 'none';
          formOk.style.display = 'block';
        } else {
          alert('✅ Заявка успешно отправлена!');
        }
        
        form.reset();
        
        setTimeout(() => {
          if (formContent && formOk) {
            formContent.style.display = 'block';
            formOk.style.display = 'none';
          }
        }, 5000);
      } else {
        alert(data.error || 'Ошибка при отправке');
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      alert('Ошибка соединения. Попробуйте позже.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
