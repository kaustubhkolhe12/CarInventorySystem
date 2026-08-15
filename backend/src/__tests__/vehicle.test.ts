/**
 * Vehicle API Tests
 * Verifies inventory operations for car dealership management
 */

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('Vehicle inventory API', () => {
  it('ensures the catalog contains at least 25 default vehicles after startup', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .set('x-user-email', 'kaustubhkolhe12@gmail.com');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(25);
  });

  it('seeds 25 default vehicles into the catalog when the database is empty', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .set('x-user-email', 'kaustubhkolhe12@gmail.com');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(25);
  });

  it('stores and returns vehicle image URLs when creating a vehicle', async () => {
    const adminEmail = 'kaustubhkolhe12@gmail.com';

    const createResponse = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Mazda',
        model: 'MX-5',
        category: 'Convertible',
        price: 33000,
        quantity: 4,
        image: 'https://example.com/mazda.jpg',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.image).toBe('https://example.com/mazda.jpg');
  });

  it('adds, lists, searches, updates, purchases, restocks, and deletes vehicles', async () => {
    const adminEmail = 'kaustubhkolhe12@gmail.com';

    const createResponse = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.make).toBe('Toyota');

    const vehicleId = createResponse.body.id;

    const listResponse = await request(app)
      .get('/api/vehicles')
      .set('x-user-email', adminEmail);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.some((vehicle: any) => vehicle.id === vehicleId)).toBe(true);

    const searchResponse = await request(app)
      .get('/api/vehicles/search')
      .query({ make: 'Toyota', category: 'Sedan', minPrice: 20000, maxPrice: 30000 })
      .set('x-user-email', adminEmail);

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.some((vehicle: any) => vehicle.model === 'Corolla')).toBe(true);

    const updateResponse = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('x-user-email', adminEmail)
      .send({ price: 27000, quantity: 4 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.price).toBe(27000);
    expect(updateResponse.body.quantity).toBe(4);

    const purchaseResponse = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('x-user-email', adminEmail)
      .send({ quantity: 2 });

    expect(purchaseResponse.status).toBe(200);
    expect(purchaseResponse.body.quantity).toBe(2);

    const restockResponse = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('x-user-email', adminEmail)
      .send({ quantity: 3 });

    expect(restockResponse.status).toBe(200);
    expect(restockResponse.body.quantity).toBe(5);

    const deleteResponse = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('x-user-email', adminEmail);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Vehicle deleted successfully');
  });
});
