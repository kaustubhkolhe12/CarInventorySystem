/**
 * Vehicle-related type definitions
 */

export type VehicleCategory = 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Convertible' | 'Luxury' | 'Other';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleCreateInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleUpdateInput {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
