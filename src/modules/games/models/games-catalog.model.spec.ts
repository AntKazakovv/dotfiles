import {UIRouter} from '@uirouter/core';
import {TestBed} from '@angular/core/testing';

import {gamesMockData} from '../mocks/games';
import {EventService} from 'wlc-engine/modules/core/services';
import {GamesCatalog} from './games-catalog.model';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';

describe('GamesCatalog', () => {
    let configService: ConfigService;
    let router: UIRouter;

    let eventService: EventService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        eventService = TestBed.inject(EventService);
        router = TestBed.inject(UIRouter);
    });


    it('should create an instance', () => {
        expect(new GamesCatalog(gamesMockData, configService, eventService, router)).toBeTruthy();
    });

    it('should call getGameList', () => {
        const gamesCatalog = new GamesCatalog(gamesMockData, configService, eventService, router);
        const games = gamesCatalog.getGameList();
    });
});
