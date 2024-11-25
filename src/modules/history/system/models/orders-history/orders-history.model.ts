import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

import {BehaviorSubject} from 'rxjs';

import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {GlobalHelper} from 'wlc-engine/modules/core';

export interface IOrder {
    ID: string,
    IDClient: string,
    IDUser: string,
    IDItem: string,
    IDTransaction: string,
    Status: string,
    AddDate: string,
    Updated: string,
    Note: string,
    Amount: string,
    AmountExperience: string,
    PriceMoney: IIndexing<string> | string,
    Name: string,
}

export interface IOrderStatus {
    code: number;
    value: string;
}

export interface ICurrencyPrice {
    currency: string,
    price: number,
}

export const ordersStatuses: IOrderStatus[] = [
    {code: 99, value: gettext('Paid')},
    {code: 100, value: gettext('Ended')},
    {code: 1, value: gettext('Ordered')},
];

export class OrderHistoryItemModel extends AbstractModel<IOrder> {
    protected static userCurrency: string;

    constructor(
        from: IFromLog,
        data: IOrder,
        protected configService: ConfigService,
    ) {
        super({from: _assign({model: 'OrderHistoryItemModel'}, from)});

        OrderHistoryItemModel.userCurrency = this.configService
            .get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue()?.originalCurrency
            ?? this.configService.get<string>('$base.defaultCurrency');

        this.data = data;
    }

    public get id(): string {
        return this.data.ID;
    }

    public get idClient(): string {
        return this.data.IDClient;
    }

    public get idUser(): string {
        return this.data.IDUser;
    }

    public get idItem(): string {
        return this.data.IDItem;
    }

    public get idTransaction(): string {
        return this.data.IDTransaction;
    }

    public get statusCode(): number {
        return _toNumber(this.data.Status);
    }

    public get status(): string {
        return ordersStatuses.find((statusItem: IOrderStatus) => statusItem.code === this.statusCode).value;
    }

    public get addDate(): string {
        return GlobalHelper.toLocalTime(this.addDateSQL, 'SQL', 'DD-MM-YYYY HH:mm:ss');
    }

    public get addDateSQL(): string {
        return this.data.AddDate;
    }

    public get updated(): string {
        return this.data.Updated;
    }

    public get note(): string {
        return this.data.Note;
    }

    public get amount(): string {
        return Number(this.data.Amount).toFixed(0).toString();
    }

    public get amountExperience(): string {
        return Number(this.data.AmountExperience).toFixed(0).toString();
    }

    public get name(): string {
        return this.data.Name;
    }

    public get currencyPrice(): ICurrencyPrice | null {
        if (typeof this.data.PriceMoney === 'string') {
            return null;
        }

        return this.data.PriceMoney[OrderHistoryItemModel.userCurrency]
            ? {
                currency: OrderHistoryItemModel.userCurrency,
                price: +this.data.PriceMoney[OrderHistoryItemModel.userCurrency],
            } : {
                currency: 'EUR',
                price: +this.data.PriceMoney['EUR'],
            };
    }
}
