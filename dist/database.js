"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_sqlite_1 = require("node:sqlite");
const isTestEnvironment = Boolean(process.env.NODE_ENV === 'test' || process.env.VITEST || process.env.VITEST_WORKER_ID);
const dbPath = path_1.default.join(__dirname, '..', 'data', 'car_inventory.db');
if (!isTestEnvironment) {
    fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
}
const connection = new node_sqlite_1.DatabaseSync(isTestEnvironment ? ':memory:' : dbPath);
const initializeDatabase = async () => {
    connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      emailId TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
    return connection;
};
exports.initializeDatabase = initializeDatabase;
const normalizeSqlParams = (params = []) => params;
const prepare = (sql) => {
    const statement = connection.prepare(sql);
    return {
        get(...params) {
            return statement.get(...normalizeSqlParams(params));
        },
        all(...params) {
            return statement.all(...normalizeSqlParams(params));
        },
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
const db = {
    prepare,
    run(sql, ...params) {
        const statement = connection.prepare(sql);
        const result = statement.run(...normalizeSqlParams(params));
        return {
            changes: result.changes ?? 0,
            lastInsertRowid: Number(result.lastInsertRowid ?? 0),
        };
    },
    get(sql, ...params) {
        const statement = connection.prepare(sql);
        return statement.get(...normalizeSqlParams(params));
    },
    all(sql, ...params) {
        const statement = connection.prepare(sql);
        return statement.all(...normalizeSqlParams(params));
    },
};
exports.db = db;
initializeDatabase();
exports.default = db;
