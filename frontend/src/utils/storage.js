/**
 * Local Storage Utilities
 * Handles all localStorage operations for user session management
 * Provides type-safe getter and setter methods with JWT token support
 */
const STORAGE_KEY = 'car_dealership_user';
const TOKEN_STORAGE_KEY = 'car_dealership_token';
/**
 * Save user to localStorage
 * @param user - User object to save
 */
export const saveUser = (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};
/**
 * Retrieve user from localStorage
 * @returns User object or null if not found
 */
export const getUser = () => {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
};
/**
 * Clear user from localStorage
 */
export const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY);
};
/**
 * Check if user is logged in
 * @returns True if user exists in localStorage or has valid JWT token
 */
export const isUserLoggedIn = () => {
    return getUser() !== null || !!getToken();
};
/**
 * Save JWT token to localStorage
 * @param token - JWT token to save
 */
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
};
/**
 * Retrieve JWT token from localStorage
 * @returns JWT token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
};
/**
 * Clear JWT token from localStorage
 */
export const clearToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};
/**
 * Clear all authentication data
 */
export const clearAll = () => {
    clearUser();
    clearToken();
};
