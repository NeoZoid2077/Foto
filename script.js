// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initScrollEffects();
    initNavigation();
    initContentToggle();
    initFormHandling();
    initParticles();
    initTypingEffect();
    initProgressBars();
    initImageLazyLoading();
});

// Efeitos de scroll e revelação de elementos
function initScrollEffects() {
    // Adiciona classe de revelação a elementos que devem aparecer no scroll
    const revealElements = document.querySelectorAll('.chapter-card, .resource-card, .section-intro, .section-contact');
    revealElements.forEach(el => el.classList.add('scroll-reveal'));

    // Observer para detectar quando elementos entram na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Adiciona delay escalonado para cards
                if (entry.target.classList.contains('chapter-card') || entry.target.classList.contains('resource-card')) {
                    const cards = Array.from(entry.target.parentElement.children);
                    const index = cards.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Efeito parallax no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Atualiza a navegação baseada no scroll
        updateNavigation();
    });
}

// Navegação suave e ativa
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensa a altura da nav fixa
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito de transparência da navegação
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });
}

// Atualiza navegação ativa baseada na seção visível
function updateNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Toggle de conteúdo dos capítulos e recursos
function initContentToggle() {
    window.toggleContent = function(contentId) {
        const content = document.getElementById(contentId);
        const button = event.target;
        
        if (content.classList.contains('active')) {
            content.classList.remove('active');
            button.textContent = 'Ler Mais';
            content.style.maxHeight = '0';
        } else {
            // Fecha outros conteúdos abertos na mesma seção
            const parentSection = content.closest('section');
            const otherContents = parentSection.querySelectorAll('.chapter-content.active, .resource-content.active');
            otherContents.forEach(other => {
                if (other !== content) {
                    other.classList.remove('active');
                    other.style.maxHeight = '0';
                    const otherButton = other.parentElement.querySelector('button');
                    if (otherButton) otherButton.textContent = 'Ler Mais';
                }
            });
            
            content.classList.add('active');
            button.textContent = 'Ler Menos';
            content.style.maxHeight = content.scrollHeight + 'px';
            
            // Scroll suave para o conteúdo expandido
            setTimeout(() => {
                content.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    };
}

// Manipulação do formulário de contato
function initFormHandling() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animação de envio
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Simula envio (substitua por lógica real)
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                submitButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                
                // Reset após 3 segundos
                setTimeout(() => {
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 3000);
            }, 2000);
        });
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
}

// Validação de campos
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove validações anteriores
    clearValidation(e);
    
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Este campo é obrigatório';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Por favor, insira um email válido';
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, message);
    } else {
        field.classList.add('valid');
    }
}

// Limpa validação
function clearValidation(e) {
    const field = e.target;
    field.classList.remove('error', 'valid');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Mostra erro no campo
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    field.parentElement.appendChild(errorDiv);
}

// Valida email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de partículas animadas
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);
    
    // Cria partículas
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Propriedades aleatórias
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + '%';
    particle.style.top = y + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
}

// Efeito de digitação no título
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Remove cursor após terminar
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Inicia após um delay
    setTimeout(typeWriter, 1000);
}

// Barras de progresso animadas
function initProgressBars() {
    // Adiciona barras de progresso aos capítulos (simulando progresso de leitura)
    const chapterCards = document.querySelectorAll('.chapter-card');
    
    chapterCards.forEach((card, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: 0%"></div>
        `;
        
        // Estilo da barra de progresso
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            margin-top: 1rem;
            overflow: hidden;
        `;
        
        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 2px;
            transition: width 1s ease;
        `;
        
        card.appendChild(progressBar);
        
        // Anima a barra quando o card é revelado
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressFill.style.width = Math.random() * 60 + 20 + '%';
                    }, index * 200);
                }
            });
        });
        
        observer.observe(card);
    });
}

// Lazy loading para imagens (se houver)
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Efeitos de hover avançados
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de tilt nos cards
    const cards = document.querySelectorAll('.chapter-card, .resource-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
});

// Contador animado (para estatísticas futuras)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Smooth scroll para navegação mobile
function initMobileNavigation() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Fecha menu ao clicar em link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Adiciona estilos CSS dinamicamente para efeitos especiais
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border: 2px solid #ff6b6b !important;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2) !important;
        }
        
        .valid {
            border: 2px solid #4CAF50 !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2) !important;
        }
        
        .nav a.active {
            color: #667eea !important;
        }
        
        .nav a.active::after {
            width: 100% !important;
        }
        
        @media (max-width: 768px) {
            .mobile-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 1rem;
            }
            
            .mobile-menu.active {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializa estilos dinâmicos
addDynamicStyles();

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg ativado!
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        // Mostra mensagem especial
        const message = document.createElement('div');
        message.textContent = '📸 Modo Fotógrafo Secreto Ativado! 📸';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInUp 0.5s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
        
        konamiCode = [];
    }
});

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitora o tempo de carregamento
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
        
        // Se o carregamento for muito lento, mostra dica
        if (loadTime > 3000) {
            console.warn('Carregamento lento detectado. Considere otimizar imagens e recursos.');
        }
    });
}

initPerformanceMonitoring();

