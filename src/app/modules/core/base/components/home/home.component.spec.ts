import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import {MatSliderModule} from '@angular/material/slider';

import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            HomeComponent
        ],
        providers: [
            TranslateService
        ],
        imports: [
            TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
            }),
            MatSliderModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
