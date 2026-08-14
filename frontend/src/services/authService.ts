/**
 * Authentication API Service
 * Handles all HTTP requests related to authentication
 * Centralizes API communication for maintainability and error handling
 */

import type { AuthResponse, AuthFormData } from '../types/auth';

const API_URL = 'http://localhost:3000/api/auth';

/**
 * Register a new user
 * @param formData - User registration data (username, email, password)
 * @returns Promise with auth response
 * @throws Error if registration fails
 */
export const registerUser = async (formData: AuthFormData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

/**
 * Login user
 * @param email - User email address
 * @param password - User password
 * @returns Promise with auth response
 * @throws Error if login fails
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailId: email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};
