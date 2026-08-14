/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 * Routes requests to auth service and formats responses
 */

import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
  /**
   * Handle user registration request
   * POST /api/auth/register
   */
  register = (req: Request, res: Response): void => {
    try {
      const { username, emailId, password } = req.body;

      // Register user using auth service
      const user = authService.register({ username, emailId, password });

      // Return 201 Created with user data
      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Handle user login request
   * POST /api/auth/login
   */
  login = (req: Request, res: Response): void => {
    try {
      const { emailId, password } = req.body;

      // Authenticate user using auth service
      const user = authService.login(emailId, password);

      // Return 200 OK with user data
      res.status(200).json({
        message: 'Login successful',
        user,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Centralized error handling for auth operations
   * Maps service errors to appropriate HTTP status codes
   */
  private handleError(error: any, res: Response): void {
    const errorMessage = error?.message || 'Authentication failed.';

    if (errorMessage.includes('required')) {
      res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes('already registered')) {
      res.status(409).json({ message: errorMessage });
    } else if (errorMessage.includes('not registered')) {
      res.status(404).json({ message: errorMessage });
    } else if (errorMessage.includes('Incorrect password')) {
      res.status(401).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: 'Unable to process authentication request.' });
    }
  }
}

export default new AuthController();
