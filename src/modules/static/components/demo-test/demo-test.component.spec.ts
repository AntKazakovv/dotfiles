import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { demoTestComponent } from './demo-test.component';

describe('demoTestComponent', () => {
  let component: demoTestComponent;
  let fixture: ComponentFixture<demoTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ demoTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(demoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
