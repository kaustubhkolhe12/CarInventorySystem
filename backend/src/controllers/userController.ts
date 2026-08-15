/**
 * User Controller
 * Handles HTTP requests for user management operations
 * Routes requests to user service and formats responses
 */

import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  getAll = (req: Request, res: Response): void => {
    try {
      const users = userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  getById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const user = userService.getUserById(Number(id));
      res.status(200).json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Search users by email keyword
   * GET /api/users/email/:keyword
   */
  searchByEmail = (req: Request, res: Response): void => {
    try {
      const keyword = Array.isArray(req.params.keyword) ? req.params.keyword[0] : req.params.keyword;
      const users = userService.searchUsersByEmail(keyword || '');
      res.status(200).json(users);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Create a new user
   * POST /api/users
   */
  create = (req: Request, res: Response): void => {
    try {
      const { username, emailId, password, role } = req.body;
      const user = userService.createUser({ username, emailId, password, role });
      res.status(201).json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  addAdmin = (req: Request, res: Response): void => {
    try {
      const { adminEmail, emailId, username, password } = req.body;
      const user = userService.addAdmin(adminEmail, emailId, username, password);
      res.status(201).json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Update an existing user
   * PUT /api/users/:id
   */
  update = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = userService.updateUser(Number(id), updates);
      res.status(200).json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Delete a user
   * DELETE /api/users/:id
   */
  delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      userService.deleteUser(Number(id));
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Centralized error handling for user operations
   * Maps service errors to appropriate HTTP status codes
   */
  private handleError(error: any, res: Response): void {
    const errorMessage = error?.message || 'User operation failed.';

    if (errorMessage.includes('required')) {
      res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes('not found')) {
      res.status(404).json({ message: errorMessage });
    } else if (errorMessage.includes('already exists')) {
      res.status(409).json({ message: errorMessage });
    } else if (errorMessage.includes('Only admins')) {
      res.status(403).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: 'Unable to process user request.' });
    }
  }
}

export default new UserController();
