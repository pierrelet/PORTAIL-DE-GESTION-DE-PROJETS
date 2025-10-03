let allUsers = [];
let filteredUsers = [];
let currentUserId = null;

const initApp = () => {
    if (window.Utils && window.Utils.initCommonFeatures) {
        window.Utils.initCommonFeatures();
    } else {
        setTimeout(() => {
            if (window.Utils && window.Utils.initCommonFeatures) {
                window.Utils.initCommonFeatures();
            }
        }, 100);
    }

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

const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path.includes('user.html')) {
        return 'user';
    }
    return 'index';
};

const initHomePage = async () => {
    try {
        Utils.toggleLoader(true);
        const isApiAvailable = await API.testApiConnection();
        if (!isApiAvailable) {
            throw new Error('Service temporairement indisponible. Veuillez réessayer plus tard.');
        }
        allUsers = await API.getAllUsersWithTodos();
        filteredUsers = [...allUsers];
        renderUsers();
        initSearch();
        initFilters();
    } catch (error) {
        console.error('Erreur lors du chargement de la page d\'accueil:', error);
        showError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
        Utils.toggleLoader(false);
    }
};

const initUserPage = async () => {
    try {
        Utils.toggleLoader(true);
        currentUserId = getUserIdFromUrl();
        if (!currentUserId) {
            throw new Error('ID utilisateur manquant dans l\'URL');
        }
        await loadUserData();
        renderUserInfo();
        await loadUserTodos();
        renderTodosList();
        initAddTodoForm();
    } catch (error) {
        console.error('Erreur lors du chargement de la page utilisateur:', error);
        showError('Erreur lors du chargement des données utilisateur.');
    } finally {
        Utils.toggleLoader(false);
    }
};

const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

const loadUserData = async () => {
    const userData = await API.getUserById(currentUserId);
    if (!userData) {
        throw new Error('Utilisateur non trouvé');
    }
    window.currentUserData = userData;
};

const loadUserTodos = async () => {
    const todos = await API.getTodosByUserId(currentUserId);
    window.currentUserTodos = todos || [];
};

