/**
 * User Management Routes
 * Defines HTTP endpoints for user CRUD operations
 */

import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

/** GET /api/users - Get all users */
router.get('/', userController.getAll);

/** POST /api/users - Create a new user */
router.post('/', userController.create);

/** POST /api/users/admin - Promote an existing user or create a new admin */
router.post('/admin', userController.addAdmin);

/** GET /api/users/email/:keyword - Search users by email */
router.get('/email/:keyword', userController.searchByEmail);

/** GET /api/users/:id - Get user by ID */
router.get('/:id', userController.getById);

/** PUT /api/users/:id - Update user */
router.put('/:id', userController.update);

/** DELETE /api/users/:id - Delete user */
router.delete('/:id', userController.delete);

export default router;
