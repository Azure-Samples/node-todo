import {TestBed} from '@angular/core/testing';

import {TodoComponent} from './todo.component';

describe('TodoComponent', () => {
    beforeEach(() => TestBed.configureTestingModule({ declarations: [TodoComponent] }));

    it('should instantiate the TodoComponent', () => {
        let fixture = TestBed.createComponent(TodoComponent);
        expect(fixture.componentInstance instanceof TodoComponent).toBe(true, 'should create TodoComponent');
    });
});
