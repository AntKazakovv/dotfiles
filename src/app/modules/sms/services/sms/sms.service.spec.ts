import { TestBed } from '@angular/core/testing';

import { SmsService } from './sms.service';

describe('SmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
          SmsService
      ]
  }));

  it('should be created', () => {
    const service: SmsService = TestBed.get(SmsService);
    expect(service).toBeTruthy();
  });
});
