import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {DateTime} from 'luxon';

import _filter from 'lodash-es/filter';
import _last from 'lodash-es/last';
import _first from 'lodash-es/first';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IDatepickerCParams,
    ConfigService,
    ActionService,
    DeviceType,
    ProfileType,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {Transaction} from 'wlc-engine/modules/finances/system/models';
import {
    TTransactionFilter,
    IFinancesFilter,
    TTransactionFilterType,
} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';
import {
    transactionConfig as config,
    startDate,
    endDate,
} from 'wlc-engine/modules/finances/system/config/history.config';

import * as Params from './transaction-history.params';

@Component({
    selector: '[wlc-transaction-history]',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./styles/transaction-history.component.scss'],
})
export class TransactionHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.ITransactionHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: TTransactionFilterType = config.filterSelect;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    protected filterValue: TTransactionFilter = 'all';
    protected startDate: DateTime = DateTime.local();
    protected endDate: DateTime = DateTime.local();
    protected transaction$: BehaviorSubject<Transaction[]> = new BehaviorSubject([]);
    protected allTransactions: Transaction[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected configService: ConfigService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ITransactionHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        const profileType: ProfileType = this.configService.get<ProfileType>('$base.profile.type') || 'default';
        this.filterSelect = this.$params.filterType === 'select' ? config.filterSelect : config.filterRadioBtn;
        this.allTransactions = await this.financesService.getTransactionList();

        if (this.allTransactions.length) {
            this.startDate = DateTime.fromISO(_last(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
            this.endDate = DateTime.fromISO(_first(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
        }

        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;
        this.setMinMaxDate();
        this.setSubscription();

        this.historyFilterService.setDefaultFilter('transaction', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.historyFilterService.setFilter('transaction', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.tableData = {
            themeMod: profileType,
            noItemsText: gettext('No transactions history'),
            head: Params.transactionTableHeadConfig,
            rows: this.transaction$,
            switchWidth: profileType === 'first' ? 1200 : 1024,
        };

        this.transaction$.next(this.transactionFilter());
        this.ready = true;
        this.cdr.markForCheck();
    }

    protected transactionFilter(): Transaction[] {
        let result: Transaction[] = this.allTransactions || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: Transaction): boolean => {
                return (this.filterValue === 'deposit') ? item.amount > 0 : item.amount < 0;
            });
        }

        return _filter(result, (item: Transaction): boolean => {
            return DateTime.fromISO(item.dateISO, {zone: 'utc'}).toLocal() >= this.startDate
                && DateTime.fromISO(item.dateISO, {zone: 'utc'}).toLocal() <= this.endDate;
        });
    }

    protected setMinMaxDate(): void {
        const disableSince = this.endDate.plus({day: 1}).toObject();
        const disableUntil = this.startDate.minus({day: 1}).toObject();

        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);
        this.startDateInput.datepickerOptions = {
            disableSince: {
                year: disableSince.year,
                month: disableSince.month,
                day: disableSince.day,
            },
        };
        this.endDateInput.datepickerOptions = {
            disableUntil: {
                year: disableUntil.year,
                month: disableUntil.month,
                day: disableUntil.day,
            },
        };
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('transaction')
            .pipe(
                takeUntil(this.$destroy),
                filter((data: IFinancesFilter<TTransactionFilter>): boolean => !!data),
            )
            .subscribe((data: IFinancesFilter<TTransactionFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.startDateInput.control.setValue(this.startDate = data.startDate);
                this.endDateInput.control.setValue(this.endDate = data.endDate);
                this.setMinMaxDate();
                this.historyFilterService.dateChanges$.next({
                    startDate: this.startDate,
                    endDate: this.endDate,
                });
                this.transaction$.next(this.transactionFilter());
            });

        this.filterSelect.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((filterValue: string): boolean => this.filterValue != filterValue),
            )
            .subscribe((filterValue: TTransactionFilter): void => {
                this.historyFilterService.setFilter('transaction', {filterValue: this.filterValue = filterValue});
                this.transaction$.next(this.transactionFilter());
            });

        this.startDateInput.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((startDate: DateTime): boolean => this.startDate != startDate),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('transaction', {startDate: this.startDate = startDate});
                this.transaction$.next(this.transactionFilter());
            });

        this.endDateInput.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((endDate: DateTime): boolean => this.endDate != endDate),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('transaction', {endDate: this.endDate = endDate});
                this.transaction$.next(this.transactionFilter());
            });

        this.eventService.filter(
            {name: 'TRANSACTION_CANCEL'},
            this.$destroy,
        ).subscribe({
            next: async (): Promise<void> => {
                this.allTransactions = await this.financesService.getTransactionList();
                if (this.allTransactions.length) {
                    this.startDate = DateTime.fromISO(_last(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
                    this.endDate = DateTime.fromISO(_first(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
                }
                this.setMinMaxDate();
                this.transaction$.next(this.transactionFilter());
            },
        });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }
}
