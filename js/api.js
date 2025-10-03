const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
};

const getAllUsers = async () => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users`);
    return await response.json();
};

const getUserById = async (userId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/users/${userId}`);
    return await response.json();
};

const getTodosByUserId = async (userId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/todos?userId=${userId}`);
    return await response.json();
};

const getAllUsersWithTodos = async () => {
    const users = await getAllUsers();
    const usersWithTodos = await Promise.all(
        users.map(async (user) => {
            const todos = await getTodosByUserId(user.id);
            return { ...user, todos };
        })
    );
    return usersWithTodos;
};

const createTodo = async (userId, title) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/todos`, {
        method: 'POST',
        body: JSON.stringify({
            userId: parseInt(userId),
            title: title,
            completed: false
        })
    });
    return await response.json();
};

const updateTodo = async (todoId, updates) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/todos/${todoId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    return await response.json();
};

const deleteTodo = async (todoId) => {
    const response = await fetchWithRetry(`${API_BASE_URL}/todos/${todoId}`, {
        method: 'DELETE'
    });
    return response.ok;
};

const testApiConnection = async () => {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/users`, {
            method: 'GET'
        });
        const text = await response.text();
        return text.length > 0;
    } catch (error) {
        console.error('Test de connexion API échoué:', error);
        return false;
    }
};

window.API = {
    getAllUsers,
    getUserById,
    getTodosByUserId,
    getAllUsersWithTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    testApiConnection
};