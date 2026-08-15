/**
 * Vehicle API types for frontend inventory UI
 */

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface VehicleFormState {
  make: string;
  model: string;
  category: string;
  price: number | string;
  quantity: number | string;
  image?: string;
}

export interface VehicleFilters {
  search?: string;
  category?: string;
  maxPrice?: number;
}
