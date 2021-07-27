import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ILevel} from 'wlc-engine/modules/promo/';
import {IFromLog} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

export class LoyaltyLevelModel extends AbstractModel<ILevel> {

    constructor(
        from: IFromLog,
        data: ILevel,
    ) {
        super({from: _assign({model: 'LoyaltyLevelModel'}, from)});
        this.data = data;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get level(): number {
        return _toNumber(this.data.Level);
    }

    public get nextLevelPoints(): number {
        return _toNumber(this.data.NextLevelPoints);
    }

    public get coef(): number {
        return _toNumber(this.data.Coef);
    }

    public get confirmPoints(): number {
        return _toNumber(this.data.ConfirmPoints);
    }
}
