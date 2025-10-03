/**
 * Gestion des appels API vers JSONPlaceholder
 * Module pour toutes les interactions avec l'API externe
 */

// Configuration de l'API
const API_CONFIG = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 10000, // 10 secondes
    retryAttempts: 3
};

/**
 * Effectue une requête HTTP avec gestion d'erreurs et retry
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @param {number} retryCount - Nombre de tentatives restantes
 * @returns {Promise<Object>} Réponse de l'API
 */
const fetchWithRetry = async (url, options = {}, retryCount = API_CONFIG.retryAttempts) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('La requête a expiré. Veuillez vérifier votre connexion internet.');
        }

        // Retry en cas d'erreur réseau
        if (retryCount > 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
            console.warn(`Tentative ${API_CONFIG.retryAttempts - retryCount + 1} échouée, nouvelle tentative...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
            return fetchWithRetry(url, options, retryCount - 1);
        }

        throw error;
    }
};

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<Array>} Liste des utilisateurs
 */
const getUsers = async () => {
    try {
        const users = await fetchWithRetry(`${API_CONFIG.baseUrl}/users`);
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: {
                name: user.company.name,
                catchPhrase: user.company.catchPhrase,
                bs: user.company.bs
            },
            address: {
                street: user.address.street,
                suite: user.address.suite,
                city: user.address.city,
                zipcode: user.address.zipcode,
                geo: user.address.geo
            }
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw new Error('Impossible de charger les utilisateurs. Veuillez réessayer plus tard.');
    }
};

/**
 * Récupère un utilisateur par son ID
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Données de l'utilisateur
 */
const getUserById = async (userId) => {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('ID utilisateur invalide');
        }

        const user = await fetchWithRetry(`${API_CONFIG.baseUrl}/users/${userId}`);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: {
                name: user.company.name,
                catchPhrase: user.company.catchPhrase,
                bs: user.company.bs
            },
            address: {
                street: user.address.street,
                suite: user.address.suite,
                city: user.address.city,
                zipcode: user.address.zipcode,
                geo: user.address.geo
            }
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
        throw new Error('Impossible de charger les informations de cet utilisateur.');
    }
};

/**
 * Récupère les tâches d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des tâches
 */
const getUserTodos = async (userId) => {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('ID utilisateur invalide');
        }

        const todos = await fetchWithRetry(`${API_CONFIG.baseUrl}/todos?userId=${userId}`);
        return todos.map(todo => ({
            id: todo.id,
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed
        }));
    } catch (error) {
        console.error(`Erreur lors de la récupération des tâches de l'utilisateur ${userId}:`, error);
        throw new Error('Impossible de charger les tâches de cet utilisateur.');
    }
};

/**
 * Crée une nouvelle tâche
 * @param {Object} todoData - Données de la tâche
 * @param {number} todoData.userId - ID de l'utilisateur
 * @param {string} todoData.title - Titre de la tâche
 * @param {boolean} todoData.completed - Statut de la tâche
 * @returns {Promise<Object>} Tâche créée
 */
const createTodo = async (todoData) => {
    try {
        // Validation des données
        if (!todoData.userId || isNaN(todoData.userId)) {
            throw new Error('ID utilisateur invalide');
        }

        if (!todoData.title || typeof todoData.title !== 'string' || todoData.title.trim().length < 3) {
            throw new Error('Le titre de la tâche doit contenir au moins 3 caractères');
        }

        const newTodo = await fetchWithRetry(`${API_CONFIG.baseUrl}/todos`, {
            method: 'POST',
            body: JSON.stringify({
                userId: parseInt(todoData.userId),
                title: todoData.title.trim(),
                completed: Boolean(todoData.completed)
            })
        });

        return {
            id: newTodo.id,
            userId: newTodo.userId,
            title: newTodo.title,
            completed: newTodo.completed
        };
    } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
        throw new Error('Impossible de créer cette tâche. Veuillez réessayer.');
    }
};

/**
 * Met à jour une tâche existante
 * @param {number} todoId - ID de la tâche
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Tâche mise à jour
 */
const updateTodo = async (todoId, updateData) => {
    try {
        if (!todoId || isNaN(todoId)) {
            throw new Error('ID de tâche invalide');
        }

        const updatedTodo = await fetchWithRetry(`${API_CONFIG.baseUrl}/todos/${todoId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        return {
            id: updatedTodo.id,
            userId: updatedTodo.userId,
            title: updatedTodo.title,
            completed: updatedTodo.completed
        };
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la tâche ${todoId}:`, error);
        throw new Error('Impossible de mettre à jour cette tâche.');
    }
};

/**
 * Supprime une tâche
 * @param {number} todoId - ID de la tâche
 * @returns {Promise<boolean>} Succès de la suppression
 */
const deleteTodo = async (todoId) => {
    try {
        if (!todoId || isNaN(todoId)) {
            throw new Error('ID de tâche invalide');
        }

        await fetchWithRetry(`${API_CONFIG.baseUrl}/todos/${todoId}`, {
            method: 'DELETE'
        });

        return true;
    } catch (error) {
        console.error(`Erreur lors de la suppression de la tâche ${todoId}:`, error);
        throw new Error('Impossible de supprimer cette tâche.');
    }
};

/**
 * Récupère les données complètes d'un utilisateur avec ses tâches
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Données complètes de l'utilisateur
 */
const getUserWithTodos = async (userId) => {
    try {
        const [user, todos] = await Promise.all([
            getUserById(userId),
            getUserTodos(userId)
        ]);

        return {
            ...user,
            todos: todos
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des données complètes de l'utilisateur ${userId}:`, error);
        throw error;
    }
};

/**
 * Récupère tous les utilisateurs avec leurs tâches
 * @returns {Promise<Array>} Liste des utilisateurs avec leurs tâches
 */
const getAllUsersWithTodos = async () => {
    try {
        const users = await getUsers();
        
        // Récupère les tâches pour tous les utilisateurs en parallèle
        const usersWithTodos = await Promise.all(
            users.map(async (user) => {
                try {
                    const todos = await getUserTodos(user.id);
                    return {
                        ...user,
                        todos: todos
                    };
                } catch (error) {
                    console.warn(`Impossible de charger les tâches pour l'utilisateur ${user.id}:`, error);
                    return {
                        ...user,
                        todos: []
                    };
                }
            })
        );

        return usersWithTodos;
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les utilisateurs avec leurs tâches:', error);
        throw error;
    }
};

/**
 * Teste la connectivité à l'API
 * @returns {Promise<boolean>} API accessible ou non
 */
const testApiConnection = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(`${API_CONFIG.baseUrl}/users/1`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Teste juste que la réponse est valide, sans parser le JSON
        const text = await response.text();
        return text.length > 0;

    } catch (error) {
        console.warn('Test de connexion API échoué:', error);
        return false;
    }
};

// Export des fonctions pour utilisation dans d'autres modules
window.API = {
    getUsers,
    getUserById,
    getUserTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getUserWithTodos,
    getAllUsersWithTodos,
    testApiConnection,
    config: API_CONFIG
};
