"use strict";
/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information
 * Protects routes that require authentication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Verify JWT token middleware
 * Extracts token from Authorization header and validates it
 * Sets req.user if valid, returns 401 if invalid
 */
const verifyToken = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Attach user info to request
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        }
        else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    }
};
exports.verifyToken = verifyToken;
/**
 * Optional auth middleware
 * Does not fail if token is missing, but verifies if present
 * Useful for endpoints that work with or without auth
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = decoded;
        }
        next();
    }
    catch {
        // If token exists but is invalid, still pass through
        // Allows optional auth
        next();
    }
};
exports.optionalAuth = optionalAuth;
