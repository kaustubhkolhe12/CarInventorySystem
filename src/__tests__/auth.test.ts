import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('Authentication API', () => {
  it('registers a user and logs in with the stored credentials', async () => {
    const email = `auth-${Date.now()}@dealership.com`;
    const user = {
      username: 'dealer',
      emailId: email,
      password: 'password123',
    };

    const registerResponse = await request(app).post('/api/auth/register').send(user);
    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/api/auth/login').send({
      emailId: email,
      password: 'password123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.emailId).toBe(email);
  });

  it('returns not registered message for unknown email login', async () => {
    const response = await request(app).post('/api/auth/login').send({
      emailId: `unknown-${Date.now()}@example.com`,
      password: 'anypass',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not registered. Please register first.');
  });

  it('returns incorrect password message for valid email with wrong password', async () => {
    const email = `wrong-pass-${Date.now()}@dealership.com`;
    await request(app).post('/api/auth/register').send({
      username: 'wrong-user',
      emailId: email,
      password: 'correctpass',
    });

    const response = await request(app).post('/api/auth/login').send({
      emailId: email,
      password: 'wrongpass',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect password. Please try again.');
  });
});
