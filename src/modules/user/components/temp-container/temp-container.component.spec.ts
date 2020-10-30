import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempContainerComponent } from './temp-container.component';

describe('TempContainerComponent', () => {
  let component: TempContainerComponent;
  let fixture: ComponentFixture<TempContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
