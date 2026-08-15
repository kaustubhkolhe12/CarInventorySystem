/**
 * Express Application Setup
 * Configures middleware and mounts routes
 * Implements proper separation of concerns
 */

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';

const app = express();

// Middleware Configuration
// Enable CORS for cross-origin requests from frontend
app.use(cors());

// Parse incoming JSON requests with a larger limit for base64 image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Route Mounting
// Health check endpoint for monitoring
app.use('/health', healthRoutes);

// Authentication endpoints (login, register)
app.use('/api/auth', authRoutes);

// User management endpoints (CRUD operations)
app.use('/api/users', userRoutes);

// Vehicle inventory endpoints
app.use('/api/vehicles', vehicleRoutes);

export { app };
