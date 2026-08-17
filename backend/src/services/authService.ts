/**
 * Authentication Service
 * Handles all authentication-related business logic
 * Encapsulates auth validation, password hashing with bcrypt, and JWT token generation
 */

import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import { generateToken } from '../utils/jwtUtils';
import type { User, UserCreateInput, UserResponse } from '../types/user';

/**
 * Authentication response with JWT token
 */
export interface AuthResponseData {
  message: string;
  user: UserResponse;
  token: string;
}

class AuthService {
  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Cost factor for bcrypt
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash using bcrypt
   * @param password - Plain text password
   * @param hash - Hashed password from database
   * @returns True if passwords match
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register a new user with bcrypt password hashing
   * @param userData - User registration data
   * @returns Created user response with token
   * @throws Error if user already exists or validation fails
   */
  async register(userData: UserCreateInput): Promise<AuthResponseData> {
    const { username, emailId, password } = userData;

    // Validate required fields
    if (!username || !emailId || !password) {
      throw new Error('Username, emailId and password are required.');
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check if user already exists
    const existingUser = userRepository.findByEmail(emailId);
    if (existingUser) {
      throw new Error('User already registered. Please login.');
    }

    // Hash the password before storing
    const hashedPassword = await this.hashPassword(password);

    // Create the user with hashed password
    const createdUser = userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role ?? 'user',
    });

    // Generate JWT token
    const token = generateToken(createdUser);

    // Return user without password
    return {
      message: 'Registration successful',
      user: this.sanitizeUser(createdUser),
      token,
    };
  }

  /**
   * Authenticate a user with email and password using bcrypt
   * @param emailId - User email
   * @param password - User password (plain text)
   * @returns Authenticated user response with token
   * @throws Error if user not found or password is incorrect
   */
  async login(emailId: string, password: string): Promise<AuthResponseData> {
    // Validate required fields
    if (!emailId || !password) {
      throw new Error('Email and password are required.');
    }

    // Find user by email
    const user = userRepository.findByEmail(emailId);
    if (!user) {
      throw new Error('Invalid credentials. Please check your email and password.');
    }

    // Verify password using bcrypt
    const passwordMatch = await this.comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials. Please check your email and password.');
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user without password
    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      token,
    };
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
