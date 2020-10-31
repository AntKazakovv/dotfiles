/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinancesService } from './finances.service';

describe('Service: Finances', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancesService],
    });
  });

  it('should ...', inject([FinancesService], (service: FinancesService) => {
    expect(service).toBeTruthy();
  }));
});
