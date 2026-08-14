"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../app");
(0, vitest_1.describe)('Authentication API', () => {
    (0, vitest_1.it)('registers a user and logs in with the stored credentials', async () => {
        const email = `auth-${Date.now()}@dealership.com`;
        const user = {
            username: 'dealer',
            emailId: email,
            password: 'password123',
        };
        const registerResponse = await (0, supertest_1.default)(app_1.app).post('/api/auth/register').send(user);
        (0, vitest_1.expect)(registerResponse.status).toBe(201);
        const loginResponse = await (0, supertest_1.default)(app_1.app).post('/api/auth/login').send({
            emailId: email,
            password: 'password123',
        });
        (0, vitest_1.expect)(loginResponse.status).toBe(200);
        (0, vitest_1.expect)(loginResponse.body.user.emailId).toBe(email);
    });
    (0, vitest_1.it)('returns not registered message for unknown email login', async () => {
        const response = await (0, supertest_1.default)(app_1.app).post('/api/auth/login').send({
            emailId: `unknown-${Date.now()}@example.com`,
            password: 'anypass',
        });
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe('User is not registered. Please register first.');
    });
    (0, vitest_1.it)('returns incorrect password message for valid email with wrong password', async () => {
        const email = `wrong-pass-${Date.now()}@dealership.com`;
        await (0, supertest_1.default)(app_1.app).post('/api/auth/register').send({
            username: 'wrong-user',
            emailId: email,
            password: 'correctpass',
        });
        const response = await (0, supertest_1.default)(app_1.app).post('/api/auth/login').send({
            emailId: email,
            password: 'wrongpass',
        });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe('Incorrect password. Please try again.');
    });
});
