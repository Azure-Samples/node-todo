import { PostgresService } from "../services";
export declare const schemaName = "azure_node_todo";
export declare const todoTableName = "todo";
export declare class TodoModel {
    db: PostgresService;
    constructor();
    initialize(): Promise<void>;
    add(text: string): Promise<ITodoItem>;
    get(id: number): Promise<ITodoItem>;
    getAll(page: number, pageSize: number): Promise<any[]>;
    toggleDone(id: number): Promise<ITodoItem[]>;
    remove(id: number): Promise<ITodoItem>;
    private createSchemaIfNotExists(client);
    private createTableIfNotExists(client);
}
export interface ITodoItem {
    id: number;
    text: string;
    done: boolean;
    createdAt: Date;
    completedAt: Date;
}
