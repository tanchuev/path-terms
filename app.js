// Простой роутер для SPA
class SimpleRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        // Определение базового пути для GitHub Pages
        this.basePath = this.getBasePath();
        
        // Обработка изменения URL
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Инициализация
        this.init();
    }
    
    getBasePath() {
        // Проверяем, если это GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            // Для GitHub Pages вида username.github.io/repository-name
            // Базовый путь всегда /path-terms
            return '/path-terms';
        }
        return '';
    }
    
    init() {
        // Регистрация маршрутов с учетом базового пути
        this.register(this.basePath + '/', this.renderLanding);
        this.register(this.basePath + '/privacy', this.renderPrivacy);
        this.register(this.basePath + '/feedback', this.renderFeedback);
        
        // Обработка начального маршрута
        this.handleRoute();
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    navigate(path) {
        const fullPath = this.basePath + path;
        window.history.pushState({}, '', fullPath);
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const handler = this.routes[path] || this.routes[this.basePath + '/'];
        
        if (handler) {
            handler.call(this);
        }
    }
    
    renderLanding() {
        const app = document.getElementById('app');
        
        // Массив скриншотов
        const screenshots = [
            'Screenshot_1755113086.png',
            'Screenshot_1755113166.png',
            'Screenshot_1755113220.png',
            'Screenshot_1755113260.png',
            'Screenshot_1755113298.png',
            'Screenshot_1755113337.png',
            'Screenshot_1755113416.png',
            'Screenshot_1755113533.png'
        ];
        
        app.innerHTML = `
            <div class="landing-page">
                <div class="background-container">
                    <img src="assets/html_landing_background.jpg" alt="Background" class="background-image">
                </div>
                
                <div class="content">
                    <header class="header">
                        <h1 class="game-title">Path</h1>
                        <p class="game-subtitle">Zen. Flow. Puzzle.</p>
                        
                        <div class="glowing-orb"></div>
                    </header>
                    
                    <section class="download-section">
                        <div class="store-buttons">
                            <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" class="store-button app-store" aria-label="Download on the App Store">
                                <img src="assets/badges/app-store-badge-en.svg" alt="Download on the App Store">
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.tanchuev.path" target="_blank" class="store-button google-play" aria-label="Get it on Google Play">
                                <img src="assets/badges/google-play-badge.svg" alt="Get it on Google Play">
                            </a>
                            <a href="https://apps.rustore.ru/app/YOUR_APP_ID" target="_blank" class="store-button rustore" aria-label="Доступно в RuStore">
                                <img src="assets/badges/rustore-badge.svg" alt="Доступно в RuStore">
                            </a>
                        </div>
                    </section>
                    
                    <section class="screenshots-section">
                        <div class="screenshots-container">
                            <div class="screenshots-track" id="screenshotsTrack">
                                ${screenshots.map((screenshot, index) => `
                                    <div class="screenshot-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                                        <img src="assets/screenshots/${screenshot}" alt="Path Screenshot ${index + 1}" loading="lazy">
                                    </div>
                                `).join('')}
                            </div>
                            <div class="screenshots-dots">
                                ${screenshots.map((_, index) => `
                                    <button class="screenshot-dot ${index === 0 ? 'active' : ''}" data-index="${index}" onclick="router.goToSlide(${index})"></button>
                                `).join('')}
                            </div>
                            <button class="screenshot-nav screenshot-prev" onclick="router.prevSlide()">‹</button>
                            <button class="screenshot-nav screenshot-next" onclick="router.nextSlide()">›</button>
                        </div>
                    </section>
                    
                    <footer class="footer">
                        <div class="footer-content">
                            <button class="footer-link feedback-btn" onclick="router.navigate('/feedback')">
                                Feedback & Support
                            </button>
                            <a class="footer-link privacy-link" onclick="router.navigate('/privacy')">
                                Privacy Policy
                            </a>
                        </div>
                    </footer>
                </div>
            </div>
        `;
        
        // Инициализация слайдера после рендеринга
        this.initSlider();
    }
    
    // Методы для управления слайдером
    initSlider() {
        this.currentSlide = 0;
        this.totalSlides = 8;
        this.autoPlayInterval = null;
        
        // Автоматическое переключение слайдов
        this.startAutoPlay();
        
        // Свайп для мобильных устройств
        this.initTouchEvents();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    updateSlider() {
        const track = document.getElementById('screenshotsTrack');
        if (!track) return;
        
        // Обновление позиции трека
        track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Обновление активного слайда
        document.querySelectorAll('.screenshot-slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Обновление точек
        document.querySelectorAll('.screenshot-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    initTouchEvents() {
        const container = document.querySelector('.screenshots-container');
        if (!container) return;
        
        let startX = 0;
        let endX = 0;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        });
    }
    
    async renderPrivacy() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="page-container">
                <div class="background-container">
                    <img src="assets/html_landing_background.jpg" alt="Background" class="background-image">
                </div>
                
                <div class="content page-content">
                    <div class="page-body">
                        <div class="privacy-content">
                            <div class="loading">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        try {
            const privacyPath = this.basePath ? `${this.basePath}/privacy_policy.md` : 'privacy_policy.md';
            const markdownContent = await this.loadMarkdownFile(privacyPath);
            const htmlContent = this.parseMarkdown(markdownContent);
            
            const privacyContentDiv = document.querySelector('.privacy-content');
            privacyContentDiv.innerHTML = htmlContent;
        } catch (error) {
            console.error('Error loading privacy policy:', error);
            const privacyContentDiv = document.querySelector('.privacy-content');
            privacyContentDiv.innerHTML = '<p>Error loading privacy policy. Please try again later.</p>';
        }
    }
    
    renderFeedback() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="page-container">
                <div class="background-container">
                    <img src="assets/html_landing_background.jpg" alt="Background" class="background-image">
                </div>
                
                <div class="content page-content">
                    <header class="page-header feedback-header">
                        <h1>Feedback&nbsp;&amp;&nbsp;Support</h1>
                    </header>
                    
                    <div class="page-body">
                        <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
                            <!-- Скрытые поля для Web3Forms -->
                            <input type="hidden" name="access_key" value="${WEB3FORMS_CONFIG.accessKey}">
                            <input type="hidden" name="subject" value="Path Game Feedback">
                            <input type="hidden" name="from_name" value="">
                            <input type="hidden" name="redirect" value="${window.location.href}">
                            
                            <div class="form-group">
                                <label for="category">Category</label>
                                <select id="category" name="category" required>
                                    <option value="">Select category</option>
                                    <option value="bug">🐛 Bug Report</option>
                                    <option value="feature">💡 Feature Request</option>
                                    <option value="general">💬 General Feedback</option>
                                    <option value="support">🔧 Support</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" name="name" maxlength="50" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" maxlength="100" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="5" minlength="10" maxlength="2000" required placeholder="Please describe your feedback in detail..."></textarea>
                                <div class="char-counter">
                                    <span id="charCount">0</span>/2000
                                </div>
                            </div>
                            
                            <button type="submit" class="submit-button" id="submitButton">
                                <span class="button-text">Send Message</span>
                                <span class="button-loader" style="display: none;">
                                    <div class="spinner"></div>
                                    Sending...
                                </span>
                            </button>
                        </form>
                        
                        <!-- Toast container -->
                        <div class="toast-container" id="toastContainer"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Инициализация счетчика символов
        this.initCharCounter();
        
        // Восстановление сохраненных данных
        this.restoreFormData();
    }
    
    // Инициализация счетчика символов
    initCharCounter() {
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const currentLength = messageTextarea.value.length;
                charCount.textContent = currentLength;
                
                if (currentLength > 900) {
                    charCount.style.color = '#ff6b6b';
                } else if (currentLength > 750) {
                    charCount.style.color = '#ffa726';
                } else {
                    charCount.style.color = '#rgba(255, 255, 255, 0.7)';
                }
                
                // Автосохранение в localStorage
                this.saveFormData();
            });
            
            // Обновляем счетчик при инициализации
            charCount.textContent = messageTextarea.value.length;
        }
        
        // Автосохранение для других полей
        const inputs = ['name', 'email', 'category'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.saveFormData();
                    // Обновляем скрытое поле from_name для Web3Forms
                    if (id === 'name') {
                        const hiddenFromName = document.querySelector('input[name="from_name"]');
                        if (hiddenFromName) {
                            hiddenFromName.value = element.value;
                        }
                    }
                    // Валидация email в реальном времени
                    if (id === 'email') {
                        this.validateEmailField(element);
                    }
                });
                
                // Валидация при потере фокуса
                if (id === 'email') {
                    element.addEventListener('blur', () => {
                        this.validateEmailField(element);
                    });
                }
            }
        });
    }
    
    // Сохранение данных формы в localStorage
    saveFormData() {
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            category: document.getElementById('category')?.value || '',
            message: document.getElementById('message')?.value || '',
            timestamp: Date.now()
        };
        
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
    }
    
    // Восстановление данных формы из localStorage
    restoreFormData() {
        try {
            const savedData = localStorage.getItem('feedbackFormData');
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                // Проверяем, что данные не старше 24 часов
                const maxAge = 24 * 60 * 60 * 1000; // 24 часа
                if (Date.now() - formData.timestamp > maxAge) {
                    localStorage.removeItem('feedbackFormData');
                    return;
                }
                
                // Восстанавливаем данные
                if (formData.name) {
                    document.getElementById('name').value = formData.name;
                    // Обновляем скрытое поле from_name
                    const hiddenFromName = document.querySelector('input[name="from_name"]');
                    if (hiddenFromName) {
                        hiddenFromName.value = formData.name;
                    }
                }
                if (formData.email) document.getElementById('email').value = formData.email;
                if (formData.category) document.getElementById('category').value = formData.category;
                if (formData.message) {
                    document.getElementById('message').value = formData.message;
                    document.getElementById('charCount').textContent = formData.message.length;
                }
            }
        } catch (error) {
            console.error('Error restoring form data:', error);
            localStorage.removeItem('feedbackFormData');
        }
    }
    
    // Валидация поля email с визуальной обратной связью
    validateEmailField(emailElement) {
        const email = emailElement.value.trim();
        
        // Убираем предыдущие классы валидации
        emailElement.classList.remove('email-valid', 'email-invalid');
        
        // Если поле пустое, не показываем ошибку
        if (email.length === 0) {
            return;
        }
        
        // Проверяем валидность
        if (isValidEmail(email)) {
            emailElement.classList.add('email-valid');
        } else {
            emailElement.classList.add('email-invalid');
        }
    }
    
    // Загрузка markdown файла
    async loadMarkdownFile(filename) {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        return await response.text();
    }
    
    // Простой парсер markdown
    parseMarkdown(markdown) {
        let html = markdown;
        
        // Заголовки
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Жирный текст
        html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
        
        // Ссылки
        html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank">$1</a>');
        
        // Разделение на параграфы
        const paragraphs = html.split('\n\n').filter(p => p.trim().length > 0);
        
        let result = '';
        for (let paragraph of paragraphs) {
            paragraph = paragraph.trim();
            
            // Проверяем, если это заголовок
            if (paragraph.startsWith('<h')) {
                result += paragraph + '\n';
            }
            // Проверяем, если это список
            else if (paragraph.includes('\n- ')) {
                const listItems = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
                const nonListLines = paragraph.split('\n').filter(line => !line.trim().startsWith('- ') && line.trim().length > 0);
                
                // Добавляем строки перед списком
                for (let line of nonListLines) {
                    if (line.trim().length > 0) {
                        result += `<p>${line.trim()}</p>\n`;
                    }
                }
                
                // Добавляем список
                if (listItems.length > 0) {
                    result += '<ul>\n';
                    for (let item of listItems) {
                        const itemText = item.replace('- ', '').trim();
                        result += `<li>${itemText}</li>\n`;
                    }
                    result += '</ul>\n';
                }
            }
            // Обычный параграф
            else {
                const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
                for (let line of lines) {
                    if (!line.startsWith('<h') && line.trim().length > 0) {
                        result += `<p>${line.trim()}</p>\n`;
                    } else if (line.startsWith('<h')) {
                        result += line + '\n';
                    }
                }
            }
        }
        
        return result;
    }
}

