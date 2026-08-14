/**
 * User Repository
 * Handles all database operations related to users
 * Implements the Repository Pattern to abstract database logic
 */

import db from '../config/database';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

class UserRepository {
  /**
   * Find a user by email
   * @param emailId - The email to search for
   * @returns User object if found, undefined otherwise
   */
  findByEmail(emailId: string): User | undefined {
    return db.get<User>('SELECT * FROM users WHERE emailId = ?', emailId);
  }

  /**
   * Find a user by ID
   * @param id - The user ID to search for
   * @returns User object if found, undefined otherwise
   */
  findById(id: number): User | undefined {
    return db.get<User>('SELECT * FROM users WHERE id = ?', id);
  }

  /**
   * Get all users ordered by creation date (newest first)
   * @returns Array of all users
   */
  findAll(): User[] {
    return db.all<User>('SELECT * FROM users ORDER BY id DESC');
  }

  /**
   * Search users by email keyword
   * @param keyword - Partial email to search for
   * @returns Array of matching users
   */
  findByEmailKeyword(keyword: string): User[] {
    return db.all<User>(
      'SELECT * FROM users WHERE LOWER(emailId) LIKE ? ORDER BY id DESC',
      `%${keyword.toLowerCase()}%`
    );
  }

  /**
   * Create a new user
   * @param userData - User data to create
   * @returns Created user object with ID
   */
  create(userData: UserCreateInput): User {
    const { username, emailId, password } = userData;
    const result = db.run(
      'INSERT INTO users (username, emailId, password) VALUES (?, ?, ?)',
      username,
      emailId,
      password
    );

    const createdUser = this.findById(result.lastInsertRowid);
    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    return createdUser;
  }

  /**
   * Update an existing user
   * @param id - User ID to update
   * @param updates - Partial user data to update
   * @returns Updated user object
   */
  update(id: number, updates: UserUpdateInput): User {
    const existingUser = this.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUsername = updates.username ?? existingUser.username;
    const updatedEmailId = updates.emailId ?? existingUser.emailId;
    const updatedPassword = updates.password ?? existingUser.password;

    const result = db.run(
      'UPDATE users SET username = ?, emailId = ?, password = ? WHERE id = ?',
      updatedUsername,
      updatedEmailId,
      updatedPassword,
      id
    );

    if (result.changes === 0) {
      throw new Error('Failed to update user');
    }

    const updatedUser = this.findById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return updatedUser;
  }

  /**
   * Delete a user by ID
   * @param id - User ID to delete
   * @returns Number of users deleted
   */
  delete(id: number): number {
    const result = db.run('DELETE FROM users WHERE id = ?', id);
    return result.changes;
  }
}

export default new UserRepository();
