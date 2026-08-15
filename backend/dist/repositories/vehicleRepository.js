"use strict";
/**
 * Vehicle Repository
 * Handles all database operations related to vehicles
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class VehicleRepository {
    findAll() {
        return database_1.default.all('SELECT * FROM vehicles ORDER BY id DESC');
    }
    findById(id) {
        return database_1.default.get('SELECT * FROM vehicles WHERE id = ?', id);
    }
    search(params) {
        const conditions = [];
        const values = [];
        if (params.make) {
            conditions.push('LOWER(make) LIKE ?');
            values.push(`%${params.make.toLowerCase()}%`);
        }
        if (params.model) {
            conditions.push('LOWER(model) LIKE ?');
            values.push(`%${params.model.toLowerCase()}%`);
        }
        if (params.category) {
            conditions.push('LOWER(category) LIKE ?');
            values.push(`%${params.category.toLowerCase()}%`);
        }
        if (params.minPrice !== undefined) {
            conditions.push('price >= ?');
            values.push(Number(params.minPrice));
        }
        if (params.maxPrice !== undefined) {
            conditions.push('price <= ?');
            values.push(Number(params.maxPrice));
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const sql = `SELECT * FROM vehicles ${whereClause} ORDER BY id DESC`;
        return database_1.default.all(sql, ...values);
    }
    create(vehicleData) {
        const { make, model, category, price, quantity, image } = vehicleData;
        const result = database_1.default.run('INSERT INTO vehicles (make, model, category, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)', make, model, category, Number(price), Number(quantity), image ?? null);
        const createdVehicle = this.findById(result.lastInsertRowid);
        if (!createdVehicle) {
            throw new Error('Failed to create vehicle');
        }
        return createdVehicle;
    }
    update(id, updates) {
        const existingVehicle = this.findById(id);
        if (!existingVehicle) {
            throw new Error('Vehicle not found');
        }
        const updatedMake = updates.make ?? existingVehicle.make;
        const updatedModel = updates.model ?? existingVehicle.model;
        const updatedCategory = updates.category ?? existingVehicle.category;
        const updatedPrice = updates.price ?? existingVehicle.price;
        const updatedQuantity = updates.quantity ?? existingVehicle.quantity;
        const updatedImage = updates.image ?? existingVehicle.image ?? null;
        const result = database_1.default.run('UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ?, image = ? WHERE id = ?', updatedMake, updatedModel, updatedCategory, Number(updatedPrice), Number(updatedQuantity), updatedImage, id);
        if (result.changes === 0) {
            throw new Error('Failed to update vehicle');
        }
        const updatedVehicle = this.findById(id);
        if (!updatedVehicle) {
            throw new Error('Vehicle not found after update');
        }
        return updatedVehicle;
    }
    delete(id) {
        const result = database_1.default.run('DELETE FROM vehicles WHERE id = ?', id);
        return result.changes;
    }
}
exports.default = new VehicleRepository();
