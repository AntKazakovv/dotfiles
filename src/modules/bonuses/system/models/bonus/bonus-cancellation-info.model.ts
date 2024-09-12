import {inject} from '@angular/core';

import _assign from 'lodash-es/assign';

import {ConfigService} from 'wlc-engine/modules/core';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';

import {IBonusCanceledInfo} from 'wlc-engine/modules/bonuses';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

export class BonusCancellationInfo extends AbstractModel<IBonusCanceledInfo> {
    protected readonly configService: ConfigService = inject(ConfigService);

    constructor(
        protected readonly walletsService: WalletsService,
        data: IBonusCanceledInfo,
        from?: IFromLog,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});
        this.data = data;
    }

    public get coefficientConversion(): number {
        return this.walletsService?.coefficientOriginalCurrencyConversion || 1;
    }

    public get bonusBalanceDecrease(): number {
        return Number(this.data.BurnOnBonusBalance) * this.coefficientConversion;
    }

    public get realBalanceDecrease(): number {
        return  Number(this.data.BurnOnRealBalance) * this.coefficientConversion;
    }

    public get realBalanceIncrease(): string {
        return this.data.TransferredToRealBalance;
    }

    public get wageringAmount(): string {
        return this.data.AmountToCompleteWagering;
    }

    public get currency(): string {
        return this.walletsService?.conversionCurrency ?? this.data.Currency;
    }
}
