/**
 * Vehicle API service for frontend dashboard interactions
 */

import type { Vehicle, VehicleFormState } from '../types/vehicle';

const API_URL = 'http://localhost:3000/api/vehicles';

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Server returned an empty response.');
  }

  throw new Error(text.slice(0, 200));
};

const getUserEmail = () => {
  const stored = localStorage.getItem('car_dealership_user');
  if (!stored) return '';

  try {
    const user = JSON.parse(stored);
    return user?.emailId || '';
  } catch {
    return '';
  }
};

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Failed to fetch vehicles');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch vehicles');
    }
  }

  return parseJsonResponse<Vehicle[]>(response);
};

export const searchVehicles = async (params: Record<string, string | number | undefined>): Promise<Vehicle[]> => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  const response = await fetch(`${API_URL}/search?${query.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Search failed');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
  }

  return parseJsonResponse<Vehicle[]>(response);
};

export const createVehicle = async (payload: VehicleFormState): Promise<Vehicle> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
    body: JSON.stringify({
      make: payload.make,
      model: payload.model,
      category: payload.category,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
      image: payload.image || getVehicleImage(payload.make, payload.model),
    }),
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Failed to create vehicle');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create vehicle');
    }
  }

  return parseJsonResponse<Vehicle>(response);
};

export const updateVehicle = async (id: number, payload: VehicleFormState): Promise<Vehicle> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
    body: JSON.stringify({
      make: payload.make,
      model: payload.model,
      category: payload.category,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
      image: payload.image || getVehicleImage(payload.make, payload.model),
    }),
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Failed to update vehicle');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update vehicle');
    }
  }

  return parseJsonResponse<Vehicle>(response);
};

export const deleteVehicle = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Failed to delete vehicle');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete vehicle');
    }
  }
};

export const purchaseVehicle = async (id: number, quantity: number): Promise<Vehicle> => {
  const response = await fetch(`${API_URL}/${id}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Purchase failed');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Purchase failed');
    }
  }

  return parseJsonResponse<Vehicle>(response);
};

export const restockVehicle = async (id: number, quantity: number): Promise<Vehicle> => {
  const response = await fetch(`${API_URL}/${id}/restock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': getUserEmail(),
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    try {
      const error = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(error.message || 'Restock failed');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Restock failed');
    }
  }

  return parseJsonResponse<Vehicle>(response);
};

const carImageLibrary = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80',
];

const getVehicleImage = (make: string, model: string) => {
  const key = `${make}${model}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return carImageLibrary[key % carImageLibrary.length];
};
