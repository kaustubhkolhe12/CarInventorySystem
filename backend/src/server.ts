/**
 * Server Entry Point
 * Initializes database and starts Express server
 */

import { app } from './app';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

/**
 * Start server after database initialization
 * Ensures database is ready before accepting requests
 */
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚗 Car Inventory API running on http://localhost:${PORT}`);
  });
});
