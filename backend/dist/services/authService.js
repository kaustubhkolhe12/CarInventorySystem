import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import { generateToken } from '../utils/jwtUtils';

/**
 * Authentication Service
 *
 * Handles:
 * - User registration
 * - Password hashing
 * - Password verification
 * - User login
 * - JWT generation
 */
class AuthService {
  /**
   * Hash a password using bcrypt.
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain-text password with bcrypt hash.
   */
  async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register a new user.
   */
  async register(userData: {
    username: string;
    emailId: string;
    password: string;
    role?: string;
  }) {
    const {
      username,
      emailId,
      password,
    } = userData;

    // Validate required fields
    if (!username || !emailId || !password) {
      throw new Error(
        'Username, emailId and password are required.'
      );
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error(
        'Password must be at least 6 characters long.'
      );
    }

    // Check whether user already exists
    const existingUser =
      userRepository.findByEmail(emailId);

    if (existingUser) {
      throw new Error(
        'User already registered. Please login.'
      );
    }

    // Hash password
    const hashedPassword =
      await this.hashPassword(password);

    // Create user
    const createdUser = userRepository.create({
      username,
      emailId,
      password: hashedPassword,
      role: userData.role ?? 'user',
    });

    // Generate JWT
    const token = generateToken(createdUser);

    return {
      message: 'Registration successful',
      user: this.sanitizeUser(createdUser),
      token,
    };
  }

  /**
   * Authenticate user using email and password.
   */
  async login(
    emailId: string,
    password: string
  ) {
    // Validate required fields
    if (!emailId || !password) {
      throw new Error(
        'Email and password are required.'
      );
    }

    // Find user by email
    const user =
      userRepository.findByEmail(emailId);

    if (!user) {
      throw new Error(
        'Invalid credentials. Please check your email and password.'
      );
    }

    // Verify password against bcrypt hash
    const passwordMatch =
      await this.comparePassword(
        password,
        user.password
      );

    if (!passwordMatch) {
      throw new Error(
        'Invalid credentials. Please check your email and password.'
      );
    }

    // Generate JWT
    const token = generateToken(user);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Remove password from user response.
   */
  sanitizeUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      emailId: user.emailId,
      role: user.role,
    };
  }
}

export default new AuthService();