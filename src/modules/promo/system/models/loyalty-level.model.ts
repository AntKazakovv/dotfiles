import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ILevel} from 'wlc-engine/modules/promo/';

import _toNumber from 'lodash-es/toNumber';

export class LoyaltyLevelModel extends AbstractModel<ILevel> {

    constructor(
        data: ILevel,
    ) {
        super();
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
