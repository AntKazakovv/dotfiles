import {UIRouter} from '@uirouter/core';
import {TestBed} from '@angular/core/testing';

// import {gamesMockData} from '../mocks/games';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalog} from './games-catalog.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';

describe('GamesCatalog', () => {
    let router: UIRouter;
    let gamesCatalogService: GamesCatalogService;
    let eventService: EventService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        eventService = TestBed.inject(EventService);
        router = TestBed.inject(UIRouter);
    });

    // it('should create an instance', () => {
    //     expect(new GamesCatalog(gamesMockData, gamesCatalogService)).toBeTruthy();
    // });

    // it('should call getGameList', () => {
    //     const gamesCatalog = new GamesCatalog(gamesMockData, gamesCatalogService);
    //     const games = gamesCatalog.getGameList();
    // });
});
