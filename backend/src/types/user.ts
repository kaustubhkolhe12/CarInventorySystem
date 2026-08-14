/**
 * User-related type definitions
 * Ensures type safety across the application
 */

/** Represents a user in the system */
export interface User {
  id: number;
  username: string;
  emailId: string;
  password: string;
}

/** User data sent by client during registration/creation */
export interface UserCreateInput {
  username: string;
  emailId: string;
  password: string;
}

/** User data sent by client during update */
export interface UserUpdateInput {
  username?: string;
  emailId?: string;
  password?: string;
}

/** User data returned to client (excludes sensitive info) */
export interface UserResponse {
  id: number;
  username: string;
  emailId: string;
}

/** Auth response after successful login */
export interface AuthResponse {
  message: string;
  user: UserResponse;
}