// Конфигурация Web3Forms
const WEB3FORMS_CONFIG = {
    accessKey: 'eb75d3c9-6a71-42c7-a111-14515b05661b',
    endpoint: 'https://api.web3forms.com/submit'
};

// Обработчик отправки формы обратной связи
async function handleFeedbackSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Проверка rate limiting
    if (!checkRateLimit()) {
        showToast('Please wait before sending another message. You can send one message every 5 minutes.', 'warning');
        return;
    }
    
    
    // Проверка валидности email
    if (!isValidEmail(data.email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Проверка на подозрительный контент
    if (isSpamContent(data.message)) {
        showToast('Your message was flagged as spam. Please revise your content.', 'error');
        return;
    }
    
    // Показать состояние загрузки
    setSubmitButtonLoading(true);
    
    try {
        // Отправка через Web3Forms
        await sendWeb3Forms(data);
        
        // Успешная отправка
        showToast('Thank you for your message! We will contact you soon.', 'success');
        
        // Очистить форму и localStorage
        form.reset();
        localStorage.removeItem('feedbackFormData');
        document.getElementById('charCount').textContent = '0';
        
        // Установить rate limit
        setRateLimit();
        
    } catch (error) {
        console.error('Error sending feedback:', error);
        showToast('Failed to send message. Please try again or contact us directly at path.game@yandex.com', 'error');
    } finally {
        setSubmitButtonLoading(false);
    }
}

// Отправка email через Web3Forms
async function sendWeb3Forms(data) {
    // Подготовка данных для Web3Forms
    const formData = new FormData();
    
    // Обязательные поля Web3Forms
    formData.append('access_key', WEB3FORMS_CONFIG.accessKey);
    formData.append('subject', `Path Game Feedback - ${data.category}`);
    formData.append('from_name', data.name);
    formData.append('email', data.email);
    formData.append('message', data.message);
    
    // Дополнительные поля
    formData.append('category', data.category);
    formData.append('redirect', window.location.href); // Redirect обратно на страницу
    
    // Отправка запроса
    const response = await fetch(WEB3FORMS_CONFIG.endpoint, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
}

// Проверка rate limiting (1 сообщение в 5 минут)
function checkRateLimit() {
    const lastSubmit = localStorage.getItem('lastFeedbackSubmit');
    if (!lastSubmit) return true;
    
    const timeDiff = Date.now() - parseInt(lastSubmit);
    const rateLimit = 5 * 60 * 1000; // 5 минут
    
    return timeDiff >= rateLimit;
}

// Установка rate limit
function setRateLimit() {
    localStorage.setItem('lastFeedbackSubmit', Date.now().toString());
}

// Валидация email
function isValidEmail(email) {
    // Базовая проверка на пустоту
    if (!email || email.trim().length === 0) {
        return false;
    }
    
    // Удаляем лишние пробелы
    email = email.trim();
    
    // Проверка длины
    if (email.length < 5 || email.length > 254) {
        return false;
    }
    
    // Регулярное выражение для валидации email (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Проверка структуры (должна быть одна @)
    const atSymbolCount = (email.match(/@/g) || []).length;
    if (atSymbolCount !== 1) {
        return false;
    }
    
    // Разделяем на локальную часть и домен
    const [localPart, domain] = email.split('@');
    
    // Проверка локальной части
    if (localPart.length === 0 || localPart.length > 64) {
        return false;
    }
    
    // Проверка домена
    if (domain.length === 0 || domain.length > 253) {
        return false;
    }
    
    // Домен не должен начинаться или заканчиваться точкой или дефисом
    if (domain.startsWith('.') || domain.endsWith('.') || 
        domain.startsWith('-') || domain.endsWith('-')) {
        return false;
    }
    
    // Проверка наличия точки в домене (должен быть как минимум один поддомен)
    if (!domain.includes('.')) {
        return false;
    }
    
    // Проверка на двойные точки
    if (domain.includes('..') || localPart.includes('..')) {
        return false;
    }
    
    // Дополнительные проверки на подозрительные домены
    const suspiciousDomains = [
        'test.com', 'example.com', 'temp-mail.org', '10minutemail.com',
        'guerrillamail.com', 'mailinator.com', 'throwaway.email'
    ];
    
    const lowerDomain = domain.toLowerCase();
    if (suspiciousDomains.some(suspicious => lowerDomain.includes(suspicious))) {
        return false;
    }
    
    // Проверка TLD (должен быть как минимум 2 символа)
    const tld = domain.split('.').pop();
    if (tld.length < 2) {
        return false;
    }
    
    return true;
}

// Проверка на спам контент
function isSpamContent(message) {
    const spamKeywords = [
        'http://', 'https://', 'www.', '.com', '.ru', '.org',
        'casino', 'viagra', 'lottery', 'winner', 'congratulations',
        'click here', 'free money', 'urgent', 'limited time'
    ];
    
    const lowerMessage = message.toLowerCase();
    const spamCount = spamKeywords.filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
    ).length;
    
    // Если больше 2 спам-слов или сообщение слишком короткое
    return spamCount > 2 || message.trim().length < 10;
}

// Управление состоянием кнопки отправки
function setSubmitButtonLoading(isLoading) {
    const button = document.getElementById('submitButton');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    if (isLoading) {
        button.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'flex';
    } else {
        button.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

// Показать toast уведомление
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="closeToast(this)">×</button>
    `;
    
    container.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => closeToast(toast.querySelector('.toast-close')), 5000);
}

// Закрыть toast
function closeToast(closeButton) {
    const toast = closeButton.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
}

// Инициализация роутера при загрузке страницы
let router;
document.addEventListener('DOMContentLoaded', () => {
    router = new SimpleRouter();
});

// Определение ориентации устройства
function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && isPortrait) {
        document.body.classList.add('mobile-portrait');
    } else {
        document.body.classList.remove('mobile-portrait');
    }
}

// Проверка ориентации при загрузке и изменении размера окна
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
document.addEventListener('DOMContentLoaded', checkOrientation);