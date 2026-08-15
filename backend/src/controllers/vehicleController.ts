/**
 * Vehicle Controller
 * Handles HTTP requests for vehicle inventory operations
 */

import { Request, Response } from 'express';
import vehicleService from '../services/vehicleService';

class VehicleController {
  getAll = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
      vehicleService.getAllVehicles();
      if (!userEmail) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }
      res.status(200).json(vehicleService.getAllVehicles());
    } catch (error) {
      this.handleError(error, res);
    }
  };

  search = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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

  create = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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

  update = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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

  delete = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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

  purchase = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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

  restock = (req: Request, res: Response): void => {
    try {
      const userEmail = req.headers['x-user-email'] as string | undefined;
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
