/**
 * Logique principale de l'application
 * Gestion des pages d'accueil et de détail utilisateur
 */

// Variables globales
let allUsers = [];
let filteredUsers = [];
let currentUserId = null;

/**
 * Initialise l'application selon la page courante
 */
const initApp = () => {
    // Initialise les fonctionnalités communes
    Utils.initCommonFeatures();

    // Détermine la page courante
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            initHomePage();
            break;
        case 'user':
            initUserPage();
            break;
        default:
            console.warn('Page non reconnue:', currentPage);
    }
};

/**
 * Détermine la page courante basée sur l'URL
 * @returns {string} Nom de la page
 */
const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path.includes('user.html')) {
        return 'user';
    }
    return 'index';
};

/**
 * Initialise la page d'accueil
 */
const initHomePage = async () => {
    try {
        // Affiche le loader
        Utils.toggleLoader(true);

        // Teste la connexion API
        const isApiAvailable = await API.testApiConnection();
        if (!isApiAvailable) {
            throw new Error('Service temporairement indisponible. Veuillez réessayer plus tard.');
        }

        // Charge les données
        allUsers = await API.getAllUsersWithTodos();
        filteredUsers = [...allUsers];

        // Affiche les utilisateurs
        renderUsersGrid();

        // Initialise la recherche
        initSearch();

        // Initialise les filtres
        initFilters();

    } catch (error) {
        console.error('Erreur lors du chargement de la page d\'accueil:', error);
        Utils.showMessage(error.message, 'error');
        renderErrorState();
    } finally {
        Utils.toggleLoader(false);
    }
};

/**
 * Initialise la page de détail utilisateur
 */
const initUserPage = async () => {
    try {
        // Récupère l'ID utilisateur depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        currentUserId = parseInt(urlParams.get('id'));

        if (!currentUserId || isNaN(currentUserId)) {
            throw new Error('ID utilisateur invalide');
        }

        // Affiche le loader
        Utils.toggleLoader(true);

        // Charge les données utilisateur
        const userData = await API.getUserWithTodos(currentUserId);

        // Affiche les informations utilisateur
        renderUserInfo(userData);

        // Affiche les tâches
        renderTodosList(userData.todos);

        // Initialise le formulaire d'ajout de tâche
        initAddTodoForm();

    } catch (error) {
        console.error('Erreur lors du chargement de la page utilisateur:', error);
        Utils.showMessage(error.message, 'error');
        renderUserErrorState();
    } finally {
        Utils.toggleLoader(false);
    }
};

/**
 * Affiche la grille des utilisateurs
 */
const renderUsersGrid = () => {
    const usersGrid = document.getElementById('usersGrid');
    const noResults = document.getElementById('noResults');

    if (!usersGrid) return;

    if (filteredUsers.length === 0) {
        usersGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    usersGrid.innerHTML = filteredUsers.map(user => createUserCard(user)).join('');
    
    // Ajoute les animations
    const userCards = usersGrid.querySelectorAll('.user-card');
    userCards.forEach((card, index) => {
        setTimeout(() => {
            Utils.addFadeInAnimation(card);
        }, index * 100);
    });

    // Ajoute les événements de clic
    addUserCardClickEvents();
};

/**
 * Crée une carte utilisateur
 * @param {Object} user - Données de l'utilisateur
 * @returns {string} HTML de la carte
 */
const createUserCard = (user) => {
    const completedTodos = user.todos.filter(todo => todo.completed).length;
    const pendingTodos = user.todos.filter(todo => !todo.completed).length;
    const initials = Utils.getInitials(user.name);
    const completionPercentage = user.todos.length > 0 ? Math.round((completedTodos / user.todos.length) * 100) : 0;

    return `
        <div class="user-card" data-user-id="${user.id}" role="gridcell">
            <div class="user-card-header">
                <div class="user-avatar" aria-label="Avatar de ${Utils.escapeHtml(user.name)}">
                    ${initials}
                </div>
                <div class="user-info">
                    <h3>${Utils.escapeHtml(user.name)}</h3>
                    <p class="username">@${Utils.escapeHtml(user.username || user.name.split(' ')[0])}</p>
                </div>
            </div>
            
            <div class="user-details">
                <div class="user-detail-item">
                    <span class="icon">✉️</span>
                    <span class="text">${Utils.escapeHtml(user.email)}</span>
                </div>
                <div class="user-detail-item">
                    <span class="icon">🏢</span>
                    <span class="text">${Utils.escapeHtml(user.company.name)}</span>
                </div>
                <div class="user-detail-item">
                    <span class="icon">📍</span>
                    <span class="text">${Utils.escapeHtml(user.address.city)}</span>
                </div>
                <div class="user-detail-item">
                    <span class="icon">🌐</span>
                    <span class="text">${Utils.escapeHtml(user.website)}</span>
                </div>
            </div>

            <div class="user-stats">
                <div class="stat">
                    <div class="stat-number">${user.todos.length}</div>
                    <div class="stat-label">TÂCHES</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${completionPercentage}%</div>
                    <div class="stat-label">COMPLÉTÉ</div>
                </div>
                <div class="stat">
                    <button class="view-btn">Voir →</button>
                </div>
            </div>
        </div>
    `;
};

/**
 * Ajoute les événements de clic aux cartes utilisateur
 */
const addUserCardClickEvents = () => {
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach(card => {
        card.addEventListener('click', () => {
            const userId = card.dataset.userId;
            if (userId) {
                window.location.href = `user.html?id=${userId}`;
            }
        });

        // Améliore l'accessibilité avec le clavier
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const userId = card.dataset.userId;
                if (userId) {
                    window.location.href = `user.html?id=${userId}`;
                }
            }
        });

        // Rend la carte focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Voir les détails de ${card.querySelector('h3').textContent}`);
    });
};

