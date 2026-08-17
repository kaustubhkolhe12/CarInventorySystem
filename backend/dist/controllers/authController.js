"use strict";
/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 * Routes requests to auth service and formats responses with JWT tokens
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
class AuthController {
    constructor() {
        /**
         * Handle user registration request
         * POST /api/auth/register
         */
        this.register = async (req, res) => {
            try {
                const { username, emailId, password } = req.body;
                // Register user using auth service (now with bcrypt and JWT)
                const authResponse = await authService_1.default.register({
                    username,
                    emailId,
                    password,
                });
                // Return 201 Created with user data and JWT token
                res.status(201).json(authResponse);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Handle user login request
         * POST /api/auth/login
         */
        this.login = async (req, res) => {
            try {
                const { emailId, password } = req.body;
                // Authenticate user using auth service (now with bcrypt verification)
                const authResponse = await authService_1.default.login(emailId, password);
                // Return 200 OK with user data and JWT token
                res.status(200).json(authResponse);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
    }
    /**
     * Centralized error handling for auth operations
     * Maps service errors to appropriate HTTP status codes
     */
    handleError(error, res) {
        const errorMessage = error?.message || 'Authentication failed.';
        if (errorMessage.includes('required')) {
            res.status(400).json({ message: errorMessage });
        }
        else if (errorMessage.includes('already registered')) {
            res.status(409).json({ message: errorMessage });
        }
        else if (errorMessage.includes('Invalid credentials')) {
            res.status(401).json({ message: errorMessage });
        }
        else if (errorMessage.includes('must be at least')) {
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(500).json({ message: 'Unable to process authentication request.' });
        }
    }
}
exports.default = new AuthController();
