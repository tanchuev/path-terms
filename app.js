// Простой роутер для SPA
class SimpleRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        // Обработка изменения URL
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Инициализация
        this.init();
    }
    
    init() {
        // Регистрация маршрутов
        this.register('/', this.renderLanding);
        this.register('/privacy', this.renderPrivacy);
        this.register('/feedback', this.renderFeedback);
        
        // Обработка начального маршрута
        this.handleRoute();
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const handler = this.routes[path] || this.routes['/'];
        
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
                    <header class="page-header">
                        <button class="back-button" onclick="router.navigate('/')">
                            ← Back
                        </button>
                        <h1>Privacy Policy</h1>
                    </header>
                    
                    <div class="page-body">
                        <div class="privacy-content">
                            <div class="loading">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        try {
            const markdownContent = await this.loadMarkdownFile('privacy_policy.md');
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
                    <header class="page-header">
                        <button class="back-button" onclick="router.navigate('/')">
                            ← Back
                        </button>
                        <h1>Feedback & Support</h1>
                    </header>
                    
                    <div class="page-body">
                        <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            
                            <button type="submit" class="submit-button">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
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

// Обработчик отправки формы обратной связи
function handleFeedbackSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Здесь можно добавить отправку данных на сервер
    console.log('Данные формы:', data);
    
    // Показать уведомление об успешной отправке
    alert('Thank you for your message! We will contact you soon.');
    
    // Очистить форму
    event.target.reset();
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