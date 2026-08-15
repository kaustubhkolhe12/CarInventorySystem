/**
 * Authentication Service
 * Handles all authentication-related business logic
 * Encapsulates auth validation and user creation logic
 */

import userRepository from '../repositories/userRepository';
import type { User, UserCreateInput, UserResponse } from '../types/user';

class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Created user (without password)
   * @throws Error if user already exists or validation fails
   */
  register(userData: UserCreateInput): UserResponse {
    const { username, emailId, password } = userData;

    // Validate required fields
    if (!username || !emailId || !password) {
      throw new Error('Username, emailId and password are required.');
    }

    // Check if user already exists
    const existingUser = userRepository.findByEmail(emailId);
    if (existingUser) {
      throw new Error('User already registered. Please login.');
    }

    // Create the user
    const createdUser = userRepository.create({ ...userData, role: userData.role ?? 'user' });

    // Return user without password
    return this.sanitizeUser(createdUser);
  }

  /**
   * Authenticate a user with email and password
   * @param emailId - User email
   * @param password - User password
   * @returns Authenticated user (without password)
   * @throws Error if user not found or password is incorrect
   */
  login(emailId: string, password: string): UserResponse {
    // Validate required fields
    if (!emailId || !password) {
      throw new Error('Email and password are required.');
    }

    // Find user by email
    const user = userRepository.findByEmail(emailId);
    if (!user) {
      throw new Error('User is not registered. Please register first.');
    }

    // Verify password
    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    // Return user without password
    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive information from user object
   * @param user - User object with sensitive data
   * @returns User object without password
   */
  private sanitizeUser(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      emailId: user.emailId,
      role: user.role,
    };
  }
}

export default new AuthService();
