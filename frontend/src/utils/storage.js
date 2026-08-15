/**
 * Local Storage Utilities
 * Handles all localStorage operations for user session management
 * Provides type-safe getter and setter methods
 */
const STORAGE_KEY = 'car_dealership_user';
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
 * @returns True if user exists in localStorage
 */
export const isUserLoggedIn = () => {
    return getUser() !== null;
};
