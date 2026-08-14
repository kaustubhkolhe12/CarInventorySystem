import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const isTestEnvironment = Boolean(process.env.NODE_ENV === 'test' || process.env.VITEST || process.env.VITEST_WORKER_ID);
const dbPath = path.join(__dirname, '..', 'data', 'car_inventory.db');

if (!isTestEnvironment) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const connection = new DatabaseSync(isTestEnvironment ? ':memory:' : dbPath);

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

const normalizeSqlParams = (params: unknown[] = []) => params as any[];

const prepare = (sql: string) => {
  const statement = connection.prepare(sql);

  return {
    get(...params: unknown[]) {
      return statement.get(...normalizeSqlParams(params));
    },
    all(...params: unknown[]) {
      return statement.all(...normalizeSqlParams(params));
    },
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

const db = {
  prepare,
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
  get<T>(sql: string, ...params: unknown[]) {
    const statement = connection.prepare(sql);
    return statement.get(...normalizeSqlParams(params)) as T | undefined;
  },
  all<T>(sql: string, ...params: unknown[]) {
    const statement = connection.prepare(sql);
    return statement.all(...normalizeSqlParams(params)) as T[];
  },
};

initializeDatabase();

export { db, initializeDatabase };
export default db;
