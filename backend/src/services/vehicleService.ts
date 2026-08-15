/**
 * Vehicle Service
 * Handles vehicle business logic
 */

import vehicleRepository from '../repositories/vehicleRepository';
import userRepository from '../repositories/userRepository';
import type { Vehicle, VehicleCreateInput, VehicleSearchParams, VehicleUpdateInput } from '../types/vehicle';

class VehicleService {
  getAllVehicles(): Vehicle[] {
    return vehicleRepository.findAll();
  }

  getVehicleById(id: number): Vehicle {
    const vehicle = vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  searchVehicles(params: VehicleSearchParams): Vehicle[] {
    return vehicleRepository.search(params);
  }

  createVehicle(userEmail: string, vehicleData: VehicleCreateInput): Vehicle {
    this.ensureAuthorizedUser(userEmail, 'Vehicle creation');

    if (!vehicleData.make || !vehicleData.model || !vehicleData.category || vehicleData.price === undefined || vehicleData.quantity === undefined) {
      throw new Error('Make, model, category, price and quantity are required.');
    }

    if (Number(vehicleData.price) <= 0) {
      throw new Error('Vehicle price must be greater than zero.');
    }

    if (Number(vehicleData.quantity) < 0) {
      throw new Error('Vehicle quantity cannot be negative.');
    }

    return vehicleRepository.create(vehicleData);
  }

  updateVehicle(userEmail: string, id: number, updates: VehicleUpdateInput): Vehicle {
    this.ensureAuthorizedUser(userEmail, 'Vehicle update');

    const existingVehicle = this.getVehicleById(id);
    const nextVehicle = {
      ...existingVehicle,
      ...updates,
      price: updates.price ?? existingVehicle.price,
      quantity: updates.quantity ?? existingVehicle.quantity,
    };

    if (nextVehicle.price <= 0) {
      throw new Error('Vehicle price must be greater than zero.');
    }

    if (nextVehicle.quantity < 0) {
      throw new Error('Vehicle quantity cannot be negative.');
    }

    return vehicleRepository.update(id, updates);
  }

  deleteVehicle(userEmail: string, id: number): boolean {
    this.ensureAdmin(userEmail, 'delete vehicle');

    const result = vehicleRepository.delete(id);
    if (result === 0) {
      throw new Error('Vehicle not found');
    }
    return true;
  }

  purchaseVehicle(userEmail: string, id: number, quantity: number): Vehicle {
    this.ensureAuthorizedUser(userEmail, 'vehicle purchase');

    const vehicle = this.getVehicleById(id);
    const requestedQuantity = Number(quantity);

    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
      throw new Error('Purchase quantity must be greater than zero.');
    }

    if (requestedQuantity > vehicle.quantity) {
      throw new Error('Requested quantity exceeds available stock.');
    }

    return vehicleRepository.update(id, { quantity: vehicle.quantity - requestedQuantity });
  }

  restockVehicle(userEmail: string, id: number, quantity: number): Vehicle {
    this.ensureAdmin(userEmail, 'restock vehicle');

    const vehicle = this.getVehicleById(id);
    const restockQuantity = Number(quantity);

    if (!Number.isFinite(restockQuantity) || restockQuantity <= 0) {
      throw new Error('Restock quantity must be greater than zero.');
    }

    return vehicleRepository.update(id, { quantity: vehicle.quantity + restockQuantity });
  }

  private ensureAuthorizedUser(userEmail: string, action: string): void {
    if (!userEmail) {
      throw new Error(`User email is required to ${action.toLowerCase()}.`);
    }

    const user = userRepository.findByEmail(userEmail);
    if (!user) {
      throw new Error('User not found.');
    }
  }

  private ensureAdmin(userEmail: string, action: string): void {
    this.ensureAuthorizedUser(userEmail, action);

    const user = userRepository.findByEmail(userEmail);
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can perform this action.');
    }
  }
}

export default new VehicleService();
