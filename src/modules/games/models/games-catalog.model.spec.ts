import {GamesCatalog} from './games-catalog.model';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';

import {gamesMockData} from '../mocks/games';

describe('GamesCatalog', () => {
    let configService: ConfigService;

    it('should create an instance', () => {
        expect(new GamesCatalog(gamesMockData, configService)).toBeTruthy();
    });
});
