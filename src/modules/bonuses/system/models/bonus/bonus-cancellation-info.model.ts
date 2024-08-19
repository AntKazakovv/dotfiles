import _assign from 'lodash-es/assign';
import _toString from 'lodash-es/toString';
import _toNumber from 'lodash-es/toNumber';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';

import {IBonusCanceledInfo} from 'wlc-engine/modules/bonuses';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';

export class BonusCancellationInfo extends AbstractModel<IBonusCanceledInfo> {

    constructor(
        data: IBonusCanceledInfo,
        from?: IFromLog,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});
        this.data = data;
    }

    public get bonusBalanceDecrease(): string {
        return _toString(_toNumber(this.data.BurnOnBonusBalance) * WalletHelper.coefficientOriginalCurrencyConversion);
    }

    public get realBalanceDecrease(): string {
        return  _toString(_toNumber(this.data.BurnOnRealBalance) * WalletHelper.coefficientOriginalCurrencyConversion);
    }

    public get realBalanceIncrease(): string {
        return this.data.TransferredToRealBalance;
    }

    public get wageringAmount(): string {
        return this.data.AmountToCompleteWagering;
    }

    public get currency(): string {
        return WalletHelper.conversionCurrency ?? this.data.Currency;
    }

}
