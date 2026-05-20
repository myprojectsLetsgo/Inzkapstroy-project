async function submitForm() {
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
    const btn = document.querySelector('.form-btn');
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
            document.getElementById('formContent').style.display = 'none';
            document.getElementById('formOk').style.display = 'block';
            
            // Очищаем форму
            document.getElementById('fn').value = '';
            document.getElementById('fp').value = '';
            document.getElementById('fe').value = '';
            document.getElementById('fd').value = '';
            document.getElementById('consent').checked = false;
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
}

// Функция для маски телефона
function maskPhone(input) {
    let value = input.value.replace(/\\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length === 11) {
        value = value.replace(/(\\d{1})(\\d{3})(\\d{3})(\\d{2})(\\d{2})/, '+ () --');
    }
    input.value = value;
}

// Добавляем обработчик для маски телефона при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('fp');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            maskPhone(this);
        });
    }
});
