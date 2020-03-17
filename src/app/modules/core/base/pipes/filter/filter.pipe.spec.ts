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

@Pipe({
    name: 'filter'
})
export class FilterPipeMock implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return value;
    }
}

// TestBed.configureTestingModule({
//     declarations: [
//         TestComponent, FilterPipeMock
//     ],
//     providers: [
//         // FilterPipe
//     ]
// });

describe('FilterPipe', () => {

  beforeEach(() => {
      TestBed.configureTestingModule({
          declarations: [
              TestComponent,
              FilterPipeMock
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
      const pipe = new FilterPipeMock();
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
