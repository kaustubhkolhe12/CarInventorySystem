/**
 * Authentication Routes
 * Defines HTTP endpoints for authentication operations
 */

import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

/** POST /api/auth/register - Register a new user */
router.post('/register', authController.register);

/** POST /api/auth/login - Authenticate user */
router.post('/login', authController.login);

export default router;
