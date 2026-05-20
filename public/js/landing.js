// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку отправки
    const submitBtn = document.getElementById('submitButton');
    
    if (submitBtn) {
        // Убираем все старые обработчики и добавляем новый
        submitBtn.removeEventListener('click', submitForm);
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Собираем данные из формы
            const formData = {
                name: document.getElementById('fn')?.value || '',
                phone: document.getElementById('fp')?.value || '',
                email: document.getElementById('fe')?.value || '',
                description: document.getElementById('fd')?.value || '',
                consent: document.getElementById('consent')?.checked || false
            };
            
            // Валидация
            if (!formData.name || !formData.phone) {
                alert('Пожалуйста, заполните обязательные поля (Имя и Телефон)');
                return;
            }
            
            if (!formData.consent) {
                alert('Пожалуйста, согласитесь с политикой конфиденциальности');
                return;
            }
            
            // Показываем индикатор загрузки
            const btn = this;
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            
            try {
                const response = await fetch('/api/submit-lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Показываем сообщение об успехе
                    const formContent = document.getElementById('formContent');
                    const formOk = document.getElementById('formOk');
                    if (formContent) formContent.style.display = 'none';
                    if (formOk) formOk.style.display = 'block';
                    
                    // Очищаем форму
                    const fn = document.getElementById('fn');
                    const fp = document.getElementById('fp');
                    const fe = document.getElementById('fe');
                    const fd = document.getElementById('fd');
                    const consent = document.getElementById('consent');
                    
                    if (fn) fn.value = '';
                    if (fp) fp.value = '';
                    if (fe) fe.value = '';
                    if (fd) fd.value = '';
                    if (consent) consent.checked = false;
                } else {
                    alert('Ошибка при отправке: ' + (result.error || 'Попробуйте позже'));
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка соединения. Пожалуйста, попробуйте позже или позвоните нам.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
});

// Старая функция для совместимости (если нужно)
window.submitForm = function() {
    const btn = document.getElementById('submitButton');
    if (btn) {
        btn.click();
    }
};
