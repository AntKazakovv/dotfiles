import _assign from 'lodash-es/assign';
import _toString from 'lodash-es/toString';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractModel,
    IFromLog,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {IBonusHistory} from 'wlc-engine/modules/history/system/interfaces/bonus-history/bonus-history.interface';
import {TBonusFilter} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';

export class BonusHistoryItemModel extends AbstractModel<IBonusHistory> {

    constructor(
        from: IFromLog,
        data: any,
    ) {
        super({from: _assign({model: 'BonusHistoryItemModel'}, from)});
        this.data = this.modifyData(data);
    }

    public override set data(data: any) {
        super.data = data;
    }

    public override get data(): any {
        return super.data;
    }

    public get Name(): string {
        return this.data.Name.length > 35 ? `${this.data.Name.slice(0, 35)}...` : this.data.Name;
    }

    public get Balance(): string {
        return _toString(_toNumber(this.data.Balance) * WalletHelper.coefficientOriginalCurrencyConversion);
    }

    public get LoyaltyPoints(): string {
        return Number(this.data.LoyaltyPoints).toFixed(2);
    }

    public get ExperiencePoints(): string {
        return Number(this.data.ExperiencePoints).toFixed(2);
    }

    public get FreeroundCount(): string {
        return this.data.FreeroundCount || '0';
    }

    public get WageringTotal(): string {
        return Number(this.data.WageringTotal).toFixed(2) || '0';
    }

    public get End(): string {
        return GlobalHelper.toLocalTime(this.data.End, 'SQL', 'YYYY-MM-DD HH:mm:ss');
    }

    public get Status(): string {
        return this.data.Status;
    }

    public get StatusName(): string {
        return this.data.StatusName;
    }

    public get id(): string {
        return this.data.ID;
    }

    public get currency(): string {
        return WalletHelper.conversionCurrency ?? this.data.Currency;
    }

    protected modifyData(historyItem: any): any {
        historyItem.StatusName = TBonusFilter[historyItem.Status];

        return historyItem;
    }
}
