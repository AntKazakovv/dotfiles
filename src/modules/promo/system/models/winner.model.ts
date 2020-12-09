import {DateTime} from 'luxon';

import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IWinnerData} from 'wlc-engine/modules/promo/system/services';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';

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
        return _toString(this.data.ID) || this.data.Date.replace(/[\D]/g, '');
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

    public get date(): DateTime {
        return DateTime.fromISO(this.data.Date);
    }

    public get name(): string {
        return this.data.Name;
    }

    public get gameId(): number {
        return this.data.GameID;
    }

    public get game(): Game {
        return this.gamesCatalogService.getGameById(this.gameId);
    }

    protected checkData(): void {
        // TODO or not TODO...
    }
}
