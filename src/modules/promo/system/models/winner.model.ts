import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IWinnerData} from 'wlc-engine/modules/promo/system/services';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _toString from 'lodash-es/toString';
import _toNumber from 'lodash-es/toNumber';

export class WinnerModel extends AbstractModel<IWinnerData> {

    constructor(
        from: IFromLog,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({from: _assign({model: 'WinnerModel'}, from)});
    }

    public get id(): string {
        return _toString(this.data.ID) || this.data.Date.replace(/\D/g, '');
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

    public get date(): Dayjs {
        return dayjs(this.data.Date, 'YYYY-MM-DDTHH:mm:ss');
    }

    public get screenName(): string {
        return this.data.ScreenName;
    }

    public get gameId(): number {
        return this.data.GameID;
    }

    public get gameTableId(): number {
        return this.data.GameTableID && _toNumber(this.data.GameTableID);
    }

    public get game(): Game {
        return this.gamesCatalogService.getGameById(this.gameId, this.gameTableId);
    }

    protected override checkData(): void {
        // TODO or not TODO...
    }
}
