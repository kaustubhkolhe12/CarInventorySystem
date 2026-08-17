/**
 * Vehicle Controller
 * Handles HTTP requests for vehicle inventory operations
 * Uses JWT authentication via middleware
 */

import { Response } from 'express';
import vehicleService from '../services/vehicleService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

class VehicleController {
  getAll = (req: AuthenticatedRequest, res: Response): void => {
    try {
      // User email from JWT token (verified by middleware)
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }
      res.status(200).json(vehicleService.getAllVehicles());
    } catch (error) {
      this.handleError(error, res);
    }
  };

  search = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const vehicles = vehicleService.searchVehicles({
        make: req.query.make as string | undefined,
        model: req.query.model as string | undefined,
        category: req.query.category as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      });

      res.status(200).json(vehicles);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  create = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const vehicle = vehicleService.createVehicle(userEmail, req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  update = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const { id } = req.params;
      const vehicle = vehicleService.updateVehicle(userEmail, Number(id), req.body);
      res.status(200).json(vehicle);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  delete = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const { id } = req.params;
      vehicleService.deleteVehicle(userEmail, Number(id));
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  purchase = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const { id } = req.params;
      const { quantity } = req.body;
      const vehicle = vehicleService.purchaseVehicle(userEmail, Number(id), quantity);
      res.status(200).json(vehicle);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  restock = (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userEmail = req.user?.emailId;
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      const { id } = req.params;
      const { quantity } = req.body;
      const vehicle = vehicleService.restockVehicle(userEmail, Number(id), quantity);
      res.status(200).json(vehicle);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: any, res: Response): void {
    const errorMessage = error?.message || 'Vehicle operation failed.';

    if (errorMessage.includes('required')) {
      res.status(400).json({ message: errorMessage });
    } else if (errorMessage.includes('not found')) {
      res.status(404).json({ message: errorMessage });
    } else if (errorMessage.includes('Only admins')) {
      res.status(403).json({ message: errorMessage });
    } else if (errorMessage.includes('exceeds available stock')) {
      res.status(409).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: 'Unable to process vehicle request.' });
    }
  }
}

export default new VehicleController();
