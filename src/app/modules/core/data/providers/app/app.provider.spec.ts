import { TestBed } from '@angular/core/testing';

import { AppProvider } from './app.provider';

describe('AppProvider', () => {
  let service: AppProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
