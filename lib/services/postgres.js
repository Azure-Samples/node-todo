"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const debug = require("debug");
const pg = require("pg");
const d = debug("azure-node-todo:PostgresService");
let service;
exports.DEFAULT_CONFIG = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGSERVER,
    port: process.env.PGPORT || 5432,
    max: process.env.PGMAXCLIENTS || 10,
    idleTimeoutMillis: process.env.PGIDLETIMEOUT || 30000,
    ssl: true,
};
class PostgresService {
    static getDefault() {
        if (service) {
            d("Returning default service");
            return service;
        }
        else {
            d("Creating a new service");
            service = new PostgresService(exports.DEFAULT_CONFIG);
            return service;
        }
    }
    static createDatabaseIfNotExists(newDatabaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            d("Creating Database if it doesn't exist");
            const config = Object.assign({}, exports.DEFAULT_CONFIG);
            config.database = "postgres";
            const pg = new PostgresService(config);
            const client = yield pg.pool.connect();
            client.on("error", (err) => {
                d("Client error!");
                console.error(err);
            });
            d("Checking to see if database %s exists", newDatabaseName);
            let results = yield client.query("select datname from pg_database where datname = $1", [newDatabaseName]);
            if (results.rowCount > 0) {
                d("Database already exists!");
                client.release();
                pg.pool.end();
                return true;
            }
            results = yield client.query(`CREATE DATABSE ${newDatabaseName}`);
            results = yield client.query("select datname from pg_database where datname = $1", [newDatabaseName]);
            client.release();
            pg.pool.end();
            if (results.rowCount > 0) {
                d("Database created successfully!");
                return true;
            }
            else {
                d("Something went wrong while creating the database");
                return false;
            }
        });
    }
    constructor(config) {
        d("Creating a new connection pool");
        this.pool = new pg.Pool(config);
        this.pool.on("error", (err, client) => {
            d("ERROR: Idle client error: %s", err.message);
        });
    }
}
exports.PostgresService = PostgresService;
//# sourceMappingURL=postgres.js.map