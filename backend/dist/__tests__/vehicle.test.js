"use strict";
/**
 * Vehicle API Tests
 * Verifies inventory operations for car dealership management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../app");
(0, vitest_1.describe)('Vehicle inventory API', () => {
    (0, vitest_1.it)('ensures the catalog contains at least 25 default vehicles after startup', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/vehicles')
            .set('x-user-email', 'kaustubhkolhe12@gmail.com');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.length).toBeGreaterThanOrEqual(25);
    });
    (0, vitest_1.it)('seeds 25 default vehicles into the catalog when the database is empty', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get('/api/vehicles')
            .set('x-user-email', 'kaustubhkolhe12@gmail.com');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.length).toBeGreaterThanOrEqual(25);
    });
    (0, vitest_1.it)('stores and returns vehicle image URLs when creating a vehicle', async () => {
        const adminEmail = 'kaustubhkolhe12@gmail.com';
        const createResponse = await (0, supertest_1.default)(app_1.app)
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
        (0, vitest_1.expect)(createResponse.status).toBe(201);
        (0, vitest_1.expect)(createResponse.body.image).toBe('https://example.com/mazda.jpg');
    });
    (0, vitest_1.it)('adds, lists, searches, updates, purchases, restocks, and deletes vehicles', async () => {
        const adminEmail = 'kaustubhkolhe12@gmail.com';
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/api/vehicles')
            .set('x-user-email', adminEmail)
            .send({
            make: 'Toyota',
            model: 'Corolla',
            category: 'Sedan',
            price: 25000,
            quantity: 5,
        });
        (0, vitest_1.expect)(createResponse.status).toBe(201);
        (0, vitest_1.expect)(createResponse.body.make).toBe('Toyota');
        const vehicleId = createResponse.body.id;
        const listResponse = await (0, supertest_1.default)(app_1.app)
            .get('/api/vehicles')
            .set('x-user-email', adminEmail);
        (0, vitest_1.expect)(listResponse.status).toBe(200);
        (0, vitest_1.expect)(listResponse.body.some((vehicle) => vehicle.id === vehicleId)).toBe(true);
        const searchResponse = await (0, supertest_1.default)(app_1.app)
            .get('/api/vehicles/search')
            .query({ make: 'Toyota', category: 'Sedan', minPrice: 20000, maxPrice: 30000 })
            .set('x-user-email', adminEmail);
        (0, vitest_1.expect)(searchResponse.status).toBe(200);
        (0, vitest_1.expect)(searchResponse.body.some((vehicle) => vehicle.model === 'Corolla')).toBe(true);
        const updateResponse = await (0, supertest_1.default)(app_1.app)
            .put(`/api/vehicles/${vehicleId}`)
            .set('x-user-email', adminEmail)
            .send({ price: 27000, quantity: 4 });
        (0, vitest_1.expect)(updateResponse.status).toBe(200);
        (0, vitest_1.expect)(updateResponse.body.price).toBe(27000);
        (0, vitest_1.expect)(updateResponse.body.quantity).toBe(4);
        const purchaseResponse = await (0, supertest_1.default)(app_1.app)
            .post(`/api/vehicles/${vehicleId}/purchase`)
            .set('x-user-email', adminEmail)
            .send({ quantity: 2 });
        (0, vitest_1.expect)(purchaseResponse.status).toBe(200);
        (0, vitest_1.expect)(purchaseResponse.body.quantity).toBe(2);
        const restockResponse = await (0, supertest_1.default)(app_1.app)
            .post(`/api/vehicles/${vehicleId}/restock`)
            .set('x-user-email', adminEmail)
            .send({ quantity: 3 });
        (0, vitest_1.expect)(restockResponse.status).toBe(200);
        (0, vitest_1.expect)(restockResponse.body.quantity).toBe(5);
        const deleteResponse = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/vehicles/${vehicleId}`)
            .set('x-user-email', adminEmail);
        (0, vitest_1.expect)(deleteResponse.status).toBe(200);
        (0, vitest_1.expect)(deleteResponse.body.message).toBe('Vehicle deleted successfully');
    });
});
