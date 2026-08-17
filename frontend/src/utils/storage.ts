/**
 * Local Storage Utilities
 * Handles all localStorage operations for user session management
 * Provides type-safe getter and setter methods with JWT token support
 */

import type { User } from '../types/auth';

const STORAGE_KEY = 'car_dealership_user';
const TOKEN_STORAGE_KEY = 'car_dealership_token';

/**
 * Save user to localStorage
 * @param user - User object to save
 */
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

/**
 * Retrieve user from localStorage
 * @returns User object or null if not found
 */
export const getUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Clear user from localStorage
 */
export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Check if user is logged in
 * @returns True if user exists in localStorage or has valid JWT token
 */
export const isUserLoggedIn = (): boolean => {
  return getUser() !== null || !!getToken();
};

/**
 * Save JWT token to localStorage
 * @param token - JWT token to save
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 * @returns JWT token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Clear JWT token from localStorage
 */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

/**
 * Clear all authentication data
 */
export const clearAll = (): void => {
  clearUser();
  clearToken();
};
