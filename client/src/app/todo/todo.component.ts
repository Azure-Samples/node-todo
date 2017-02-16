import { Component, OnInit } from '@angular/core';

import { TodoService, ITodoItem } from './todo.service';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'todo',
    template: require('./todo.component.html'),
    providers: [TodoService]
})

export class TodoComponent implements OnInit  {
    todos: ITodoItem[];
    loaded: boolean = false;

    constructor(private todoService: TodoService) {}

    ngOnInit(): void {
        console.log("Init Todo");
        this.todoService.getAll(1, 100)
            .subscribe(todoItems => {
                console.log("Got todos");
                this.todos = todoItems;
                console.log(this.todos);
                this.loaded = true;
            });
    }

    refresh() {
        this.loaded = false;
        this.todoService.getAll(1, 100)
            .subscribe(todoItems => {
                console.log("Got todos");
                this.todos = todoItems;
                console.log(this.todos);
                this.loaded = true;
            });
    }

    create(text: string) {
        this.todoService.create(text)
            .subscribe(todoItem => {
                console.log("Created id: " + todoItem.id);
                this.todos.push(todoItem);
            });
    }

    toggleDone(item: ITodoItem) {
        this.todoService.toggleDone(item.id)
            .subscribe(todoItem => {
                console.log("Toggled id: " + todoItem.id);
                Object.assign(item, todoItem);
            });
    }

    remove(item: ITodoItem) {
        this.todoService.remove(item.id)
            .subscribe(todoItem => {
                console.log("Removed id: " + todoItem.id);
                this.todos = this.todos.filter(i => i.id !== item.id);
            });
    }
}
