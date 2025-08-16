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
                        
                        <div class="store-buttons">
                            <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" class="store-button">
                                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store">
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.tanchuev.path" target="_blank" class="store-button google">
                                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play">
                            </a>
                            <a href="https://apps.rustore.ru/app/YOUR_APP_ID" target="_blank" class="store-button rustore">
                                <img src="https://www.rustore.ru/help/icons/logo-color-dark.png" alt="Доступно в RuStore">
                            </a>
                        </div>
                    </header>
                    
                    <div class="main-content">
                        <!-- Основной контент -->
                    </div>
                    
                    <footer class="footer">
                        <div class="footer-links">
                            <button class="footer-link" onclick="router.navigate('/feedback')">
                                Обратная связь
                            </button>
                            <p class="privacy-text" onclick="router.navigate('/privacy')">
                                Политика конфиденциальности
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        `;
    }
    
    renderPrivacy() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="page-container">
                <div class="background-container">
                    <img src="assets/html_landing_background.jpg" alt="Background" class="background-image">
                </div>
                
                <div class="content page-content">
                    <header class="page-header">
                        <button class="back-button" onclick="router.navigate('/')">
                            ← Назад
                        </button>
                        <h1>Политика конфиденциальности</h1>
                    </header>
                    
                    <div class="page-body">
                        <div class="privacy-content">
                            <p>Здесь будет содержание политики конфиденциальности.</p>
                            <p>Дата последнего обновления: ${new Date().toLocaleDateString('ru-RU')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
                            ← Назад
                        </button>
                        <h1>Обратная связь</h1>
                    </header>
                    
                    <div class="page-body">
                        <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
                            <div class="form-group">
                                <label for="name">Ваше имя</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Сообщение</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            
                            <button type="submit" class="submit-button">
                                Отправить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
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
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    
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