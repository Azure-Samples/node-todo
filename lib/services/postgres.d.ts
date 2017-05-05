import * as pg from "pg";
export declare let DEFAULT_CONFIG: pg.PoolConfig;
export declare class PostgresService {
    static parseConnectionString(connstr: string): any;
    static getDefault(): PostgresService;
    static createDatabaseIfNotExists(newDatabaseName: string): Promise<boolean>;
    pool: pg.Pool;
    constructor(config: pg.PoolConfig);
}
