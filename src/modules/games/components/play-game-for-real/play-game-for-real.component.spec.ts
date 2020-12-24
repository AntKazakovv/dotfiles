import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGameForRealComponent } from './play-game-for-real.component';

describe('PlayGameForRealComponent', () => {
  let component: PlayGameForRealComponent;
  let fixture: ComponentFixture<PlayGameForRealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayGameForRealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayGameForRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
