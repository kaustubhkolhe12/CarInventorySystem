"use strict";
/**
 * Vehicle Controller
 * Handles HTTP requests for vehicle inventory operations
 * Uses JWT authentication via middleware
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vehicleService_1 = __importDefault(require("../services/vehicleService"));
class VehicleController {
    constructor() {
        this.getAll = (req, res) => {
            try {
                // User email from JWT token (verified by middleware)
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                res.status(200).json(vehicleService_1.default.getAllVehicles());
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.search = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const vehicles = vehicleService_1.default.searchVehicles({
                    make: req.query.make,
                    model: req.query.model,
                    category: req.query.category,
                    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                });
                res.status(200).json(vehicles);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.create = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const vehicle = vehicleService_1.default.createVehicle(userEmail, req.body);
                res.status(201).json(vehicle);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.update = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const { id } = req.params;
                const vehicle = vehicleService_1.default.updateVehicle(userEmail, Number(id), req.body);
                res.status(200).json(vehicle);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.delete = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const { id } = req.params;
                vehicleService_1.default.deleteVehicle(userEmail, Number(id));
                res.status(200).json({ message: 'Vehicle deleted successfully' });
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.purchase = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const { id } = req.params;
                const { quantity } = req.body;
                const vehicle = vehicleService_1.default.purchaseVehicle(userEmail, Number(id), quantity);
                res.status(200).json(vehicle);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
        this.restock = (req, res) => {
            try {
                const userEmail = req.user?.emailId;
                if (!userEmail) {
                    res.status(401).json({ message: 'User authentication required.' });
                    return;
                }
                const { id } = req.params;
                const { quantity } = req.body;
                const vehicle = vehicleService_1.default.restockVehicle(userEmail, Number(id), quantity);
                res.status(200).json(vehicle);
            }
            catch (error) {
                this.handleError(error, res);
            }
        };
    }
    handleError(error, res) {
        const errorMessage = error?.message || 'Vehicle operation failed.';
        if (errorMessage.includes('required')) {
            res.status(400).json({ message: errorMessage });
        }
        else if (errorMessage.includes('not found')) {
            res.status(404).json({ message: errorMessage });
        }
        else if (errorMessage.includes('Only admins')) {
            res.status(403).json({ message: errorMessage });
        }
        else if (errorMessage.includes('exceeds available stock')) {
            res.status(409).json({ message: errorMessage });
        }
        else {
            res.status(500).json({ message: 'Unable to process vehicle request.' });
        }
    }
}
exports.default = new VehicleController();
