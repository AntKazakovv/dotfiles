import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersSliderComponent } from './winners-slider.component';

describe('WinnersSliderComponent', () => {
  let component: WinnersSliderComponent;
  let fixture: ComponentFixture<WinnersSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinnersSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnersSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
