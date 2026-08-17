/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information
 * Protects routes that require authentication
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Extended request type with user info
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    emailId: string;
    role: 'user' | 'admin';
  };
}

/**
 * Verify JWT token middleware
 * Extracts token from Authorization header and validates it
 * Sets req.user if valid, returns 401 if invalid
 */
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as {
      id: number;
      emailId: string;
      role: 'user' | 'admin';
    };

    // Attach user info to request
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
};

/**
 * Optional auth middleware
 * Does not fail if token is missing, but verifies if present
 * Useful for endpoints that work with or without auth
 */
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(token, secret) as {
        id: number;
        emailId: string;
        role: 'user' | 'admin';
      };
      (req as AuthenticatedRequest).user = decoded;
    }
    next();
  } catch {
    // If token exists but is invalid, still pass through
    // Allows optional auth
    next();
  }
};
