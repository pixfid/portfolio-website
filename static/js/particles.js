// static/js/particles.js - Различные конфигурации для Particles.js

// Основная конфигурация для десктопа
const particlesConfigDesktop = {
    "particles": {
    "number": {
        "value": 50,
            "density": {
            "enable": true,
                "value_area": 800
        }
    },
    "color": {
        "value": "#ffffff"
    },
    "shape": {
        "type": "circle",
            "stroke": {
            "width": 0,
                "color": "#000000"
        },
        "polygon": {
            "nb_sides": 5
        },
        "image": {
            "src": "img/github.svg",
                "width": 100,
                "height": 100
        }
    },
    "opacity": {
        "value": 0.2,
            "random": false,
            "anim": {
            "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
        }
    },
    "size": {
        "value": 3,
            "random": true,
            "anim": {
            "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
        }
    },
    "line_linked": {
        "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.2,
            "width": 1
    },
    "move": {
        "enable": true,
            "speed": 3,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
            "enable": false,
                "rotateX": 600,
                "rotateY": 1200
        }
    }
},
    "interactivity": {
    "detect_on": "window",
        "events": {
        "onhover": {
            "enable": true,
                "mode": "grab"
        },
        "onclick": {
            "enable": true,
                "mode": "push"
        },
        "resize": true
    },
    "modes": {
        "grab": {
            "distance": 200,
                "line_linked": {
                "opacity": 0.2
            }
        },
        "bubble": {
            "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
        },
        "repulse": {
            "distance": 200,
                "duration": 0.4
        },
        "push": {
            "particles_nb": 4
        },
        "remove": {
            "particles_nb": 2
        }
    }
},
    "retina_detect": true
};

// Конфигурация для планшетов
const particlesConfigTablet = {
    ...particlesConfigDesktop,
    "particles": {
        ...particlesConfigDesktop.particles,
        "number": {
            "value": 60,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "line_linked": {
            ...particlesConfigDesktop.particles.line_linked,
            "distance": 120,
            "opacity": 0.4
        },
        "move": {
            ...particlesConfigDesktop.particles.move,
            "speed": 2
        }
    },
    "interactivity": {
        ...particlesConfigDesktop.interactivity,
        "modes": {
            ...particlesConfigDesktop.interactivity.modes,
            "push": {
                "particles_nb": 4
            }
        }
    }
};

// Конфигурация для мобильных устройств
const particlesConfigMobile = {
    "particles": {
        "number": {
            "value": 30,
            "density": {
                "enable": true,
                "value_area": 600
            }
        },
        "color": {
            "value": ["#6366f1", "#8b5cf6", "#06b6d4"]
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
                "enable": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#6366f1",
            "opacity": 0.3,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "push": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
};

// Минимальная конфигурация для слабых устройств
const particlesConfigLowEnd = {
    "particles": {
        "number": {
            "value": 15,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#6366f1"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.4,
            "random": false,
            "anim": {
                "enable": false
            }
        },
        "size": {
            "value": 2,
            "random": false,
            "anim": {
                "enable": false
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false
            },
            "onclick": {
                "enable": false
            },
            "resize": true
        }
    },
    "retina_detect": false
};

// Конфигурация "Звездное небо"
const particlesConfigStars = {
    "particles": {
        "number": {
            "value": 200,
            "density": {
                "enable": true,
                "value_area": 1500
            }
        },
        "color": {
            "value": ["#ffffff", "#6366f1", "#8b5cf6", "#06b6d4"]
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.8,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 3,
                "opacity_min": 0,
                "sync": false
            }
        },
        "size": {
            "value": 1.5,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "size_min": 0,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": 0.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "bubble"
            },
            "onclick": {
                "enable": true,
                "mode": "repulse"
            },
            "resize": true
        },
        "modes": {
            "bubble": {
                "distance": 100,
                "size": 3,
                "duration": 2,
                "opacity": 1,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            }
        }
    },
    "retina_detect": true
};

// Конфигурация "Сеть"
const particlesConfigNetwork = {
    "particles": {
        "number": {
            "value": 50,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#6366f1"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.8,
            "random": false
        },
        "size": {
            "value": 3,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 200,
            "color": "#6366f1",
            "opacity": 0.8,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 250,
                "line_linked": {
                    "opacity": 1
                }
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
};

// Функция определения подходящей конфигурации
function getParticlesConfig() {
    const width = window.innerWidth;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Пользователь предпочитает уменьшенное движение
    if (prefersReducedMotion) {
        return particlesConfigLowEnd;
    }

    // Слабое устройство
    if (isLowEnd) {
        return particlesConfigLowEnd;
    }

    // Мобильное устройство
    if (isMobile || width < 768) {
        return particlesConfigMobile;
    }

    // Планшет
    if (width < 1024) {
        return particlesConfigTablet;
    }

    // Десктоп - используем основную конфигурацию
    return particlesConfigDesktop;
}

// Функция смены темы частиц
function changeParticlesTheme(theme) {
    if (!window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) {
        return;
    }

    const pJS = window.pJSDom[0].pJS;

    switch(theme) {
        case 'stars':
            pJS.fn.vendors.destroypJS();
            particlesJS('particles-js', particlesConfigStars);
            break;
        case 'network':
            pJS.fn.vendors.destroypJS();
            particlesJS('particles-js', particlesConfigNetwork);
            break;
        case 'minimal':
            pJS.fn.vendors.destroypJS();
            particlesJS('particles-js', particlesConfigLowEnd);
            break;
        default:
            pJS.fn.vendors.destroypJS();
            particlesJS('particles-js', getParticlesConfig());
    }
}

// Экспорт конфигураций (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getParticlesConfig,
        changeParticlesTheme,
        particlesConfigDesktop,
        particlesConfigMobile,
        particlesConfigTablet,
        particlesConfigLowEnd,
        particlesConfigStars,
        particlesConfigNetwork
    };
}