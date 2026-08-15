"use strict";
/**
 * User Service
 * Handles user management business logic
 * Provides CRUD operations for user data
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class UserService {
    /**
     * Get all users
     * @returns Array of all users (without passwords)
     */
    getAllUsers() {
        return userRepository_1.default.findAll();
    }
    /**
     * Get user by ID
     * @param id - User ID
     * @returns User object
     * @throws Error if user not found
     */
    getUserById(id) {
        const user = userRepository_1.default.findById(id);
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
    searchUsersByEmail(keyword) {
        const normalizedKeyword = String(keyword ?? '').toLowerCase();
        return userRepository_1.default.findByEmailKeyword(normalizedKeyword);
    }
    /**
     * Create a new user
     * @param userData - User data to create
     * @returns Created user
     * @throws Error if user already exists or validation fails
     */
    createUser(userData) {
        const { username, emailId, password } = userData;
        // Validate required fields
        if (!username || !emailId || !password) {
            throw new Error('Username, emailId and password are required.');
        }
        // Check if user already exists
        const existingUser = userRepository_1.default.findByEmail(emailId);
        if (existingUser) {
            throw new Error('User already exists or invalid data.');
        }
        // Create the user
        return userRepository_1.default.create({ ...userData, role: userData.role ?? 'user' });
    }
    addAdmin(adminEmail, targetEmail, username, password) {
        if (!adminEmail || !targetEmail || !username) {
            throw new Error('Admin email, target email and username are required.');
        }
        const requester = userRepository_1.default.findByEmail(adminEmail);
        if (!requester || requester.role !== 'admin') {
            throw new Error('Only admins can add new admins.');
        }
        const existingUser = userRepository_1.default.findByEmail(targetEmail);
        if (existingUser) {
            const updatedUser = userRepository_1.default.update(existingUser.id, { role: 'admin' });
            return updatedUser;
        }
        const generatedPassword = password || 'Admin@123';
        return userRepository_1.default.create({
            username,
            emailId: targetEmail,
            password: generatedPassword,
            role: 'admin',
        });
    }
    /**
     * Update an existing user
     * @param id - User ID to update
     * @param updates - Partial user data to update
     * @returns Updated user object
     * @throws Error if user not found or update fails
     */
    updateUser(id, updates) {
        return userRepository_1.default.update(id, updates);
    }
    /**
     * Delete a user
     * @param id - User ID to delete
     * @returns True if deletion was successful
     * @throws Error if user not found
     */
    deleteUser(id) {
        const result = userRepository_1.default.delete(id);
        if (result === 0) {
            throw new Error('User not found');
        }
        return true;
    }
}
exports.default = new UserService();
