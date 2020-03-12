import { TestBed } from '@angular/core/testing';

import { LayoutsService } from './layouts.service';

describe('LayoutsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayoutsService = TestBed.get(LayoutsService);
    expect(service).toBeTruthy();
  });
});
