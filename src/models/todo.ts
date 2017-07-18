import * as debug from "debug";
import {Client} from "pg";
import {
    DEFAULT_CONFIG,
    PostgresService,
} from "../services";

const d = debug("azure-node-todo:TodoModel");

export const schemaName = "azure_node_todo";
export const todoTableName = "todo";

/**
 * Model for getting managing todo items
 */
export class TodoModel {
    public db: PostgresService;

    constructor() {
        this.db = PostgresService.getDefault();
    }

    /**
     * Creates the database and table if it doesn't exist
     */
    public async initialize() {
        // This can take a while...
        try {
            await PostgresService.createDatabaseIfNotExists(DEFAULT_CONFIG.database);
         } catch (e) {
             d("Failed to create database, might not be able to connect to database if it doesn't already exist");
             d(e);
         }
        const client = await this.db.pool.connect();
        await this.createSchemaIfNotExists(client);
        await this.createTableIfNotExists(client);
        client.release();
    }

    /**
     * Adds a todo item with the given text
     */
    public async add(text: string): Promise<ITodoItem> {
        try {
            const query =
                `
            INSERT INTO ${schemaName}.${todoTableName} (text) 
                VALUES ($1) 
                RETURNING *;
            `;
            d("Adding item to Todo");
            const results = await this.db.pool.query(query, [text]);
            d("Added item to Todo");
            return results.rows[0];
        } catch (error) {
            d("Could not add todo item");
            throw error;
        }
    }

    /**
     * Gets a todo item based on the id provided
     */
    public async get(id: number): Promise<ITodoItem> {
        try {
            d("Fetching todo item: %s", id);
            const query =
                `SELECT * FROM ${schemaName}.${todoTableName} where id=$1`;
            d("Getting item from todo");
            const results = await this.db.pool.query(query, [id]);
            if (results.rows.length < 1) {
                d("Could not find item in Todo table");
                return null;
            }
            d("Found item in Todo table");
            return results.rows[0];
        } catch (error) {
            d("Failed to fetch Todo item for id: %s", id);
            throw error;
        }
    }

    /**
     * Get all todo items
     */
    public async getAll(page: number, pageSize: number) {
        try {
            page = page || 1;
            pageSize = pageSize || 100;
            const offset = (page - 1) * pageSize;
            d("Fetching all todo items - offset: %s, limit: %s", offset, pageSize);
            const query =
                `
                SELECT * 
                    FROM ${schemaName}.${todoTableName} 
                    ORDER BY id 
                    LIMIT ${pageSize} 
                    OFFSET ${offset};
                `;
            const results = await this.db.pool.query(query);
            d("Returning todo items");
            return results.rows;
        } catch (error) {
            d("Failed to fetch all todo items");
            throw error;
        }
    }

    /**
     * Toggles done on and off for a given todo item
     */
    public async toggleDone(id: number): Promise<ITodoItem[]> {
        try {
            const query =
                `UPDATE ${schemaName}.${todoTableName} 
                SET done = NOT done, completedAt = now()
                WHERE id = $1 
                RETURNING *;`;
            d("Toggling todo item done");
            const results = await this.db.pool.query(query, [id]);
            d("Toggled todo item");
            return results.rows[0];
        } catch (error) {
            d("Failed to toggle done on id: %s", id);
            throw error;
        }
    }

    /**
     * Removes a todo item based on id
     */
    public async remove(id: number): Promise<ITodoItem> {
        try {
            const query =
                `DELETE FROM ${schemaName}.${todoTableName}
                WHERE id = $1
                RETURNING *;`;
            d("Removing Todo item");
            const results = await this.db.pool.query(query, [id]);
            d("Removed Todo item");
            return results.rows[0];
        } catch (error) {
            d("Failed to delete item with id: %s", id);
            throw error;
        }
    }

    private async createSchemaIfNotExists(client: Client) {
        try {
            const schemaquery =
                `SELECT schema_name
                FROM   information_schema.schemata 
                WHERE  schema_name = $1;`;
            d("Checking to see if schema %s exists", schemaName);
            let results = await client.query(schemaquery, [schemaName]);
            if (results.rowCount > 0) {
                d("Schema %s already exists", schemaName);
                return;
            } else {
                d("Creating Schema");
                const createschema =
                    `CREATE SCHEMA ${schemaName};`;
                d("running query: \n%s", createschema);
                results = await client.query(createschema);
                d("Succeeded to create table");
                return;
            }
        } catch (error) {
            d("Could not initialize Todo model: %s", error.message);
            throw error;
        }
    }

    private async createTableIfNotExists(client: Client) {
        try {
            const tablequery =
                `SELECT table_name, table_schema
                FROM   information_schema.tables 
                WHERE  table_schema = $1
                AND    table_name = $2`;
            d("Checking to see if table %s.%s exists", schemaName, todoTableName);
            let results = await client.query(tablequery, [schemaName, todoTableName]);
            if (results.rowCount > 0) {
                d("Table %s already exists", schemaName);
                return;
            } else {
                d("Creating table");
                const createTable =
                    `CREATE TABLE ${schemaName}.${todoTableName} (
                    id serial PRIMARY KEY,
                    text text,
                    done boolean DEFAULT false,
                    createdAt timestamp DEFAULT current_timestamp,
                    completedAt timestamp
                );`;
                d("running query: \n%s", createTable);
                results = await client.query(createTable);
                d("Succeeded to create table");
                return;
            }
        } catch (error) {
            d("Could not initialize Todo model: %s", error.message);
            throw error;
        }
    }

}

export interface ITodoItem {
    id: number;
    text: string;
    done: boolean;
    createdAt: Date;
    completedAt: Date;
}
