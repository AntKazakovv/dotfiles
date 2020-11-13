import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatPanelsComponent } from './float-panels.component';

describe('FloatPanelsComponent', () => {
  let component: FloatPanelsComponent;
  let fixture: ComponentFixture<FloatPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
