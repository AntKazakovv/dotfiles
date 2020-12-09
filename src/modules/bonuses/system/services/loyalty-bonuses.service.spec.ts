import { TestBed } from '@angular/core/testing';

import { LoyaltyBonusesService } from './loyalty-bonuses.service';

describe('LoyaltyBonusesServiceService', () => {
  let service: LoyaltyBonusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyaltyBonusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
