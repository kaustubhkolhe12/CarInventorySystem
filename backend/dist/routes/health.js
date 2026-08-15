"use strict";
/**
 * Health Check Route
 * Provides an endpoint to verify API availability
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * GET /health
 * Health check endpoint that returns API status
 * Used for monitoring and load balancer checks
 */
router.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = router;
