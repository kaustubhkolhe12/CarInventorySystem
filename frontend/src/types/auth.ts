/**
 * Shared API Types
 * Common type definitions used across frontend for API communication
 */

/** User object returned by API */
export interface User {
  id: number;
  username: string;
  emailId: string;
  role: 'user' | 'admin';
}

/** Authentication response from API */
export interface AuthResponse {
  message: string;
  user: User;
}

/** Login/Register form data */
export interface AuthFormData {
  username?: string;
  emailId: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface AdminCreatePayload {
  adminEmail: string;
  username: string;
  emailId: string;
  password: string;
}
