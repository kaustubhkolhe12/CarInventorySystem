"use strict";
/**
 * User Management Routes
 * Defines HTTP endpoints for user CRUD operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
/** GET /api/users - Get all users */
router.get('/', userController_1.default.getAll);
/** POST /api/users - Create a new user */
router.post('/', userController_1.default.create);
/** POST /api/users/admin - Promote an existing user or create a new admin */
router.post('/admin', userController_1.default.addAdmin);
/** GET /api/users/email/:keyword - Search users by email */
router.get('/email/:keyword', userController_1.default.searchByEmail);
/** GET /api/users/:id - Get user by ID */
router.get('/:id', userController_1.default.getById);
/** PUT /api/users/:id - Update user */
router.put('/:id', userController_1.default.update);
/** DELETE /api/users/:id - Delete user */
router.delete('/:id', userController_1.default.delete);
exports.default = router;
