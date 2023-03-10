import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {IBonusCanceledInfo} from 'wlc-engine/modules/bonuses';
import _assign from 'lodash-es/assign';

export class BonusCancellationInfo extends AbstractModel<IBonusCanceledInfo> {
    constructor(
        data: IBonusCanceledInfo,
        from?: IFromLog,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});
        this.data = data;
    }

    public get bonusBalanceDecrease(): string {
        return this.data.BurnOnBonusBalance;
    }

    public get realBalanceDecrease(): string {
        return this.data.BurnOnRealBalance;
    }

    public get realBalanceIncrease(): string {
        return this.data.TransferredToRealBalance;
    }

    public get wageringAmount(): string {
        return this.data.AmountToCompleteWagering;
    }

    public get currency(): string {
        return this.data.Currency;
    }

}
