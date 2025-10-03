/**
 * Utilitaires généraux pour l'application
 * Fonctions helper communes utilisées dans toute l'application
 */

/**
 * Affiche ou masque le loader
 * @param {boolean} show - Afficher le loader
 */
const toggleLoader = (show) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
        loader.setAttribute('aria-hidden', !show);
    }
};

/**
 * Affiche un message d'erreur à l'utilisateur
 * @param {string} message - Message d'erreur à afficher
 * @param {string} type - Type d'erreur (error, warning, info)
 */
const showMessage = (message, type = 'error') => {
    // Supprime les messages existants
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crée le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    messageDiv.setAttribute('aria-live', 'polite');

    // Styles pour le message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    `;

    // Couleur selon le type
    switch (type) {
        case 'error':
            messageDiv.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#f59e0b';
            break;
        case 'success':
            messageDiv.style.backgroundColor = '#10b981';
            break;
        default:
            messageDiv.style.backgroundColor = '#3b82f6';
    }

    document.body.appendChild(messageDiv);

    // Supprime le message après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
};

/**
 * Débounce une fonction pour éviter les appels trop fréquents
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai d'attente en millisecondes
 * @returns {Function} Fonction débouncée
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Formate une date en français
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée
 */
const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Génère les initiales d'un nom
 * @param {string} name - Nom complet
 * @returns {string} Initiales
 */
const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
};

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} Email valide ou non
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valide un titre de tâche
 * @param {string} title - Titre à valider
 * @returns {boolean} Titre valide ou non
 */
const isValidTodoTitle = (title) => {
    return title && title.trim().length >= 3;
};

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Ajoute une animation de fade-in à un élément
 * @param {HTMLElement} element - Élément à animer
 */
const addFadeInAnimation = (element) => {
    element.classList.add('fade-in');
};

/**
 * Scroll fluide vers un élément
 * @param {HTMLElement|string} target - Élément ou sélecteur CSS
 * @param {number} offset - Décalage en pixels
 */
const smoothScrollTo = (target, offset = 0) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} Succès de la copie
 */
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
};

/**
 * Gère le menu hamburger pour mobile
 */
const initMobileMenu = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        // Initialise l'état du menu
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche la propagation de l'événement
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Empêche le scroll du body quand le menu est ouvert
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Ferme le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Gestion spéciale pour les liens d'ancrage
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        smoothScrollTo(targetElement, 80); // Offset pour le header fixe
                    }
                }
                
                // Ferme le menu
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Ferme le menu quand on clique à l'extérieur
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Ferme le menu avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
};

/**
 * Initialise les animations au scroll
 */
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe les cartes utilisateur et les tâches
    const animatedElements = document.querySelectorAll('.user-card, .todo-card');
    animatedElements.forEach(el => observer.observe(el));
};

/**
 * Gère les raccourcis clavier
 */
const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K pour focuser la recherche
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Échap pour fermer le menu mobile
        if (e.key === 'Escape') {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navToggle && navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
};

/**
 * Initialise toutes les fonctionnalités communes
 */
const initCommonFeatures = () => {
    initMobileMenu();
    initScrollAnimations();
    initKeyboardShortcuts();
};

// Export des fonctions pour utilisation dans d'autres modules
window.Utils = {
    toggleLoader,
    showMessage,
    debounce,
    formatDate,
    getInitials,
    isValidEmail,
    isValidTodoTitle,
    escapeHtml,
    addFadeInAnimation,
    smoothScrollTo,
    copyToClipboard,
    initCommonFeatures
};
