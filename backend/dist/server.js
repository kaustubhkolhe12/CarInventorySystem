"use strict";
/**
 * Server Entry Point
 * Initializes database and starts Express server
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const PORT = process.env.PORT || 3000;
/**
 * Start server after database initialization
 * Ensures database is ready before accepting requests
 */
(0, database_1.initializeDatabase)().then(() => {
    app_1.app.listen(PORT, () => {
        console.log(`🚗 Car Inventory API running on http://localhost:${PORT}`);
    });
});
