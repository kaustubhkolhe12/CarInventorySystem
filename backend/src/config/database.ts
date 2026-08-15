/**
 * Database Configuration
 * Initializes and exports the SQLite database instance
 * Handles both file-backed (production) and in-memory (testing) databases
 */

import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

/**
 * Determine if running in test environment
 * Uses multiple env checks for compatibility with different test runners
 */
const isTestEnvironment = Boolean(
  process.env.NODE_ENV === 'test' ||
  process.env.VITEST ||
  process.env.VITEST_WORKER_ID
);

// Database file path for production
const dbPath = path.join(__dirname, '..', '..', 'data', 'car_inventory.db');

// Create directory if not in test environment
if (!isTestEnvironment) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialize SQLite connection (in-memory for tests, file-backed for production)
const connection = new DatabaseSync(isTestEnvironment ? ':memory:' : dbPath);

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

  const columns = connection.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
  const hasRoleColumn = columns.some((column) => column.name === 'role');

  if (!hasRoleColumn) {
    connection.exec('ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT "user";');
  }

  const insertDefaultAdmin = connection.prepare(
    'INSERT OR IGNORE INTO users (username, emailId, password, role) VALUES (?, ?, ?, ?)'
  );
  insertDefaultAdmin.run('Admin', 'kaustubhkolhe12@gmail.com', 'Admin@123', 'admin');

  return connection;
};

/**
 * Normalize SQL parameters for type safety
 * Ensures parameters are properly typed for SQLite
 */
const normalizeSqlParams = (params: unknown[] = []) => params as any[];

/**
 * Prepare a SQL statement for execution
 * Returns an object with get, all, and run methods
 */
const prepare = (sql: string) => {
  const statement = connection.prepare(sql);

  return {
    /**
     * Execute query and return first result
     * @param params - Query parameters
     * @returns Single row result or undefined
     */
    get(...params: unknown[]) {
      return statement.get(...normalizeSqlParams(params));
    },

    /**
     * Execute query and return all results
     * @param params - Query parameters
     * @returns Array of rows
     */
    all(...params: unknown[]) {
      return statement.all(...normalizeSqlParams(params));
    },

    /**
     * Execute INSERT/UPDATE/DELETE query
     * @param params - Query parameters
     * @returns Result object with changes count and lastInsertRowid
     */
    run(...params: unknown[]) {
      const result = statement.run(...normalizeSqlParams(params)) as {
        changes: number;
        lastInsertRowid: number | bigint;
      };

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
  run(sql: string, ...params: unknown[]) {
    const statement = connection.prepare(sql);
    const result = statement.run(...normalizeSqlParams(params)) as {
      changes: number;
      lastInsertRowid: number | bigint;
    };

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
  get<T>(sql: string, ...params: unknown[]) {
    const statement = connection.prepare(sql);
    return statement.get(...normalizeSqlParams(params)) as T | undefined;
  },

  /**
   * Get multiple rows from database
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Array of rows
   */
  all<T>(sql: string, ...params: unknown[]) {
    const statement = connection.prepare(sql);
    return statement.all(...normalizeSqlParams(params)) as T[];
  },
};

// Initialize database on module load
initializeDatabase();

export { db, initializeDatabase };
export default db;
