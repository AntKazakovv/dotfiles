import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCaptchaComponent } from './google-captcha.component';

describe('GoogleCaptchaComponent', () => {
  let component: GoogleCaptchaComponent;
  let fixture: ComponentFixture<GoogleCaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleCaptchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
