import _assign from 'lodash-es/assign';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet/system/helpers';

export class Bet extends AbstractModel<IBet> {
    constructor(
        from: IFromLog,
        data: IBet,
    ) {
        super({from: _assign({model: 'Bet'}, from)});
        this.data = data;
    }

    public get amount(): string {
        return this.data.Amount;
    }

    public get currency(): string {
        return WalletHelper.conversionCurrency ?? this.data.Currency;
    }

    public get date(): string {
        return this.data.Date;
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
}