/**
 * Initialise la fonctionnalité de recherche
 */
const initSearch = () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // Recherche en temps réel avec debounce
    const debouncedSearch = Utils.debounce((searchTerm) => {
        performSearch(searchTerm);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });

    // Recherche avec le bouton
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    // Recherche avec Entrée
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });
};

/**
 * Effectue la recherche
 * @param {string} searchTerm - Terme de recherche
 */
const performSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
        filteredUsers = [...allUsers];
    } else {
        const term = searchTerm.toLowerCase().trim();
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.company.name.toLowerCase().includes(term) ||
            user.todos.some(todo => todo.title.toLowerCase().includes(term))
        );
    }

    // Applique le tri actuel après la recherche
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        applySorting(sortSelect.value);
    } else {
        renderUsersGrid();
    }
};

/**
 * Initialise les filtres
 */
const initFilters = () => {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        applySorting(sortValue);
    });
};

/**
 * Applique le tri des utilisateurs
 * @param {string} sortValue - Valeur du tri
 */
const applySorting = (sortValue) => {
    switch (sortValue) {
        case 'name':
            filteredUsers.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
            break;
        case 'company':
            filteredUsers.sort((a, b) => a.company.name.localeCompare(b.company.name, 'fr'));
            break;
        case 'tasks':
            filteredUsers.sort((a, b) => b.todos.length - a.todos.length);
            break;
        case 'default':
        default:
            // Tri par défaut (ordre d'origine)
            filteredUsers.sort((a, b) => a.id - b.id);
            break;
    }

    renderUsersGrid();
};

/**
 * Affiche les informations de l'utilisateur
 * @param {Object} userData - Données de l'utilisateur
 */
const renderUserInfo = (userData) => {
    const userInfoContainer = document.getElementById('userInfo');
    if (!userInfoContainer) return;

    const initials = Utils.getInitials(userData.name);
    const completedTodos = userData.todos.filter(todo => todo.completed).length;
    const pendingTodos = userData.todos.filter(todo => !todo.completed).length;

    userInfoContainer.innerHTML = `
        <div class="user-info-header">
            <div class="user-info-avatar" aria-label="Avatar de ${Utils.escapeHtml(userData.name)}">
                ${initials}
            </div>
            <div class="user-info-details">
                <h2>${Utils.escapeHtml(userData.name)}</h2>
                <p>${Utils.escapeHtml(userData.email)}</p>
            </div>
        </div>

        <div class="user-info-grid">
            <div class="info-item">
                <div class="info-label">Entreprise</div>
                <div class="info-value">${Utils.escapeHtml(userData.company.name)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Téléphone</div>
                <div class="info-value">${Utils.escapeHtml(userData.phone)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Site web</div>
                <div class="info-value">
                    <a href="http://${userData.website}" target="_blank" rel="noopener noreferrer">
                        ${Utils.escapeHtml(userData.website)}
                    </a>
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Adresse</div>
                <div class="info-value">
                    ${Utils.escapeHtml(userData.address.street)}, ${Utils.escapeHtml(userData.address.city)}
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Tâches complétées</div>
                <div class="info-value">${completedTodos}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Tâches en cours</div>
                <div class="info-value">${pendingTodos}</div>
            </div>
        </div>
    `;

    Utils.addFadeInAnimation(userInfoContainer);
};

