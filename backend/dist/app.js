"use strict";
/**
 * Express Application Setup
 * Configures middleware and mounts routes
 * Implements proper separation of concerns
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_1 = __importDefault(require("./routes/health"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const app = (0, express_1.default)();
exports.app = app;
// Middleware Configuration
// Enable CORS for cross-origin requests from frontend
app.use((0, cors_1.default)());
// Parse incoming JSON requests with a larger limit for base64 image uploads
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Route Mounting
// Health check endpoint for monitoring
app.use('/health', health_1.default);
// Authentication endpoints (login, register)
app.use('/api/auth', auth_1.default);
// User management endpoints (CRUD operations)
app.use('/api/users', users_1.default);
// Vehicle inventory endpoints
app.use('/api/vehicles', vehicles_1.default);
