// static/js/animations.js с интеграцией Particles.js

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Particles.js (только на главной странице)
    if (document.getElementById('particles-js')) {
        initParticles();
    }

    // Инициализация остальных анимаций
    initScrollAnimations();
    initNavigationEffects();
    initTypewriterEffect();
    initMouseFollower();
    initClickEffects();
    initPageTransitions();
});

// Инициализация Particles.js
function initParticles() {
    // Используем конфигурацию из particles.js
    const config = getParticlesConfig();

    particlesJS('particles-js', config);

    // Адаптация particles.js под размер экрана
    window.addEventListener('resize', function () {
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            // Перезагружаем с подходящей конфигурацией при изменении размера
            const newConfig = getParticlesConfig();
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            particlesJS('particles-js', newConfig);
        }
    });

// Создание селектора тем частиц
    function createParticleThemeSelector() {
        const selector = document.createElement('div');
        selector.className = 'particles-theme-selector';
        selector.innerHTML = `
        <button class="theme-toggle" title="Смена темы частиц">
            <span class="theme-icon">✨</span>
        </button>
        <div class="theme-options">
            <button data-theme="default">По умолчанию</button>
            <button data-theme="stars">Звёзды</button>
            <button data-theme="network">Сеть</button>
            <button data-theme="minimal">Минимал</button>
        </div>
    `;

        // Добавляем стили
        const style = document.createElement('style');
        style.textContent = `
        .particles-theme-selector {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
        }
        
        .theme-toggle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: white;
            cursor: pointer;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .theme-options {
            position: absolute;
            top: 60px;
            right: 0;
            background: rgba(15, 15, 35, 0.95);
            border-radius: 10px;
            padding: 10px;
            min-width: 150px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .particles-theme-selector:hover .theme-options,
        .theme-options:hover {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .theme-options button {
            width: 100%;
            padding: 8px 12px;
            border: none;
            background: transparent;
            color: white;
            cursor: pointer;
            border-radius: 6px;
            margin: 2px 0;
            font-size: 0.9rem;
            transition: background 0.2s ease;
        }
        
        .theme-options button:hover {
            background: rgba(99, 102, 241, 0.3);
        }
        
        @media (max-width: 768px) {
            .particles-theme-selector {
                top: 80px;
                right: 10px;
            }
            
            .theme-toggle {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
        }
    `;
        document.head.appendChild(style);

        // Обработчики событий
        selector.querySelector('.theme-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            const options = selector.querySelector('.theme-options');
            options.style.opacity = options.style.opacity === '1' ? '0' : '1';
            options.style.visibility = options.style.visibility === 'visible' ? 'hidden' : 'visible';
        });

        selector.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                changeParticlesTheme(theme);

                // Закрываем меню
                const options = selector.querySelector('.theme-options');
                options.style.opacity = '0';
                options.style.visibility = 'hidden';

                // Сохраняем выбор
                localStorage.setItem('particles-theme', theme);
            });
        });

        document.body.appendChild(selector);

        // Восстановляем сохранённую тему
        const savedTheme = localStorage.getItem('particles-theme');
        if (savedTheme && savedTheme !== 'default') {
            setTimeout(() => {
                changeParticlesTheme(savedTheme);
            }, 1000);
        }
    }

// Анимации при скролле
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Специальные анимации для статистики
                    if (entry.target.classList.contains('stat-number')) {
                        animateNumber(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Наблюдение за элементами
        const animatedElements = document.querySelectorAll(
            '.feature-card, .hero-content, .section-title, .stat-item'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

// Анимация чисел в статистике
    function animateNumber(element) {
        const finalValue = element.textContent;
        const isInfinity = finalValue === '∞';

        if (isInfinity) {
            element.style.animation = 'pulse 2s ease-in-out infinite';
            return;
        }

        const numValue = parseInt(finalValue.replace(/\D/g, ''));
        const suffix = finalValue.replace(/[\d]/g, '');
        let currentValue = 0;
        const increment = numValue / 50;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numValue) {
                currentValue = numValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue) + suffix;
        }, 30);
    }

// Эффекты навигации
    function initNavigationEffects() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Изменение навигации при скролле
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
                navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.boxShadow = 'none';
                navbar.style.backdropFilter = 'blur(10px)';
            }

            // Скрытие/показ навигации при скролле
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        // Активная ссылка
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath ||
                (currentPath === '/' && link.getAttribute('href') === '/')) {
                link.classList.add('active');
            }
        });
    }

// Эффект печатающего текста для заголовков
    function initTypewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--primary-color)';

        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Мигание курсора
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }

        // Запуск после небольшой задержки
        setTimeout(typeWriter, 1500);
    }

