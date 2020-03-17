import { TestBed } from '@angular/core/testing';

import { LayoutsService } from './layouts.service';

describe('LayoutsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
          LayoutsService
      ]
  }));

  it('should be created', () => {
    const service: LayoutsService = TestBed.get(LayoutsService);
    expect(service).toBeTruthy();
  });
});
