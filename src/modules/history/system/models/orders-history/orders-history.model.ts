import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

import dayjs from 'dayjs';

import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';

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
    Name: string,
}

export interface IOrderStatus {
    code: number;
    value: string;
}

export const ordersStatuses: IOrderStatus[] = [
    {code: 99, value: gettext('Paid')},
    {code: 100, value: gettext('Ended')},
    {code: 1, value: gettext('Ordered')},
];

export class OrderHistoryItemModel extends AbstractModel<IOrder> {

    constructor(
        from: IFromLog,
        data: IOrder,
    ) {
        super({from: _assign({model: 'OrderHistoryItemModel'}, from)});
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
        return dayjs(this.data.AddDate).format('DD-MM-YYYY HH:mm:ss');
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
        return Number(this.data.Amount).toFixed(2).toString();
    }

    public get amountExperience(): string {
        return this.data.AmountExperience;
    }

    public get name(): string {
        return this.data.Name;
    }
}
