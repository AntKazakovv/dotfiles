import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _assign from 'lodash-es/assign';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';

export class Bet extends AbstractModel<IBet> {
    private _currency: string;
    private _amount: string;

    constructor(
        from: IFromLog,
        data: IBet,
    ) {
        super({from: _assign({model: 'Bet'}, from)});
        this.data = data;
        this._currency = this.data.Currency;
        this._amount = this.data.Amount;
    }

    public get amount(): string {
        return this._amount;
    }

    public get currency(): string {
        return this._currency;
    }

    public get date(): Dayjs {
        return dayjs(this.data.DateISO, 'YYYY-MM-DDTHH:mm:ss');
    }

    public get dateISO(): string {
        return this.data.DateISO;
    }

    public get gameId(): string {
        return this.data.GameID;
    }

    public get gameName(): string {
        return this.data.GameName;
    }

    public get merchant(): string {
        return this.data.Merchant;
    }

    public set currency(currency: string) {
        this._currency = currency;
    }

    public set amount(amount: string) {
        this._amount = amount;
    }
}
