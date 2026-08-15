"use strict";
/**
 * User Repository
 * Handles all database operations related to users
 * Implements the Repository Pattern to abstract database logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserRepository {
    /**
     * Find a user by email
     * @param emailId - The email to search for
     * @returns User object if found, undefined otherwise
     */
    findByEmail(emailId) {
        return database_1.default.get('SELECT * FROM users WHERE emailId = ?', emailId);
    }
    /**
     * Find a user by ID
     * @param id - The user ID to search for
     * @returns User object if found, undefined otherwise
     */
    findById(id) {
        return database_1.default.get('SELECT * FROM users WHERE id = ?', id);
    }
    /**
     * Get all users ordered by creation date (newest first)
     * @returns Array of all users
     */
    findAll() {
        return database_1.default.all('SELECT * FROM users ORDER BY id DESC');
    }
    /**
     * Search users by email keyword
     * @param keyword - Partial email to search for
     * @returns Array of matching users
     */
    findByEmailKeyword(keyword) {
        return database_1.default.all('SELECT * FROM users WHERE LOWER(emailId) LIKE ? ORDER BY id DESC', `%${keyword.toLowerCase()}%`);
    }
    /**
     * Create a new user
     * @param userData - User data to create
     * @returns Created user object with ID
     */
    create(userData) {
        const { username, emailId, password, role = 'user' } = userData;
        const result = database_1.default.run('INSERT INTO users (username, emailId, password, role) VALUES (?, ?, ?, ?)', username, emailId, password, role);
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
    update(id, updates) {
        const existingUser = this.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const updatedUsername = updates.username ?? existingUser.username;
        const updatedEmailId = updates.emailId ?? existingUser.emailId;
        const updatedPassword = updates.password ?? existingUser.password;
        const updatedRole = updates.role ?? existingUser.role;
        const result = database_1.default.run('UPDATE users SET username = ?, emailId = ?, password = ?, role = ? WHERE id = ?', updatedUsername, updatedEmailId, updatedPassword, updatedRole, id);
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
    delete(id) {
        const result = database_1.default.run('DELETE FROM users WHERE id = ?', id);
        return result.changes;
    }
}
exports.default = new UserRepository();
