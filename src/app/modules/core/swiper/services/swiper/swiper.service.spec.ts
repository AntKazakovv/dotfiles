import { TestBed } from '@angular/core/testing';

import { SwiperService } from './swiper.service';

describe('SwiperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
          SwiperService
      ]
  }));

  it('should be created', () => {
    const service: SwiperService = TestBed.get(SwiperService);
    expect(service).toBeTruthy();
  });
});
