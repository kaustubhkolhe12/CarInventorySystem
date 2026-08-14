"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../app");
(0, vitest_1.describe)('Car dealership inventory API', () => {
    (0, vitest_1.it)('registers a user and fetches by email keyword', async () => {
        const email = `kaustubh-${Date.now()}@gmail.com`;
        const payload = {
            username: 'kaustubh',
            emailId: email,
            password: 'secret123',
        };
        const createResponse = await (0, supertest_1.default)(app_1.app).post('/api/users').send(payload);
        (0, vitest_1.expect)(createResponse.status).toBe(201);
        (0, vitest_1.expect)(createResponse.body.username).toBe('kaustubh');
        const searchResponse = await (0, supertest_1.default)(app_1.app).get('/api/users/email/gmail');
        (0, vitest_1.expect)(searchResponse.status).toBe(200);
        (0, vitest_1.expect)(searchResponse.body.some((user) => user.emailId === email)).toBe(true);
    });
    (0, vitest_1.it)('updates and deletes a user record', async () => {
        const email = `user2-${Date.now()}@yahoo.com`;
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/api/users')
            .send({
            username: 'user2',
            emailId: email,
            password: 'pass456',
        });
        const id = createResponse.body.id;
        const updateResponse = await (0, supertest_1.default)(app_1.app)
            .put(`/api/users/${id}`)
            .send({ username: 'user2-updated' });
        (0, vitest_1.expect)(updateResponse.status).toBe(200);
        (0, vitest_1.expect)(updateResponse.body.username).toBe('user2-updated');
        const deleteResponse = await (0, supertest_1.default)(app_1.app).delete(`/api/users/${id}`);
        (0, vitest_1.expect)(deleteResponse.status).toBe(200);
        (0, vitest_1.expect)(deleteResponse.body.message).toBe('User deleted successfully');
    });
});