/**
 * Affiche la liste des tâches
 * @param {Array} todos - Liste des tâches
 */
const renderTodosList = (todos) => {
    const todosList = document.getElementById('todosList');
    if (!todosList) return;

    if (todos.length === 0) {
        todosList.innerHTML = '<p class="text-center">Aucune tâche pour cet utilisateur.</p>';
        return;
    }

    todosList.innerHTML = todos.map(todo => createTodoCard(todo)).join('');

    // Ajoute les animations
    const todoCards = todosList.querySelectorAll('.todo-card');
    todoCards.forEach((card, index) => {
        setTimeout(() => {
            Utils.addFadeInAnimation(card);
        }, index * 50);
    });
};

/**
 * Crée une carte de tâche
 * @param {Object} todo - Données de la tâche
 * @returns {string} HTML de la carte
 */
const createTodoCard = (todo) => {
    return `
        <div class="todo-card" data-todo-id="${todo.id}">
            <div class="todo-card-header">
                <h4 class="todo-card-title">${Utils.escapeHtml(todo.title)}</h4>
                <span class="todo-card-status ${todo.completed ? 'completed' : 'pending'}">
                    ${todo.completed ? 'Complétée' : 'En cours'}
                </span>
            </div>
            <div class="todo-card-id">Tâche #${todo.id}</div>
        </div>
    `;
};

/**
 * Initialise le formulaire d'ajout de tâche
 */
const initAddTodoForm = () => {
    const form = document.getElementById('addTodoForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const title = formData.get('title');

        // Validation côté client
        if (!Utils.isValidTodoTitle(title)) {
            Utils.showMessage('Le titre doit contenir au moins 3 caractères.', 'warning');
            return;
        }

        try {
            // Affiche le loader
            Utils.toggleLoader(true);

            // Crée la tâche
            const newTodo = await API.createTodo({
                userId: currentUserId,
                title: title,
                completed: false
            });

            // Ajoute la tâche à la liste
            const todosList = document.getElementById('todosList');
            if (todosList) {
                const todoCard = createTodoCard(newTodo);
                todosList.insertAdjacentHTML('afterbegin', todoCard);
                
                // Animation de la nouvelle tâche
                const newCard = todosList.querySelector(`[data-todo-id="${newTodo.id}"]`);
                if (newCard) {
                    Utils.addFadeInAnimation(newCard);
                }
            }

            // Réinitialise le formulaire
            form.reset();

            // Message de succès
            Utils.showMessage('Tâche ajoutée avec succès !', 'success');

            // Scroll vers la nouvelle tâche
            setTimeout(() => {
                Utils.smoothScrollTo(`[data-todo-id="${newTodo.id}"]`, 100);
            }, 100);

        } catch (error) {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
            Utils.showMessage(error.message, 'error');
        } finally {
            Utils.toggleLoader(false);
        }
    });
};

/**
 * Affiche l'état d'erreur sur la page d'accueil
 */
const renderErrorState = () => {
    const usersGrid = document.getElementById('usersGrid');
    const noResults = document.getElementById('noResults');
    
    if (usersGrid) {
        usersGrid.innerHTML = `
            <div class="error-state">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les données. Veuillez vérifier votre connexion internet et réessayer.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Réessayer
                </button>
            </div>
        `;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
};

/**
 * Affiche l'état d'erreur sur la page utilisateur
 */
const renderUserErrorState = () => {
    const userInfo = document.getElementById('userInfo');
    const todosList = document.getElementById('todosList');
    
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="error-state">
                <h3>Utilisateur introuvable</h3>
                <p>L'utilisateur demandé n'existe pas ou n'est pas accessible.</p>
                <a href="index.html" class="btn btn-primary">
                    Retour à l'accueil
                </a>
            </div>
        `;
    }
    
    if (todosList) {
        todosList.innerHTML = '';
    }
};

// Initialise l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    Utils.showMessage('Une erreur inattendue s\'est produite.', 'error');
});

// Gestion des promesses rejetées non gérées
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesse rejetée non gérée:', e.reason);
    Utils.showMessage('Une erreur de communication s\'est produite.', 'error');
});

