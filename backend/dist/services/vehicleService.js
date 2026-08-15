"use strict";
/**
 * Vehicle Service
 * Handles vehicle business logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vehicleRepository_1 = __importDefault(require("../repositories/vehicleRepository"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class VehicleService {
    getAllVehicles() {
        return vehicleRepository_1.default.findAll();
    }
    getVehicleById(id) {
        const vehicle = vehicleRepository_1.default.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }
    searchVehicles(params) {
        return vehicleRepository_1.default.search(params);
    }
    createVehicle(userEmail, vehicleData) {
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
        return vehicleRepository_1.default.create(vehicleData);
    }
    updateVehicle(userEmail, id, updates) {
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
        return vehicleRepository_1.default.update(id, updates);
    }
    deleteVehicle(userEmail, id) {
        this.ensureAdmin(userEmail, 'delete vehicle');
        const result = vehicleRepository_1.default.delete(id);
        if (result === 0) {
            throw new Error('Vehicle not found');
        }
        return true;
    }
    purchaseVehicle(userEmail, id, quantity) {
        this.ensureAuthorizedUser(userEmail, 'vehicle purchase');
        const vehicle = this.getVehicleById(id);
        const requestedQuantity = Number(quantity);
        if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
            throw new Error('Purchase quantity must be greater than zero.');
        }
        if (requestedQuantity > vehicle.quantity) {
            throw new Error('Requested quantity exceeds available stock.');
        }
        return vehicleRepository_1.default.update(id, { quantity: vehicle.quantity - requestedQuantity });
    }
    restockVehicle(userEmail, id, quantity) {
        this.ensureAdmin(userEmail, 'restock vehicle');
        const vehicle = this.getVehicleById(id);
        const restockQuantity = Number(quantity);
        if (!Number.isFinite(restockQuantity) || restockQuantity <= 0) {
            throw new Error('Restock quantity must be greater than zero.');
        }
        return vehicleRepository_1.default.update(id, { quantity: vehicle.quantity + restockQuantity });
    }
    ensureAuthorizedUser(userEmail, action) {
        if (!userEmail) {
            throw new Error(`User email is required to ${action.toLowerCase()}.`);
        }
        const user = userRepository_1.default.findByEmail(userEmail);
        if (!user) {
            throw new Error('User not found.');
        }
    }
    ensureAdmin(userEmail, action) {
        this.ensureAuthorizedUser(userEmail, action);
        const user = userRepository_1.default.findByEmail(userEmail);
        if (!user || user.role !== 'admin') {
            throw new Error('Only admins can perform this action.');
        }
    }
}
exports.default = new VehicleService();
