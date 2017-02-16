import * as pg from "pg";
export declare const DEFAULT_CONFIG: pg.PoolConfig;
export declare class PostgresService {
    static getDefault(): PostgresService;
    static createDatabaseIfNotExists(newDatabaseName: string): Promise<boolean>;
    pool: pg.Pool;
    constructor(config: pg.PoolConfig);
}
