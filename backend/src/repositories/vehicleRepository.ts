/**
 * Vehicle Repository
 * Handles all database operations related to vehicles
 * Implements atomic purchases to prevent race conditions
 */

import db from '../config/database';
import type { Vehicle, VehicleCreateInput, VehicleUpdateInput, VehicleSearchParams } from '../types/vehicle';

class VehicleRepository {
  findAll(): Vehicle[] {
    return db.all<Vehicle>('SELECT * FROM vehicles ORDER BY id DESC');
  }

  findById(id: number): Vehicle | undefined {
    return db.get<Vehicle>('SELECT * FROM vehicles WHERE id = ?', id);
  }

  search(params: VehicleSearchParams): Vehicle[] {
    const conditions: string[] = [];
    const values: unknown[] = [];

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

    return db.all<Vehicle>(sql, ...values);
  }

  create(vehicleData: VehicleCreateInput): Vehicle {
    const { make, model, category, price, quantity, image } = vehicleData;
    const result = db.run(
      'INSERT INTO vehicles (make, model, category, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)',
      make,
      model,
      category,
      Number(price),
      Number(quantity),
      image ?? null
    );

    const createdVehicle = this.findById(result.lastInsertRowid);
    if (!createdVehicle) {
      throw new Error('Failed to create vehicle');
    }

    return createdVehicle;
  }

  update(id: number, updates: VehicleUpdateInput): Vehicle {
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

    const result = db.run(
      'UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ?, image = ? WHERE id = ?',
      updatedMake,
      updatedModel,
      updatedCategory,
      Number(updatedPrice),
      Number(updatedQuantity),
      updatedImage,
      id
    );

    if (result.changes === 0) {
      throw new Error('Failed to update vehicle');
    }

    const updatedVehicle = this.findById(id);
    if (!updatedVehicle) {
      throw new Error('Vehicle not found after update');
    }

    return updatedVehicle;
  }

  delete(id: number): number {
    const result = db.run('DELETE FROM vehicles WHERE id = ?', id);
    return result.changes;
  }

  /**
   * Atomically purchase a vehicle by decrementing quantity
   * This prevents race conditions where two purchases could happen simultaneously
   * The UPDATE only succeeds if quantity >= requestedQuantity
   * 
   * @param id - Vehicle ID
   * @param quantity - Quantity to purchase
   * @returns Updated vehicle if successful
   * @throws Error if insufficient stock
   */
  purchaseAtomic(id: number, quantity: number): Vehicle {
    // Atomic UPDATE: Only decrement if quantity is sufficient
    // This ensures no two users can oversell the same vehicle
    const result = db.run(
      `UPDATE vehicles 
       SET quantity = quantity - ? 
       WHERE id = ? AND quantity >= ?`,
      Number(quantity),
      id,
      Number(quantity)
    );

    // If changes == 0, either vehicle not found or insufficient stock
    if (result.changes === 0) {
      const vehicle = this.findById(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      // Vehicle exists but stock insufficient
      throw new Error(`Requested quantity exceeds available stock. Available: ${vehicle.quantity}, Requested: ${quantity}`);
    }

    const updatedVehicle = this.findById(id);
    if (!updatedVehicle) {
      throw new Error('Vehicle not found after purchase');
    }

    return updatedVehicle;
  }

  /**
   * Atomically restock a vehicle by incrementing quantity
   * 
   * @param id - Vehicle ID
   * @param quantity - Quantity to add to stock
   * @returns Updated vehicle
   * @throws Error if vehicle not found
   */
  restockAtomic(id: number, quantity: number): Vehicle {
    // Atomic UPDATE: Increment quantity
    const result = db.run(
      `UPDATE vehicles 
       SET quantity = quantity + ? 
       WHERE id = ?`,
      Number(quantity),
      id
    );

    if (result.changes === 0) {
      throw new Error('Vehicle not found');
    }

    const updatedVehicle = this.findById(id);
    if (!updatedVehicle) {
      throw new Error('Vehicle not found after restock');
    }

    return updatedVehicle;
  }
}

export default new VehicleRepository();
