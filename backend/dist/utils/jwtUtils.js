"use strict";
/**
 * JWT Utility Functions
 * Handles token generation and validation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate JWT token for user
 * @param user - User object with id, emailId, and role
 * @returns Signed JWT token
 */
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    return jsonwebtoken_1.default.sign({
        id: user.id,
        emailId: user.emailId,
        role: user.role,
    }, secret, {
        expiresIn: 86400, // 24 hours in seconds
    });
};
exports.generateToken = generateToken;
/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token or null if invalid format
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
};
exports.extractToken = extractToken;
