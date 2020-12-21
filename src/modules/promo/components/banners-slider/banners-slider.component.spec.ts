import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersSliderComponent } from './banners-slider.component';

describe('BannersSliderComponent', () => {
  let component: BannersSliderComponent;
  let fixture: ComponentFixture<BannersSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannersSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
