/**
 * Express Application Setup
 * Configures middleware and mounts routes
 * Implements proper separation of concerns with JWT authentication
 */

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';
import { verifyToken } from './middleware/authMiddleware';

const app = express();

// Middleware Configuration
// Enable CORS for cross-origin requests from frontend
// In production, restrict to specific domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse incoming JSON requests with a larger limit for base64 image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Route Mounting
// Health check endpoint for monitoring (no auth required)
app.use('/health', healthRoutes);

// Authentication endpoints (login, register - no auth required)
app.use('/api/auth', authRoutes);

// All routes below require JWT authentication
app.use(verifyToken);

// User management endpoints (CRUD operations)
app.use('/api/users', userRoutes);

// Vehicle inventory endpoints
app.use('/api/vehicles', vehicleRoutes);

export { app };
