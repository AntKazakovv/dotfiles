import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IWinnerData} from 'wlc-engine/interfaces';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {AbstractModel} from 'wlc-engine/modules/core/models/abstract.model';

import {
    toString as _toString,
} from 'lodash';

export class WinnerModel extends AbstractModel<IWinnerData> {

    constructor(
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super();
    }

    public get id(): string {
        return _toString(this.data.ID);
    }

    public get amount(): number {
        return this.data.Amount;
    }

    public get amountEur(): number {
        return this.data.AmountEUR;
    }

    public get currency(): string {
        return this.data.Currency;
    }

    public get countryIso2(): string {
        return this.data.CountryIso2;
    }

    public get countryIso3(): string {
        return this.data.CountryIso3;
    }

    public get date(): Date {
        return new Date(this.data.Date);
    }

    public get gameId(): string {
        return _toString(this.data.GameID);
    }

    public get game(): Game {
        return this.gamesCatalogService.getGameById(this.gameId);
    }

    protected checkData(): void {
        // TODO or not TODO...
    }
}
