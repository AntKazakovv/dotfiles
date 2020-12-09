import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {ISelectParams} from 'wlc-engine/modules/core/components/select/select.params';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {ITableParams} from 'wlc-engine/modules/core/components/table/table.params';

import * as Params from './transaction-history.params';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DateTime} from 'luxon';

import {
    filter as _filter,
} from 'lodash';


@Component({
    selector: '[wlc-transaction-history]',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent extends AbstractComponent implements OnInit {

    public ready = false;
    public filterSelect: ISelectParams = {
        name: 'type',
        value: 'all',
        common: {
            placeholder: 'Type',
        },
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: 'All',
            },
            {
                value: 'deposit',
                title: 'Deposit',
            },
            {
                value: 'withdraw',
                title: 'Withdrawal',
            },
        ],
    };

    public $params: Params.ITransactionHistoryParams;

    public startDateInput: IInputCParams = {
        name: 'startDate',
        common: {
            placeholder: gettext('Start date'),
        },
        exampleValue: '__.__.____',
        control: new FormControl(''),
        validators: [
            {
                name: 'regExp',
                options: new RegExp('^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$'),
            },
        ],
    }

    public endDateInput: IInputCParams = {
        name: 'endDate',
        common: {
            placeholder: gettext('End date'),
        },
        exampleValue: '__.__.____',
        control: new FormControl(''),
    }

    protected transaction: BehaviorSubject<Transaction[]> = new BehaviorSubject([]);
    protected filterType: 'all' | 'deposit' | 'withdraw' = 'all';
    protected startDate: DateTime;
    protected endDate: DateTime;

    public tableData: ITableParams = {
        noItemsText: gettext('No transaction history'),
        head: Params.transactionTableHeadConfig,
        rows: this.transaction,
    };

    protected allTransactions: Transaction[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
    ) {
        super(
            <IMixedParams<Params.ITransactionHistoryParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.allTransactions = await this.financesService.getTransactionList();
        this.setMinMaxDate();

        this.transaction.next(this.filterTransaction());


        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.filterType = value;
            this.transaction.next(this.filterTransaction());
        });

        this.startDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.startDate = DateTime.fromFormat(value + ' 00:00:00', 'dd-MM-yyyy HH:mm:ss');
            this.transaction.next(this.filterTransaction());
        });

        this.endDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.endDate = DateTime.fromFormat(value + ' 23:59:59', 'dd-MM-yyyy HH:mm:ss');
            this.transaction.next(this.filterTransaction());
        });

        this.ready = true;
        this.cdr.markForCheck();
    }

    public setFilter(value: string): void {
        this.filterSelect.control.setValue(value);
    }

    protected filterTransaction(): Transaction[] {

        let result: Transaction[] = [];

        if (this.filterType === 'all') {
            result = this.allTransactions;
        } else {
            result = _filter(this.allTransactions,
                (item) => {
                    return (this.filterType === 'deposit') ? item.amount > 0 : item.amount < 0;
                });
        }

        result = _filter(result, (item) => {
            return item.date >= this.startDate && item.date <= this.endDate;
        });

        return result;
    }

    protected setMinMaxDate(): void {
        const dates = this.allTransactions.map((transaction) => transaction.date).sort();

        this.startDate = dates[0];
        this.endDate = dates[dates.length-1];

        this.startDateInput.control.setValue(this.startDate.toFormat('dd-MM-yyyy'));
        this.endDateInput.control.setValue(this.endDate.toFormat('dd-MM-yyyy'));
    }
}
