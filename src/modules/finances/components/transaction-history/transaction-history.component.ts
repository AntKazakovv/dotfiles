import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {DateTime} from 'luxon';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ISelectCParams,
    ITableCParams,
    IDatepickerCParams,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

import * as Params from './transaction-history.params';


import {
    filter as _filter,
    clone as _clone,
} from 'lodash-es';

@Component({
    selector: '[wlc-transaction-history]',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./styles/transaction-history.component.scss'],
})
export class TransactionHistoryComponent extends AbstractComponent implements OnInit {

    public ready = false;
    public filterSelect: ISelectCParams = {
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

    public $params: Params.ITransactionHistoryCParams;

    public startDateInput: IDatepickerCParams = {
        name: 'startDate',
        label: 'Start date',
        control: new FormControl(''),
    }

    public endDateInput: IDatepickerCParams = {
        name: 'endDate',
        label: 'End date',
        control: new FormControl(''),
    }

    protected transaction: BehaviorSubject<Transaction[]> = new BehaviorSubject([]);
    protected filterType: 'all' | 'deposit' | 'withdraw' = 'all';
    protected startDate: DateTime;
    protected endDate: DateTime;

    public tableData: ITableCParams = {
        noItemsText: gettext('No transactions history'),
        head: Params.transactionTableHeadConfig,
        rows: this.transaction,
    };

    protected allTransactions: Transaction[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
    ) {
        super(
            <IMixedParams<Params.ITransactionHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.allTransactions = await this.financesService.getTransactionList();
        this.setMinMaxDate();
        this.historyFilter();

        this.transaction.next(this.filterTransaction());

        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.filterType = value;
            this.transaction.next(this.filterTransaction());
        });

        this.startDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.startDate = value.set({hour: 0, minute: 0, second: 0});
            this.transaction.next(this.filterTransaction());
        });

        this.endDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.endDate = value.set({hour: 23, minute: 59, second: 59});
            this.transaction.next(this.filterTransaction());
        });

        this.eventService.filter(
            {name: 'TRANSACTION_CANCEL'},
            this.$destroy)
            .subscribe({
                next: async () => {
                    this.allTransactions = await this.financesService.getTransactionList();
                    this.transaction.next(this.filterTransaction());
                },
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

        this.historyFilterService.dateChanges$.next({
            startDate: this.startDate,
            endDate: this.endDate,
        });

        return result;
    }

    protected setMinMaxDate(min: boolean = true, max: boolean = true): void {
        const dates = this.allTransactions.map((transaction) => transaction.date).sort();

        if (min) {
            this.startDate = (dates[0] || DateTime.local()).startOf('day');
            this.startDateInput.control.setValue(this.startDate.toFormat('dd.LL.yyyy'));
            this.startDateInput = _clone(this.startDateInput);
        }

        if (max) {
            this.endDate = (dates[dates.length - 1] || DateTime.local()).endOf('day');
            this.endDateInput.control.setValue(this.endDate.toFormat('dd.LL.yyyy'));
            this.endDateInput = _clone(this.endDateInput);
        }

        this.cdr.detectChanges();
    }

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('transaction', {
            endDate: this.endDate,
            startDate: this.startDate,
        });

        this.historyFilterService.getFilter('transaction')
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data),
            )
            .subscribe((data) => {
                this.filterType = data.filterType;
                this.endDate = data.endDate;
                this.startDate = data.startDate;
                this.transaction.next(this.filterTransaction());
            });
    }
}
