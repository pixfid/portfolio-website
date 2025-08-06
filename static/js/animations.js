// static/js/animations.js

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех анимаций
    initScrollAnimations();
    initParallaxEffect();
    initNavigationEffects();
    initTypewriterEffect();
    initMouseFollower();
    initLazyLoading();
});

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдение за элементами
    const animatedElements = document.querySelectorAll(
        '.feature-card, .article-card, .content-article, .hero-content'
    );

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Эффект параллакса для фоновых элементов
function initParallaxEffect() {
    const particles = document.querySelectorAll('.particle');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;

        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Эффекты навигации
function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Изменение навигации при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Активная ссылка
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath ||
            (currentPath === '/' && link.getAttribute('href') === '/')) {
            link.style.color = 'var(--primary-color)';
            link.style.transform = 'translateY(-2px)';
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
            setInterval(() => {
                heroTitle.style.borderRight =
                    heroTitle.style.borderRight === 'none' ?
                        '2px solid var(--primary-color)' : 'none';
            }, 500);
        }
    }

    setTimeout(typeWriter, 1000);
}

// Следование мыши для интерактивных элементов
function initMouseFollower() {
    const cards = document.querySelectorAll('.feature-card, .article-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `
                translateY(-10px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}

// Ленивая загрузка контента
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.src = element.dataset.lazy;
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));
}

// Дополнительные анимации для кнопок
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Анимация появления частиц при клике
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn') || e.target.closest('.nav-link')) {
        createClickEffect(e.pageX, e.pageY);
    }
});

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, var(--primary-color), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: clickExpand 0.6s ease-out forwards;
    `;

    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 600);
}

// CSS для анимации клика
const style = document.createElement('style');
style.textContent = `
    @keyframes clickExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation-play-state: running !important;
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Плавное появление страницы
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Управление темой (если потребуется)
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.dataset.theme;

    if (currentTheme === 'light') {
        root.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    } else {
        root.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    }
}

// Восстановление темы из localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;