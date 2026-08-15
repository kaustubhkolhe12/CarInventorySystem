"use strict";
/**
 * User Controller
 * Handles HTTP requests for user management operations
 * Routes requests to user service and formats responses
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
class UserController {
    constructor() {
        /**
         * Get all users
         * GET /api/users
         */
        this.getAll = (req, res) => {
            try {
                const users = userService_1.default.getAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Get user by ID
         * GET /api/users/:id
         */
        this.getById = (req, res) => {
            try {
                const { id } = req.params;
                const user = userService_1.default.getUserById(Number(id));
                res.status(200).json(user);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Search users by email keyword
         * GET /api/users/email/:keyword
         */
        this.searchByEmail = (req, res) => {
            try {
                const keyword = Array.isArray(req.params.keyword) ? req.params.keyword[0] : req.params.keyword;
                const users = userService_1.default.searchUsersByEmail(keyword || '');
                res.status(200).json(users);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Create a new user
         * POST /api/users
         */
        this.create = (req, res) => {
            try {
                const { username, emailId, password, role } = req.body;
                const user = userService_1.default.createUser({ username, emailId, password, role });
                res.status(201).json(user);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.addAdmin = (req, res) => {
            try {
                const { adminEmail, emailId, username, password } = req.body;
                const user = userService_1.default.addAdmin(adminEmail, emailId, username, password);
                res.status(201).json(user);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Update an existing user
         * PUT /api/users/:id
         */
        this.update = (req, res) => {
            try {
                const { id } = req.params;
                const updates = req.body;
                const user = userService_1.default.updateUser(Number(id), updates);
                res.status(200).json(user);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        /**
         * Delete a user
         * DELETE /api/users/:id
         */
        this.delete = (req, res) => {
            try {
                const { id } = req.params;
                userService_1.default.deleteUser(Number(id));
                res.status(200).json({ message: 'User deleted successfully' });
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
    }
    /**
     * Centralized error handling for user operations
     * Maps service errors to appropriate HTTP status codes
     */
    handleError(error, res) {
        const errorMessage = error?.message || 'User operation failed.';
        if (errorMessage.includes('required')) {
            res.status(400).json({ message: errorMessage });
        }
        else if (errorMessage.includes('not found')) {
            res.status(404).json({ message: errorMessage });
        }
        else if (errorMessage.includes('already exists')) {
            res.status(409).json({ message: errorMessage });
        }
        else if (errorMessage.includes('Only admins')) {
            res.status(403).json({ message: errorMessage });
        }
        else {
            res.status(500).json({ message: 'Unable to process user request.' });
        }
    }
}
exports.default = new UserController();
