import {Game} from './game.model';
import {gamesMockData} from '../mocks/games';
import {GamesHelper} from 'wlc-engine/modules/games/games.helpers';
import {IGame} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {UIRouter} from '@uirouter/core';

describe('Game', () => {
    const data: IGame = gamesMockData.games[0];
    let game: Game;
    let router = new UIRouter();

    it('should create an instance', () => {
        expect(new Game(data, router)).toBeTruthy();
    });

    it('should get restriction', () => {
        const data: IGame = gamesMockData.games[0];
        const game = new Game(data, router);
        const restrictions = GamesHelper.createRestrictions(gamesMockData.countriesRestrictions);
        expect(game.gameRestricted(restrictions, ['rus'])).toEqual(false);
    });

    it('should get merchant name', () => {
        const data: IGame = gamesMockData.games[0];
        const game = new Game(data, router);
        expect(game.getMerchantName()).toEqual('AmaticDirect');
    });
});
