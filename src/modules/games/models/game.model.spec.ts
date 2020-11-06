import {AbstractGame, Game} from './game.model';
import {gamesMockData} from '../mocks/games';
import {GamesHelper} from "wlc-engine/modules/games/games.helpers";

describe('Game', () => {
    const data: AbstractGame = gamesMockData.games[0];
    let game: Game;

    it('should create an instance', () => {
        expect(new Game(data)).toBeTruthy();
    });

    it('should get restriction', () => {
        const data: AbstractGame = gamesMockData.games[0];
        const game = new Game(data);
        const restrictions = GamesHelper.createRestrictions(gamesMockData.countriesRestrictions);
        expect(game.gameRestricted(restrictions, ['rus'])).toEqual(false);
    });

    it('should get merchant name', () => {
        const data: AbstractGame = gamesMockData.games[0];
        const game = new Game(data);
        expect(game.getMerchantName()).toEqual('AmaticDirect');
    });
});
