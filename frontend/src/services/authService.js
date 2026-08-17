/**
 * Authentication API Service
 * Handles all HTTP requests related to authentication
 * Manages JWT token storage and transmission
 * Centralizes API communication for maintainability and error handling
 */
const API_URL = 'http://localhost:3000/api/auth';
const USERS_API_URL = 'http://localhost:3000/api/users';
/**
 * Get stored JWT token from localStorage
 */
const getStoredToken = () => {
    return localStorage.getItem('car_dealership_token');
};
/**
 * Store JWT token in localStorage
 */
const storeToken = (token) => {
    localStorage.setItem('car_dealership_token', token);
};
/**
 * Clear JWT token from localStorage
 */
const clearToken = () => {
    localStorage.removeItem('car_dealership_token');
    localStorage.removeItem('car_dealership_user');
};
/**
 * Get authorization headers with Bearer token
 */
const getAuthHeaders = () => {
    const token = getStoredToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};
/**
 * Register a new user
 * @param formData - User registration data (username, email, password)
 * @returns Promise with auth response containing JWT token
 * @throws Error if registration fails
 */
export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }
    const data = await response.json();
    // Store JWT token from response
    if (data.token) {
        storeToken(data.token);
    }
    // Store user info for easy access (email, role)
    if (data.user) {
        localStorage.setItem('car_dealership_user', JSON.stringify(data.user));
    }
    return data;
};
/**
 * Login user
 * @param email - User email address
 * @param password - User password
 * @returns Promise with auth response containing JWT token
 * @throws Error if login fails
 */
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }
    const data = await response.json();
    // Store JWT token from response
    if (data.token) {
        storeToken(data.token);
    }
    // Store user info for easy access (email, role)
    if (data.user) {
        localStorage.setItem('car_dealership_user', JSON.stringify(data.user));
    }
    return data;
};
/**
 * Logout user by clearing stored token and user data
 */
export const logoutUser = () => {
    clearToken();
};
/**
 * Check if user is authenticated (has a valid token)
 */
export const isAuthenticated = () => {
    return !!getStoredToken();
};
/**
 * Get current authenticated user from localStorage
 */
export const getCurrentUser = () => {
    const stored = localStorage.getItem('car_dealership_user');
    if (!stored)
        return null;
    try {
        return JSON.parse(stored);
    }
    catch {
        return null;
    }
};
export const addAdminUser = async (payload) => {
    const response = await fetch(`${USERS_API_URL}/admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add admin');
    }
    return response.json();
};
