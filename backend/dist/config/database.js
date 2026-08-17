"use strict";
/**
 * Database Configuration
 * Initializes and exports the SQLite database instance
 * Handles both file-backed (production) and in-memory (testing) databases
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_sqlite_1 = require("node:sqlite");
/**
 * Determine if running in test environment
 * Uses multiple env checks for compatibility with different test runners
 */
const isTestEnvironment = Boolean(process.env.NODE_ENV === 'test' ||
    process.env.VITEST ||
    process.env.VITEST_WORKER_ID);
// Database file path for production
const dbPath = path_1.default.join(__dirname, '..', '..', 'data', 'car_inventory.db');
// Create directory if not in test environment
if (!isTestEnvironment) {
    fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
}
// Initialize SQLite connection (in-memory for tests, file-backed for production)
const connection = new node_sqlite_1.DatabaseSync(isTestEnvironment ? ':memory:' : dbPath);
/**
 * Initialize database tables
 * Creates the users table with required schema
 */
const initializeDatabase = async () => {
    connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      emailId TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );
  `);
    const columns = connection.prepare('PRAGMA table_info(users)').all();
    const hasRoleColumn = columns.some((column) => column.name === 'role');
    if (!hasRoleColumn) {
        connection.exec('ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT "user";');
    }
    const insertDefaultAdmin = connection.prepare('INSERT OR IGNORE INTO users (username, emailId, password, role) VALUES (?, ?, ?, ?)');
    insertDefaultAdmin.run('Admin', 'kaustubhkolhe12@gmail.com', 'Admin@123', 'admin');
    connection.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      image TEXT
    );
  `);
    const vehicleColumns = connection.prepare('PRAGMA table_info(vehicles)').all();
    const hasImageColumn = vehicleColumns.some((column) => column.name === 'image');
    if (!hasImageColumn) {
        connection.exec('ALTER TABLE vehicles ADD COLUMN image TEXT;');
    }
    const defaultVehicles = [
        ['Toyota', 'Corolla', 'Sedan', 24999, 7],
        ['Honda', 'Civic', 'Sedan', 26999, 5],
    ];
    const vehicleCount = connection.prepare('SELECT COUNT(*) as count FROM vehicles').get();
    if (vehicleCount.count === 0) {
        const insertVehicle = connection.prepare('INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)');
        defaultVehicles.forEach(([make, model, category, price, quantity]) => {
            insertVehicle.run(make, model, category, price, quantity);
        });
    }
    return connection;
};
exports.initializeDatabase = initializeDatabase;
/**
 * Normalize SQL parameters for type safety
 * Ensures parameters are properly typed for SQLite
 */
const normalizeSqlParams = (params = []) => params;
/**
 * Prepare a SQL statement for execution
 * Returns an object with get, all, and run methods
 */
const prepare = (sql) => {
    const statement = connection.prepare(sql);
    return {
        /**
         * Execute query and return first result
         * @param params - Query parameters
         * @returns Single row result or undefined
         */
        get(...params) {
            return statement.get(...normalizeSqlParams(params));
        },
        /**
         * Execute query and return all results
         * @param params - Query parameters
         * @returns Array of rows
         */
        all(...params) {
            return statement.all(...normalizeSqlParams(params));
        },
        /**
         * Execute INSERT/UPDATE/DELETE query
         * @param params - Query parameters
         * @returns Result object with changes count and lastInsertRowid
         */
        run(...params) {
            const result = statement.run(...normalizeSqlParams(params));
            const lastInsertRowid = Number(result.lastInsertRowid ?? 0);
            return {
                changes: result.changes ?? 0,
                lastInsertRowid,
            };
        },
    };
};
/**
 * Database interface for application use
 * Provides type-safe database operations
 */
const db = {
    /**
     * Prepare a statement for execution
     * @param sql - SQL query string
     * @returns Prepared statement object
     */
    prepare,
    /**
     * Execute a query without preparing
     * @param sql - SQL query string
     * @param params - Query parameters
     * @returns Result object
     */
    run(sql, ...params) {
        const statement = connection.prepare(sql);
        const result = statement.run(...normalizeSqlParams(params));
        return {
            changes: result.changes ?? 0,
            lastInsertRowid: Number(result.lastInsertRowid ?? 0),
        };
    },
    /**
     * Get a single row from database
     * @param sql - SQL query string
     * @param params - Query parameters
     * @returns Single row or undefined
     */
    get(sql, ...params) {
        const statement = connection.prepare(sql);
        return statement.get(...normalizeSqlParams(params));
    },
    /**
     * Get multiple rows from database
     * @param sql - SQL query string
     * @param params - Query parameters
     * @returns Array of rows
     */
    all(sql, ...params) {
        const statement = connection.prepare(sql);
        return statement.all(...normalizeSqlParams(params));
    },
};
exports.db = db;
// Initialize database on module load
initializeDatabase();
exports.default = db;
