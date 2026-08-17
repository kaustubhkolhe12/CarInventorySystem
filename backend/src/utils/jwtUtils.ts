/**
 * JWT Utility Functions
 * Handles token generation and validation
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import type { User } from '../types/user';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  id: number;
  emailId: string;
  role: 'user' | 'admin';
}

/**
 * Generate JWT token for user
 * @param user - User object with id, emailId, and role
 * @returns Signed JWT token
 */
export const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  return jwt.sign(
    {
      id: user.id,
      emailId: user.emailId,
      role: user.role,
    } as JwtPayload,
    secret,
    {
      expiresIn: 86400, // 24 hours in seconds
    }
  );
};

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null if invalid format
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
};
