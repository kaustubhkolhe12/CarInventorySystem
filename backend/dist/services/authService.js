"use strict";
/**
 * Authentication Service
 * Handles all authentication-related business logic
 * Encapsulates auth validation and user creation logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class AuthService {
    /**
     * Register a new user
     * @param userData - User registration data
     * @returns Created user (without password)
     * @throws Error if user already exists or validation fails
     */
    register(userData) {
        const { username, emailId, password } = userData;
        // Validate required fields
        if (!username || !emailId || !password) {
            throw new Error('Username, emailId and password are required.');
        }
        // Check if user already exists
        const existingUser = userRepository_1.default.findByEmail(emailId);
        if (existingUser) {
            throw new Error('User already registered. Please login.');
        }
        // Create the user
        const createdUser = userRepository_1.default.create({ ...userData, role: userData.role ?? 'user' });
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
    login(emailId, password) {
        // Validate required fields
        if (!emailId || !password) {
            throw new Error('Email and password are required.');
        }
        // Find user by email
        const user = userRepository_1.default.findByEmail(emailId);
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
    sanitizeUser(user) {
        return {
            id: user.id,
            username: user.username,
            emailId: user.emailId,
            role: user.role,
        };
    }
}
exports.default = new AuthService();
