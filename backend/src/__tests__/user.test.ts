/**
 * User Management API Tests
 * Tests user CRUD operations and search functionality
 */

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';
import { generateToken } from '../utils/jwtUtils';

const adminUser = {
  id: 1,
  emailId: 'kaustubhkolhe12@gmail.com',
  role: 'admin' as const,
};

// Helper to get authorization header with JWT token
const getAuthHeader = () => {
  const token = generateToken(adminUser);
  return `Bearer ${token}`;
};

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

    // Create user (requires auth)
    const createResponse = await request(app)
      .post('/api/users')
      .set('Authorization', getAuthHeader())
      .send(payload);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.username).toBe('kaustubh');

    // Search by email keyword (requires auth)
    const searchResponse = await request(app)
      .get('/api/users/email/gmail')
      .set('Authorization', getAuthHeader());
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
      .set('Authorization', getAuthHeader())
      .send({
        username: 'user2',
        emailId: email,
        password: 'pass456',
      });

    const id = createResponse.body.id;

    // Update user
    const updateResponse = await request(app)
      .put(`/api/users/${id}`)
      .set('Authorization', getAuthHeader())
      .send({ username: 'user2-updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.username).toBe('user2-updated');

    // Delete user
    const deleteResponse = await request(app)
      .delete(`/api/users/${id}`)
      .set('Authorization', getAuthHeader());
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('User deleted successfully');
  });

  it('allows the admin account to add another admin by email', async () => {
    const newAdminEmail = `admin-${Date.now()}@dealership.com`;

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new-admin-user',
        emailId: newAdminEmail,
        password: 'secure-pass',
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(app)
      .post('/api/users/admin')
      .set('Authorization', getAuthHeader())
      .send({
        adminEmail: adminUser.emailId,
        emailId: newAdminEmail,
        username: 'new-admin-user',
      });

    expect(response.status).toBe(201);
    expect(response.body.role).toBe('admin');
    expect(response.body.emailId).toBe(newAdminEmail);
  });
});
