import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PseudoLinkComponent } from './pseudo-link.component';

describe('PseudoLinkComponent', () => {
  let component: PseudoLinkComponent;
  let fixture: ComponentFixture<PseudoLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PseudoLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PseudoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
