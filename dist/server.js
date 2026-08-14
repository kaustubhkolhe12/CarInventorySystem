"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./database");
const PORT = process.env.PORT || 3000;
(0, database_1.initializeDatabase)().then(() => {
    app_1.app.listen(PORT, () => {
        console.log(`Car inventory API running on http://localhost:${PORT}`);
    });
});
