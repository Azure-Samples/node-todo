export interface ITodoItem {
    id: number;
    text: string;
    done: boolean;
    createdAt: Date;
    completedAt: Date;
}