/**
 * User Management API Tests
 * Tests user CRUD operations and search functionality
 */

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('Car dealership inventory API', () => {
  /**
   * Test: User creation and email search
   * Verifies users can be created and searched by email keyword
   */
  it('registers a user and fetches by email keyword', async () => {
    const email = `kaustubh-${Date.now()}@gmail.com`;
    const payload = {
      username: 'kaustubh',
      emailId: email,
      password: 'secret123',
    };

    // Create user
    const createResponse = await request(app).post('/api/users').send(payload);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.username).toBe('kaustubh');

    // Search by email keyword
    const searchResponse = await request(app).get('/api/users/email/gmail');
    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.some((user: any) => user.emailId === email)).toBe(true);
  });

  /**
   * Test: User update and deletion
   * Verifies users can be updated and deleted successfully
   */
  it('updates and deletes a user record', async () => {
    const email = `user2-${Date.now()}@yahoo.com`;
    
    // Create user
    const createResponse = await request(app)
      .post('/api/users')
      .send({
        username: 'user2',
        emailId: email,
        password: 'pass456',
      });

    const id = createResponse.body.id;

    // Update user
    const updateResponse = await request(app)
      .put(`/api/users/${id}`)
      .send({ username: 'user2-updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.username).toBe('user2-updated');

    // Delete user
    const deleteResponse = await request(app).delete(`/api/users/${id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('User deleted successfully');
  });
});
