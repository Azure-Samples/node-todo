import * as debug from "debug";
import * as pg from "pg";
// import * as pgconn from "pg-connection-string";

const d = debug("azure-node-todo:PostgresService");

let service: PostgresService;

export let DEFAULT_CONFIG: pg.PoolConfig = {
    user: process.env.PGUSER,
    // tslint:disable-next-line:object-literal-sort-keys
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGSERVER,
    port: process.env.PGPORT || 5432,
    max: process.env.PGMAXCLIENTS || 10,
    idleTimeoutMillis: process.env.PGIDLETIMEOUT || 30000,
    ssl: true,
};

export class PostgresService {
    public static parseConnectionString(connstr: string): any {
        const output: any = {};
        const parts = connstr.split(";");
        d(parts);
        for (const part of parts) {
            d(part);
            const[key, value] = part.split("=", 2);
            switch (key.toLowerCase()) {
                case "database":
                    output.database = value;
                    break;
                case "data source":
                case "server":
                    output.host = value;
                    break;
                case "user id":
                    output.user = value;
                    break;
                case "password":
                    output.password = value;
                    break;
                default:
                    d(`Unknown key found in connection string: ${key}`);
                    break;
            }
        }
        d(`Parsed connection string to ${JSON.stringify(output, null, " ")}`);
        return output;
    }

    public static getDefault(): PostgresService {
        if (service) {
            d("Returning default service");
            return service;
        } else {
            d("Creating a new service");
            let config = DEFAULT_CONFIG;
            if (process.env.PGCONNECTIONSTRING || process.env.POSTGRESQLCONNSTR_defaultconnection) {
                d("Using PGCONNECTIONSTRING for connection");
                config = Object.assign({}, DEFAULT_CONFIG,
                    PostgresService.parseConnectionString(process.env.PGCONNECTIONSTRING
                                                            || process.env.POSTGRESQLCONNSTR_defaultconnection));
            }
            d(`Using config: \n ${JSON.stringify(config, null, " ")}`);
            service = new PostgresService(config);
            return service;
        }
    }

    public static async createDatabaseIfNotExists(newDatabaseName: string): Promise<boolean> {
        d("Creating Database if it doesn't exist");

        const config = Object.assign({}, DEFAULT_CONFIG);
        config.database = "postgres";

        const pg = new PostgresService(config);
        const client = await pg.pool.connect();

        client.on("error", (err) => {
            d("Client error!");
            console.error(err);
        });

        d("Checking to see if database %s exists", newDatabaseName);

        // Check if it exists
        let results = await client.query("select datname from pg_database where datname = $1", [newDatabaseName]);
        if (results.rowCount > 0) {
            d("Database already exists!");
            client.release();
            pg.pool.end();
            return true;
        }

        // Create database
        results = await client.query(`CREATE DATABSE ${newDatabaseName}`);

        // Double check we exists
        results = await client.query("select datname from pg_database where datname = $1", [newDatabaseName]);
        client.release();
        pg.pool.end();
        if (results.rowCount > 0) {
            d("Database created successfully!");
            return true;
        } else {
            d("Something went wrong while creating the database");
            return false;
        }
    }

    public pool: pg.Pool;

    constructor(config: pg.PoolConfig) {
        d("Creating a new connection pool");
        this.pool = new pg.Pool(config);

        this.pool.on("error", (err, client) => {
            d("ERROR: Idle client error: %s", err.message);
        });
    }
}
