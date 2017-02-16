import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ITodoItem } from './todoItem';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class TodoService {
    constructor(private http: Http) { };

    getAll(page: number, pageSize: number): Observable<ITodoItem[]> {
        return this.http.get(`/api/todo?page=${page}&pageSize=${pageSize}`)
                    .map(res => res.json() as ITodoItem[]);
    }

    get(id: number): Observable<ITodoItem> {
        return this.http.get(`/api/todo/${id}`)
                    .map(res => res.json() as ITodoItem);
    }

    create(text: string): Observable<ITodoItem> {
        return this.http.put(`/api/todo`, {text: text})
                    .map(res => res.json() as ITodoItem);
    }

    toggleDone(id: number): Observable<ITodoItem> {
        return this.http.post(`/api/todo/${id}/toggleDone`, {})
                    .map(res => res.json() as ITodoItem);
    }

    remove(id: number): Observable<ITodoItem> {
        return this.http.delete(`/api/todo/${id}`)
                    .map(res => res.json() as ITodoItem);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

export {
    ITodoItem
}