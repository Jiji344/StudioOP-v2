// Variables globales
let currentTime = new Date();
let isMenuOpen = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeTime();
    initializeNavigation();
    initializeScrollEffects();
    initializePortfolioFilters();
    initializeContactForm();
    initializeAnimations();
});

// Gestion de l'heure en temps réel
function initializeTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        updateTime();
        setInterval(updateTime, 1000);
    }
}

function updateTime() {
    const now = new Date();
    const timeString = `LOCAL/${now.toLocaleTimeString('fr-FR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })}`;
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Navigation mobile
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Fermer le menu lors du clic en dehors
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Effets de scroll
function initializeScrollEffects() {
    // Navbar transparente au scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }

        // Masquer/afficher la navbar selon la direction du scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Smooth scroll pour les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Filtres du portfolio
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Formulaire de contact
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulation d'envoi du formulaire
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'ENVOI EN COURS...';
    submitBtn.disabled = true;
    
    // Simulation d'un délai d'envoi
    setTimeout(() => {
        submitBtn.textContent = 'MESSAGE ENVOYÉ !';
        submitBtn.style.background = '#4CAF50';
        
        // Réinitialiser le formulaire après 2 secondes
        setTimeout(() => {
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 2000);
    }, 1500);
}

// Animations au scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .about-text, .contact-info, .contact-form'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Effet de parallaxe pour la section héros
function initializeParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    const heroInfo = document.querySelector('.hero-info');
    
    if (heroSection && heroTitle && heroInfo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroTitle.style.transform = `translateY(${rate}px)`;
            heroInfo.style.transform = `translateY(${rate * 0.5}px)`;
        });
    }
}

// Effet de typing pour le titre
function initializeTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (titleElement) {
        const text = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Démarrer l'effet après un délai
        setTimeout(typeWriter, 1000);
    }
}

// Gestion des clics sur les projets du portfolio
function initializePortfolioClicks() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const viewButton = item.querySelector('.view-project');
        if (viewButton) {
            viewButton.addEventListener('click', (e) => {
                e.stopPropagation();
                // Ici vous pouvez ajouter la logique pour ouvrir un modal ou rediriger
                console.log('Voir le projet:', item.querySelector('h4').textContent);
            });
        }
    });
}

// Effet de hover pour les cartes de services
function initializeServiceHovers() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Gestion du thème sombre/clair (optionnel)
function initializeThemeToggle() {
    // Cette fonction peut être utilisée pour ajouter un toggle de thème
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
    });
    
    document.body.appendChild(themeToggle);
}

// Initialisation des effets supplémentaires
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
    initializeTypingEffect();
    initializePortfolioClicks();
    initializeServiceHovers();
    // initializeThemeToggle(); // Décommentez si vous voulez le toggle de thème
});

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// Gestion de la résize de la fenêtre
window.addEventListener('resize', () => {
    // Fermer le menu mobile si la fenêtre est redimensionnée
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
});

// Préchargement des images (pour optimiser les performances)
function preloadImages() {
    const imageUrls = [
        // Ajoutez ici les URLs des images que vous voulez précharger
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Lazy loading pour les images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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

// Performance monitoring
function initializePerformanceMonitoring() {
    // Mesurer le temps de chargement
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Temps de chargement: ${loadTime.toFixed(2)}ms`);
    });
}

// Initialisation finale
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    initializeLazyLoading();
    initializePerformanceMonitoring();
});

