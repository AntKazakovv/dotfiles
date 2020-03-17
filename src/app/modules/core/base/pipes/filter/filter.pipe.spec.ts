import {Component, Pipe, PipeTransform} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';

import {FilterPipe} from './filter.pipe';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'test',
    template: `
    <p>{{ text | filter }}</p>
    `
})
class TestComponent {
    text: string;
}

describe('FilterPipe', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                FilterPipe
            ],
            imports: [
                CommonModule
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('create an instance', () => {
        const pipe = new FilterPipe();
        expect(pipe).toBeTruthy();
    });

    it('test filter', async(() => {
        const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
        fixture.componentInstance.text = 'foo';
        fixture.detectChanges();

        const el: HTMLElement = fixture.debugElement.nativeElement;
        expect(el.querySelector('p').textContent).toBe('foo');
    }));

});
