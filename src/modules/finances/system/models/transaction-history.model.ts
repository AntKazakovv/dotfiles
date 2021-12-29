import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {DateTime} from 'luxon';
import {IFromLog} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _isString from 'lodash-es/isString';
import _isUndefined from 'lodash-es/isUndefined';
import _find from 'lodash-es/find';

export interface ITransaction {
    Amount: number;
    Date: string;
    DateISO: string;
    ID: string;
    Note: string;
    Status: number | string;
    System: string;
    Canceled: boolean;
    AllowCancelation: string;
}

export interface ITransactionEx extends ITransaction {
    extendStatus?: ITransactionStatus;
    type?: 'Debit' | 'Credit'
}

export interface ITransactionRequestParams {
    endDate?: string;
    startDate?: string;
}

export interface ITransactionStatus {
    code: string;
    value: number;
    title: string;
}

export const unknownStatus: ITransactionStatus =
    {value: null, code: 'unknown', title: gettext('Unknown')};

export const transactionsStatuses: ITransactionStatus[] = [
    {value: -60, code: 'failed', title: gettext('Rejected')},
    {value: -55, code: 'canceled', title: gettext('Canceled by user')},
    {value: -50, code: 'rejected', title: gettext('Rejected')},
    {value: -90, code: 'rejected', title: gettext('Rejected')},
    {value: -91, code: 'rejected', title: gettext('Rejected')},
    {value: -10, code: 'canceled', title: gettext('Canceled')},
    {value: -5, code: 'error', title: gettext('Error')},
    {value: 0, code: 'new', title: gettext('New')},
    {value: 1, code: 'updated', title: gettext('Updated')},
    {value: 50, code: 'confirmed', title: gettext('Confirmed')},
    {value: 75, code: 'in-payment-queue', title: gettext('In payment queue')},
    {value: 95, code: 'pending', title: gettext('Pending')},
    {value: 99, code: 'finalize-failed', title: gettext('Finalize failed')},
    {value: 100, code: 'complete', title: gettext('Complete')},
    {value: 101, code: 'autopayment', title: gettext('Autopayment')},
    {value: 110, code: 'merchant-complete', title: gettext('Merchant complete')},
    unknownStatus,
];

export class Transaction extends AbstractModel<ITransactionEx> {

    private cancelProgress$: boolean = false;

    constructor(
        from: IFromLog,
        data: ITransaction,
    ) {
        super({from: _assign({model: 'Transaction'}, from)});
        this.data = data;
        this.setStatus(this.data.Status);
        this.data.type = this.amount < 0 ? 'Debit' : 'Credit';
    }

    public set cancelProgress(v: boolean) {
        this.cancelProgress$ = v;
    }

    public get cancelProgress(): boolean {
        return this.cancelProgress$;
    }

    public get amount(): number {
        return this.data.Amount;
    }

    public get date(): DateTime {
        return DateTime.fromISO(this.data.DateISO);
    }

    /**
     * Returns the date of the transaction in ISO format
     * 
     * @return {string} the date in ISO format
     */
    public get dateISO(): string {
        return this.data.DateISO;
    }

    public get initialDate(): string {
        return this.data.Date;
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get note(): string {
        return this.data.Note;
    }

    public get status(): ITransactionStatus {
        return this.data.extendStatus;
    }

    public get statusCode(): number {
        return _toNumber(this.data.Status);
    }

    public get system(): string {
        return this.data.System;
    }

    public get canceled(): boolean {
        return this.data.Canceled;
    }

    public get type(): 'Debit' | 'Credit' {
        return this.data.type;
    }

    public get allowCancelation(): boolean {
        return this.data.AllowCancelation === '1' && this.amount < 0 && this.statusCode !== 95;
    }

    public setStatus(status?: number | string): void {
        if (_isUndefined(status)) {
            this.data.Status = status;
        } else if (_isString(status)) {
            this.data.Status = _toNumber(status);
        }

        this.data.extendStatus =
            _find(transactionsStatuses, (status) => status.value === this.statusCode) || unknownStatus;
    }
}
