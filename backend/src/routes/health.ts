/**
 * Health Check Route
 * Provides an endpoint to verify API availability
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /health
 * Health check endpoint that returns API status
 * Used for monitoring and load balancer checks
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
