"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../app");
const database_1 = __importDefault(require("../config/database"));
const adminEmail = 'kaustubhkolhe12@gmail.com';
(0, vitest_1.describe)('TDD inventory backend behaviors', () => {
    (0, vitest_1.beforeEach)(() => {
        database_1.default.prepare('DELETE FROM vehicles').run();
    });
    (0, vitest_1.it)('rejects vehicle creation without required fields', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'BMW',
            model: 'X5',
            category: 'SUV',
            price: 0,
            quantity: 2,
        });
        (0, vitest_1.expect)(response.status).toBe(500);
        (0, vitest_1.expect)(response.body.message).toBe('Unable to process vehicle request.');
    });
    (0, vitest_1.it)('creates a vehicle and persists its image url', async () => {
        const imageUrl = 'https://example.com/images/bmw-x5.jpg';
        const response = await (0, supertest_1.default)(app_1.app)
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
        (0, vitest_1.expect)(response.status).toBe(201);
        (0, vitest_1.expect)(response.body.make).toBe('BMW');
        (0, vitest_1.expect)(response.body.image).toBe(imageUrl);
    });
    (0, vitest_1.it)('lists all vehicles in descending order of creation', async () => {
        await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'Audi',
            model: 'A4',
            category: 'Luxury',
            price: 42000,
            quantity: 4,
        });
        await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'Mercedes',
            model: 'C-Class',
            category: 'Luxury',
            price: 48000,
            quantity: 2,
        });
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/vehicles')
            .set('x-user-email', adminEmail);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.length).toBe(2);
        (0, vitest_1.expect)(response.body[0].make).toBe('Mercedes');
        (0, vitest_1.expect)(response.body[1].make).toBe('Audi');
    });
    (0, vitest_1.it)('updates stock quantity and records the new total after purchase', async () => {
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'Tesla',
            model: 'Model 3',
            category: 'Electric',
            price: 45000,
            quantity: 5,
        });
        const purchaseResponse = await (0, supertest_1.default)(app_1.app)
            .post(`/api/vehicles/${createResponse.body.id}/purchase`)
            .set('x-user-email', adminEmail)
            .send({ quantity: 2 });
        (0, vitest_1.expect)(purchaseResponse.status).toBe(200);
        (0, vitest_1.expect)(purchaseResponse.body.quantity).toBe(3);
    });
    (0, vitest_1.it)('prevents purchase beyond available stock', async () => {
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'Honda',
            model: 'Civic',
            category: 'Sedan',
            price: 26000,
            quantity: 1,
        });
        const response = await (0, supertest_1.default)(app_1.app)
            .post(`/api/vehicles/${createResponse.body.id}/purchase`)
            .set('x-user-email', adminEmail)
            .send({ quantity: 2 });
        (0, vitest_1.expect)(response.status).toBe(409);
        (0, vitest_1.expect)(response.body.message).toBe('Requested quantity exceeds available stock.');
    });
});
