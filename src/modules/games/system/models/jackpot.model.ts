import {IFromLog} from 'wlc-engine/modules/core';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IJackpot} from 'wlc-engine/modules/games';

import _assign from 'lodash-es/assign';

export class JackpotModel extends AbstractModel<IJackpot> {

    constructor(
        from: IFromLog,
        data: IJackpot,
    ) {
        super({from: _assign({model: 'JackpotModel'}, from)});
        this.data = data;
    }

    public get id(): string {
        return this.data.id;
    }

    public get merchantName(): string {
        return this.data.MerchantName;
    }

    public get merchantID(): number {
        return +this.data.MerchantID;
    }

    public get launchCode(): string {
        return this.data.LaunchCode;
    }

    public get amount(): number {
        return this.data.amount;
    }

    public get currency(): string {
        return this.data.currency;
    }

    public get gameName(): string {
        return this.data.game;
    }

    public get gameImage(): string {
        return this.data.image;
    }
}
