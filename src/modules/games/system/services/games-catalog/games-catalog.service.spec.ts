import { TestBed } from '@angular/core/testing';

import { GamesCatalogService } from './games-catalog.service';

describe('GamesCatalogService', () => {
    let service: GamesCatalogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GamesCatalogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
