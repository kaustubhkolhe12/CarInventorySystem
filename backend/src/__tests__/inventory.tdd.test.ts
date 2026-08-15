import request from 'supertest';
import { describe, expect, it, beforeEach } from 'vitest';
import { app } from '../app';
import db from '../config/database';

const adminEmail = 'kaustubhkolhe12@gmail.com';

describe('TDD inventory backend behaviors', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM vehicles').run();
  });

  it('rejects vehicle creation without required fields', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'BMW',
        model: 'X5',
        category: 'SUV',
        price: 0,
        quantity: 2,
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Unable to process vehicle request.');
  });

  it('creates a vehicle and persists its image url', async () => {
    const imageUrl = 'https://example.com/images/bmw-x5.jpg';

    const response = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'BMW',
        model: 'X5',
        category: 'SUV',
        price: 65000,
        quantity: 3,
        image: imageUrl,
      });

    expect(response.status).toBe(201);
    expect(response.body.make).toBe('BMW');
    expect(response.body.image).toBe(imageUrl);
  });

  it('lists all vehicles in descending order of creation', async () => {
    await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Audi',
        model: 'A4',
        category: 'Luxury',
        price: 42000,
        quantity: 4,
      });

    await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Mercedes',
        model: 'C-Class',
        category: 'Luxury',
        price: 48000,
        quantity: 2,
      });

    const response = await request(app)
      .get('/api/vehicles')
      .set('x-user-email', adminEmail);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].make).toBe('Mercedes');
    expect(response.body[1].make).toBe('Audi');
  });

  it('updates stock quantity and records the new total after purchase', async () => {
    const createResponse = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Tesla',
        model: 'Model 3',
        category: 'Electric',
        price: 45000,
        quantity: 5,
      });

    const purchaseResponse = await request(app)
      .post(`/api/vehicles/${createResponse.body.id}/purchase`)
      .set('x-user-email', adminEmail)
      .send({ quantity: 2 });

    expect(purchaseResponse.status).toBe(200);
    expect(purchaseResponse.body.quantity).toBe(3);
  });

  it('prevents purchase beyond available stock', async () => {
    const createResponse = await request(app)
      .post('/api/vehicles')
      .set('x-user-email', adminEmail)
      .send({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 26000,
        quantity: 1,
      });

    const response = await request(app)
      .post(`/api/vehicles/${createResponse.body.id}/purchase`)
      .set('x-user-email', adminEmail)
      .send({ quantity: 2 });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Requested quantity exceeds available stock.');
  });
});