const renderUserInfo = () => {
    const userData = window.currentUserData;
    if (!userData) return;

    const userInfoContainer = document.getElementById('user-info');
    if (!userInfoContainer) return;

    userInfoContainer.innerHTML = `
        <div class="user-info-grid">
            <div class="user-info-avatar">
                <img src="assets/images/${userData.id}.jpg" 
                     alt="Photo de ${userData.name}" 
                     class="profile-image-large"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="avatar-fallback-large" style="display: none;">
                    ${userData.name.split(' ').map(n => n[0]).join('')}
                </div>
            </div>
            <div class="user-info-details">
                <h1 class="user-name">${userData.name}</h1>
                <p class="user-email">${userData.email}</p>
                <p class="user-company">${userData.company.name}</p>
                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-label">Tâches complétées</span>
                        <span class="stat-number" id="completed-count">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tâches en cours</span>
                        <span class="stat-number" id="pending-count">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderTodosList = () => {
    const todos = window.currentUserTodos;
    if (!todos) return;

    const todosContainer = document.getElementById('todos-list');
    if (!todosContainer) return;

    todosContainer.innerHTML = todos.map(todo => createTodoCard(todo)).join('');
    initDeleteTodoEvents();
    initToggleTodoEvents();
    updateUserStats();
};

const createTodoCard = (todo) => {
    return `
        <div class="todo-card ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
            <div class="todo-content">
                <h3 class="todo-title">${todo.title}</h3>
                <div class="todo-card-actions">
                    <button class="todo-toggle-btn ${todo.completed ? 'completed' : ''}" 
                            data-todo-id="${todo.id}" 
                            aria-label="${todo.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}">
                        ${todo.completed ? '✓ Terminée' : '○ En cours'}
                    </button>
                    <button class="delete-todo-btn" data-todo-id="${todo.id}" aria-label="Supprimer cette tâche">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `;
};

const initDeleteTodoEvents = () => {
    const deleteButtons = document.querySelectorAll('.delete-todo-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const todoId = button.getAttribute('data-todo-id');
            handleDeleteTodo(todoId);
        });
    });
};

const initToggleTodoEvents = () => {
    const toggleButtons = document.querySelectorAll('.todo-toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const todoId = button.getAttribute('data-todo-id');
            handleToggleTodo(todoId);
        });
    });
};

const handleDeleteTodo = async (todoId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        return;
    }

    try {
        // Pour les nouvelles tâches (ID >= 201), on simule la suppression localement
        if (todoId >= 201) {
            window.currentUserTodos = window.currentUserTodos.filter(t => t.id != todoId);
            const todoCard = document.querySelector(`[data-todo-id="${todoId}"]`);
            if (todoCard) {
                todoCard.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    todoCard.remove();
                    updateUserStats();
                    showSuccess('Tâche supprimée avec succès');
                }, 300);
            }
            return;
        }
        
        // Pour les tâches existantes, on utilise l'API
        await API.deleteTodo(todoId);
        const todoCard = document.querySelector(`[data-todo-id="${todoId}"]`);
        if (todoCard) {
            todoCard.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                todoCard.remove();
                updateUserStats();
                showSuccess('Tâche supprimée avec succès');
            }, 300);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showError('Erreur lors de la suppression de la tâche');
    }
};

const handleToggleTodo = async (todoId) => {
    try {
        const todo = window.currentUserTodos.find(t => t.id == todoId);
        if (!todo) return;

        const newCompleted = !todo.completed;
        
        // Pour les nouvelles tâches (ID >= 201), on simule la mise à jour localement
        if (todoId >= 201) {
            todo.completed = newCompleted;
            updateTodoUI(todoId, newCompleted);
            updateUserStats();
            showSuccess(newCompleted ? 'Tâche marquée comme terminée' : 'Tâche marquée comme en cours');
            return;
        }
        
        // Pour les tâches existantes, on utilise l'API
        await API.updateTodo(todoId, { completed: newCompleted });
        todo.completed = newCompleted;
        updateTodoUI(todoId, newCompleted);
        updateUserStats();
        showSuccess(newCompleted ? 'Tâche marquée comme terminée' : 'Tâche marquée comme en cours');
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        showError('Erreur lors de la mise à jour de la tâche');
    }
};

const updateTodoUI = (todoId, completed) => {
    const todoCard = document.querySelector(`[data-todo-id="${todoId}"]`);
    const toggleBtn = todoCard.querySelector('.todo-toggle-btn');
    
    if (completed) {
        todoCard.classList.add('completed');
        toggleBtn.classList.add('completed');
        toggleBtn.textContent = '✓ Terminée';
        toggleBtn.setAttribute('aria-label', 'Marquer comme non terminée');
    } else {
        todoCard.classList.remove('completed');
        toggleBtn.classList.remove('completed');
        toggleBtn.textContent = '○ En cours';
        toggleBtn.setAttribute('aria-label', 'Marquer comme terminée');
    }
};

const updateUserStats = () => {
    const todos = window.currentUserTodos;
    if (!todos) return;

    const completedCount = todos.filter(todo => todo.completed).length;
    const pendingCount = todos.filter(todo => !todo.completed).length;

    const completedElement = document.getElementById('completed-count');
    const pendingElement = document.getElementById('pending-count');

    if (completedElement) completedElement.textContent = completedCount;
    if (pendingElement) pendingElement.textContent = pendingCount;
};

const initAddTodoForm = () => {
    const form = document.getElementById('add-todo-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = form.querySelector('#todo-title');
        const title = titleInput.value.trim();

        if (!title) {
            showError('Veuillez saisir un titre pour la tâche');
            return;
        }

        try {
            const newTodo = await API.createTodo(currentUserId, title);
            window.currentUserTodos.push(newTodo);
            renderTodosList();
            titleInput.value = '';
            showSuccess('Tâche ajoutée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
            showError('Erreur lors de l\'ajout de la tâche');
        }
    });
};

const renderUsers = () => {
    const usersContainer = document.getElementById('users-container');
    if (!usersContainer) return;

    if (filteredUsers.length === 0) {
        usersContainer.innerHTML = '<p class="no-results">Aucun utilisateur trouvé</p>';
        return;
    }

    usersContainer.innerHTML = filteredUsers.map(user => createUserCard(user)).join('');
};

const createUserCard = (user) => {
    const completedTodos = user.todos ? user.todos.filter(todo => todo.completed).length : 0;
    const totalTodos = user.todos ? user.todos.length : 0;

    return `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-avatar">
                <img src="assets/images/${user.id}.jpg" 
                     alt="Photo de ${user.name}" 
                     class="profile-image"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="avatar-fallback" style="display: none;">
                    ${user.name.split(' ').map(n => n[0]).join('')}
                </div>
            </div>
            <div class="user-info">
                <h3 class="user-name">${user.name}</h3>
                <p class="user-email">${user.email}</p>
                <div class="user-details">
                    <span class="user-company">${user.company.name}</span>
                </div>
                <div class="user-stats">
                    <span class="stat-item">${completedTodos}/${totalTodos} tâches</span>
                </div>
                <a href="user.html?id=${user.id}" class="view-btn">Voir les tâches</a>
            </div>
        </div>
    `;
};

const initSearch = () => {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
};

const performSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        filteredUsers = [...allUsers];
    } else {
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.company.name.toLowerCase().includes(term) ||
            (user.todos && user.todos.some(todo => 
                todo.title.toLowerCase().includes(term)
            ))
        );
    }
    
    renderUsers();
    applySorting();
};

const initFilters = () => {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
        applySorting(e.target.value);
    });
};

const applySorting = (sortBy = 'default') => {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = sortBy;
    }

    switch (sortBy) {
        case 'name':
            filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'company':
            filteredUsers.sort((a, b) => a.company.name.localeCompare(b.company.name));
            break;
        case 'tasks':
            filteredUsers.sort((a, b) => {
                const aTasks = a.todos ? a.todos.length : 0;
                const bTasks = b.todos ? b.todos.length : 0;
                return bTasks - aTasks;
            });
            break;
        default:
            filteredUsers.sort((a, b) => a.id - b.id);
    }
    
    renderUsers();
};

const showError = (message) => {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
};

const showSuccess = (message) => {
    const successContainer = document.getElementById('success-container');
    if (successContainer) {
        successContainer.innerHTML = `<div class="success-message">${message}</div>`;
        successContainer.style.display = 'block';
        setTimeout(() => {
            successContainer.style.display = 'none';
        }, 3000);
    }
};

setTimeout(() => {
    initApp();
}, 100);