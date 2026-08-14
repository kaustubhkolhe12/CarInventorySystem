declare module 'sql.js' {
  export interface Statement {
    bind(values?: unknown[]): void;
    step(): boolean;
    getAsObject(): Record<string, unknown>;
    free(): void;
  }

  export interface DatabaseInstance {
    prepare(sql: string): Statement;
    exec(sql: string): Array<{ columns: string[]; values: unknown[][] }>;
    export(): Uint8Array;
  }

  export interface SqlJsModule {
    Database: new (data?: Uint8Array) => DatabaseInstance;
  }

  const initSqlJs: () => Promise<SqlJsModule>;
  export default initSqlJs;
}
