import _assign from 'lodash-es/assign';


import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IFromLog} from 'wlc-engine/modules/core';
import {
    ICashbackHistory,
} from 'wlc-engine/modules/history/system/interfaces/cashback-history/cashback-history.interface';

export class CashbackHistoryModel extends AbstractModel<ICashbackHistory> {
    constructor(
        from: IFromLog,
        data: ICashbackHistory,
    ) {
        super({from: _assign({model: 'Bet'}, from)});
        this.data = data;
    }

    public get id(): string {
        return this.data.ID;
    }

    public get amountConverted(): string {
        return this.data.AmountConverted;
    }

    public get periodFrom(): string {
        return this.data.PeriodFrom;
    }

    public get periodTo(): string {
        return this.data.PeriodTo;
    }

    public get addDate(): string {
        return this.data.AddDate;
    }

    public get deposits(): string {
        return this.data.Deposits;
    }

    public get windrawal(): string {
        return this.data.Windrawals;
    }
}
