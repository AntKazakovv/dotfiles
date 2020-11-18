import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IWinnerData} from 'wlc-engine/modules/promo/services';
import {Game} from 'wlc-engine/modules/games/models/game.model';

import {
    get as _get,
    toString as _toString,
} from 'lodash';

export class WinnerModel {
    readonly gameId: string;
    readonly amountEur: number;
    readonly amount: number;
    readonly date: Date;
    readonly currency: string;
    readonly countryIso2: string;
    readonly countryIso3: string;
    readonly id: string;

    constructor(
        public data: IWinnerData,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        this.gameId = _toString(data.GameID);
        this.id = _toString(data.ID);
        this.amountEur = data.AmountEUR;
        this.amount = data.Amount;
        this.currency = data.Currency;
        this.countryIso2 = data.CountryIso2;
        this.countryIso3 = data.CountryIso3;
        this.date = new Date(data.Date);
    }

    public get game(): Game {
        return this.gamesCatalogService.getGameById(this.gameId);
    }
}
