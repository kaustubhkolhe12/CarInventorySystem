/**
 * User Service
 * Handles user management business logic
 * Provides CRUD operations for user data
 */

import userRepository from '../repositories/userRepository';
import type { User, UserCreateInput, UserUpdateInput, UserResponse } from '../types/user';

class UserService {
  /**
   * Get all users
   * @returns Array of all users (without passwords)
   */
  getAllUsers(): User[] {
    return userRepository.findAll();
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User object
   * @throws Error if user not found
   */
  getUserById(id: number): User {
    const user = userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Search users by email keyword
   * @param keyword - Email keyword to search for
   * @returns Array of matching users
   */
  searchUsersByEmail(keyword: string): User[] {
    const normalizedKeyword = String(keyword ?? '').toLowerCase();
    return userRepository.findByEmailKeyword(normalizedKeyword);
  }

  /**
   * Create a new user
   * @param userData - User data to create
   * @returns Created user
   * @throws Error if user already exists or validation fails
   */
  createUser(userData: UserCreateInput): User {
    const { username, emailId, password } = userData;

    // Validate required fields
    if (!username || !emailId || !password) {
      throw new Error('Username, emailId and password are required.');
    }

    // Check if user already exists
    const existingUser = userRepository.findByEmail(emailId);
    if (existingUser) {
      throw new Error('User already exists or invalid data.');
    }

    // Create the user
    return userRepository.create(userData);
  }

  /**
   * Update an existing user
   * @param id - User ID to update
   * @param updates - Partial user data to update
   * @returns Updated user object
   * @throws Error if user not found or update fails
   */
  updateUser(id: number, updates: UserUpdateInput): User {
    return userRepository.update(id, updates);
  }

  /**
   * Delete a user
   * @param id - User ID to delete
   * @returns True if deletion was successful
   * @throws Error if user not found
   */
  deleteUser(id: number): boolean {
    const result = userRepository.delete(id);
    if (result === 0) {
      throw new Error('User not found');
    }
    return true;
  }
}

export default new UserService();