// Следование мыши для интерактивных элементов
    function initMouseFollower() {
        const cards = document.querySelectorAll('.feature-card, .stat-item');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });

            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                this.style.transform = `
                translateY(-10px) 
                scale(1.05)
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                perspective(1000px)
            `;
            });
        });
    }

// Эффекты клика
    function initClickEffects() {
        document.addEventListener('click', function (e) {
            if (e.target.closest('.btn') || e.target.closest('.nav-link') || e.target.closest('.feature-link')) {
                createRippleEffect(e);
            }
        });
    }

    function createRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;

        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

// Плавные переходы между страницами
    function initPageTransitions() {
        // Анимация появления страницы
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);

        // Анимация при переходе по ссылкам
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"])');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    e.preventDefault();

                    document.body.style.opacity = '0';
                    document.body.style.transform = 'translateY(-20px)';

                    setTimeout(() => {
                        window.location.href = href;
                    }, 200);
                }
            });
        });
    }

// Дополнительные CSS анимации
    const style = document.createElement('style');
    style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1);
            filter: hue-rotate(0deg);
        }
        50% { 
            transform: scale(1.1);
            filter: hue-rotate(90deg);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .navbar {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .feature-card, .stat-item {
        transform-style: preserve-3d;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Улучшенные hover эффекты */
    .btn:hover {
        animation: buttonPulse 0.3s ease;
    }
    
    @keyframes buttonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1.02); }
    }
    
    /* Адаптивные настройки для частиц */
    @media (max-width: 768px) {
        #particles-js canvas {
            opacity: 0.6;
        }
    }
    
    @media (max-width: 480px) {
        #particles-js canvas {
            opacity: 0.4;
        }
    }
`;
    document.head.appendChild(style);

// Оптимизация производительности
    let ticking = false;

    function updateOnScroll() {
        // Здесь можно добавить дополнительные эффекты при скролле
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

// Дебаунс для resize событий
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Обновление particles.js при изменении размера
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.fn.canvasSize();
            }
        }, 250);
    });

// Предзагрузка для улучшения UX
    window.addEventListener('load', () => {
        // Удаление прелоадера, если есть
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }

        // Запуск всех анимаций после загрузки
        setTimeout(() => {
            document.querySelectorAll('.hero-content, .feature-card').forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
                el.classList.add('animate-in');
            });
        }, 500);
    });

// Управление темой (темная/светлая)
    function toggleTheme() {
        const root = document.documentElement;
        const currentTheme = root.dataset.theme || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        root.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);

        // Обновление цветов particles.js
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            const particles = window.pJSDom[0].pJS;
            if (newTheme === 'light') {
                particles.particles.color.value = ["#333", "#666", "#999"];
                particles.particles.line_linked.color = "#333";
            } else {
                particles.particles.color.value = ["#6366f1", "#8b5cf6", "#06b6d4"];
                particles.particles.line_linked.color = "#6366f1";
            }
            particles.fn.particlesRefresh();
        }
    }

// Восстановление темы из localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;

// Intersection Observer для lazy loading
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    lazyObserver.unobserve(img);
                }
            }
        });
    });

// Применение lazy loading к изображениям
    document.querySelectorAll('img[data-src]').forEach(img => {
        lazyObserver.observe(img);
    });

// Улучшенная обработка ошибок
    window.addEventListener('error', (e) => {
        console.warn('Ошибка загрузки ресурса:', e.target.src || e.target.href);
    });

// Accessibility улучшения
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

// Определение предпочтений пользователя
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Отключение анимаций для пользователей с предпочтением уменьшенного движения
        document.documentElement.style.setProperty('--animation-duration', '0s');

        // Упрощение particles.js для лучшей производительности
        if (document.getElementById('particles-js')) {
            const particlesConfig = {
                "particles": {
                    "number": {"value": 20},
                    "opacity": {"anim": {"enable": false}},
                    "size": {"anim": {"enable": false}},
                    "move": {"speed": 1}
                },
                "interactivity": {
                    "events": {
                        "onhover": {"enable": false},
                        "onclick": {"enable": false}
                    }
                }
            };

            setTimeout(() => {
                if (window.pJSDom && window.pJSDom[0]) {
                    window.pJSDom[0].pJS.fn.vendors.destroypJS();
                    particlesJS('particles-js', particlesConfig);
                }
            }, 100);
        }
    }

// Оптимизация для слабых устройств
    const isLowEndDevice = () => {
        return navigator.hardwareConcurrency <= 2 ||
            navigator.deviceMemory <= 2 ||
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    if (isLowEndDevice()) {
        // Упрощенная конфигурация particles для слабых устройств
        setTimeout(() => {
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                const pJS = window.pJSDom[0].pJS;
                pJS.particles.number.value = 30;
                pJS.particles.line_linked.enable = false;
                pJS.interactivity.events.onhover.enable = false;
                pJS.fn.particlesRefresh();
            }
        }, 1000);
    }
}