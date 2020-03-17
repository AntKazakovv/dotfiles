import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';

describe('EventService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
          EventService
      ]
  }));

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });
});
