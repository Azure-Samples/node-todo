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
const services_1 = require("../services");
const d = debug("azure-node-todo:TodoModel");
exports.schemaName = "azure_node_todo";
exports.todoTableName = "todo";
class TodoModel {
    constructor() {
        this.db = services_1.PostgresService.getDefault();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield services_1.PostgresService.createDatabaseIfNotExists(services_1.DEFAULT_CONFIG.database);
            const client = yield this.db.pool.connect();
            yield this.createSchemaIfNotExists(client);
            yield this.createTableIfNotExists(client);
            client.release();
        });
    }
    add(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            INSERT INTO ${exports.schemaName}.${exports.todoTableName} (text) 
                VALUES ($1) 
                RETURNING *;
            `;
                d("Adding item to Todo");
                const results = yield this.db.pool.query(query, [text]);
                d("Added item to Todo");
                return results.rows[0];
            }
            catch (error) {
                d("Could not add todo item");
                throw error;
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                d("Fetching todo item: %s", id);
                const query = `SELECT * FROM ${exports.schemaName}.${exports.todoTableName} where id=$1`;
                d("Getting item from todo");
                const results = yield this.db.pool.query(query, [id]);
                if (results.rows.length < 1) {
                    d("Could not find item in Todo table");
                    return null;
                }
                d("Found item in Todo table");
                return results.rows[0];
            }
            catch (error) {
                d("Failed to fetch Todo item for id: %s", id);
                throw error;
            }
        });
    }
    getAll(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = page || 1;
                pageSize = pageSize || 100;
                const offset = (page - 1) * pageSize;
                d("Fetching all todo items - offset: %s, limit: %s", offset, pageSize);
                const query = `
                SELECT * 
                    FROM ${exports.schemaName}.${exports.todoTableName} 
                    ORDER BY id 
                    LIMIT ${pageSize} 
                    OFFSET ${offset};
                `;
                const results = yield this.db.pool.query(query);
                d("Returning todo items");
                return results.rows;
            }
            catch (error) {
                d("Failed to fetch all todo items");
                throw error;
            }
        });
    }
    toggleDone(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE ${exports.schemaName}.${exports.todoTableName} 
                SET done = NOT done, completedAt = now()
                WHERE id = $1 
                RETURNING *;`;
                d("Toggling todo item done");
                const results = yield this.db.pool.query(query, [id]);
                d("Toggled todo item");
                return results.rows[0];
            }
            catch (error) {
                d("Failed to toggle done on id: %s", id);
                throw error;
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `DELETE FROM ${exports.schemaName}.${exports.todoTableName}
                WHERE id = $1
                RETURNING *;`;
                d("Removing Todo item");
                const results = yield this.db.pool.query(query, [id]);
                d("Removed Todo item");
                return results.rows[0];
            }
            catch (error) {
                d("Failed to delete item with id: %s", id);
                throw error;
            }
        });
    }
    createSchemaIfNotExists(client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemaquery = `SELECT schema_name
                FROM   information_schema.schemata 
                WHERE  schema_name = $1;`;
                d("Checking to see if schema %s exists", exports.schemaName);
                let results = yield client.query(schemaquery, [exports.schemaName]);
                if (results.rowCount > 0) {
                    d("Schema %s already exists", exports.schemaName);
                    return;
                }
                else {
                    d("Creating Schema");
                    const createschema = `CREATE SCHEMA ${exports.schemaName};`;
                    d("running query: \n%s", createschema);
                    results = yield client.query(createschema);
                    d("Succeeded to create table");
                    return;
                }
            }
            catch (error) {
                d("Could not initialize Todo model: %s", error.message);
                throw error;
            }
        });
    }
    createTableIfNotExists(client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tablequery = `SELECT table_name, table_schema
                FROM   information_schema.tables 
                WHERE  table_schema = $1
                AND    table_name = $2`;
                d("Checking to see if table %s.%s exists", exports.schemaName, exports.todoTableName);
                let results = yield client.query(tablequery, [exports.schemaName, exports.todoTableName]);
                if (results.rowCount > 0) {
                    d("Table %s already exists", exports.schemaName);
                    return;
                }
                else {
                    d("Creating table");
                    const createTable = `CREATE TABLE ${exports.schemaName}.${exports.todoTableName} (
                    id serial PRIMARY KEY,
                    text text,
                    done boolean DEFAULT false,
                    createdAt timestamp DEFAULT current_timestamp,
                    completedAt timestamp
                );`;
                    d("running query: \n%s", createTable);
                    results = yield client.query(createTable);
                    d("Succeeded to create table");
                    return;
                }
            }
            catch (error) {
                d("Could not initialize Todo model: %s", error.message);
                throw error;
            }
        });
    }
}
exports.TodoModel = TodoModel;
//# sourceMappingURL=todo.js.map