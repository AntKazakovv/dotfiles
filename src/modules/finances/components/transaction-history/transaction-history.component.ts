import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
    takeWhile,
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
    ISelectCParams,
    HistoryFilterService,
    IHistoryFilter,
    TTransactionFilter,
} from 'wlc-engine/modules/core';
import {
    transactionConfig as config,
    startDate,
    endDate,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {ITransactionHistoryAlert} from 'wlc-engine/modules/finances/system/interfaces';

import * as Params from './transaction-history.params';

@Component({
    selector: '[wlc-transaction-history]',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./styles/transaction-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.ITransactionHistoryCParams;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    public transaction$: BehaviorSubject<Transaction[]> = new BehaviorSubject([]);
    public filterSelect: ISelectCParams<TTransactionFilter> = config.filterSelect;
    public alertConfig: ITransactionHistoryAlert;

    protected filterValue: TTransactionFilter = 'all';
    protected startDate: DateTime = DateTime.local();
    protected endDate: DateTime = DateTime.local();
    protected allTransactions: Transaction[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryCParams,
        cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        configService: ConfigService,
        protected actionService: ActionService,
        protected translateService: TranslateService,
    ) {
        super(
            <IMixedParams<Params.ITransactionHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.allTransactions = await this.financesService.getTransactionList();

        if (this.allTransactions.length) {
            this.startDate = DateTime.fromISO(_last(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
            this.endDate = DateTime.fromISO(_first(this.allTransactions).dateISO, {zone: 'utc'}).toLocal();
        }

        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }
        this.historyFilterService.setAllFilters('transaction', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.setMinMaxDate();
        this.setSubscription();

        this.alertConfig = this.configService.get<ITransactionHistoryAlert>('$finances.transactionHistoryAlert');

        this.transaction$.next(this.transactionFilter());
        this.prepareTableParams();
        this.ready = true;
        this.cdr.detectChanges();
    }

    protected prepareTableParams(): void {
        const profileType: ProfileType = this.configService.get<ProfileType>('$base.profile.type') || 'default';

        this.tableData = this.$params.tableConfig;
        this.tableData.themeMod ??= profileType;
        this.tableData.rows = this.transaction$;
        this.tableData.switchWidth ??= profileType === 'first' ? 1200 : 1024;
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
            alignSelectorRight: true,
        };
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('transaction')
            .pipe(
                filter((data: IHistoryFilter<TTransactionFilter>): boolean => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe((data: IHistoryFilter<TTransactionFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.startDateInput.control.setValue(this.startDate = data.startDate);
                this.endDateInput.control.setValue(this.endDate = data.endDate);
                this.setMinMaxDate();
                this.transaction$.next(this.transactionFilter());
                this.cdr.detectChanges();
            });

        this.filterHandlers();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }

    protected filterHandlers(): void {
        this.filterSelect.control.valueChanges
            .pipe(
                filter((filterValue: string): boolean => this.filterValue != filterValue),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: TTransactionFilter): void => {
                this.historyFilterService.setFilter('transaction', {filterValue: this.filterValue = filterValue});
                this.transaction$.next(this.transactionFilter());
                this.cdr.detectChanges();
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('transaction', {startDate: this.startDate = startDate});
                this.transaction$.next(this.transactionFilter());
                this.cdr.detectChanges();
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('transaction', {endDate: this.endDate = endDate});
                this.transaction$.next(this.transactionFilter());
                this.cdr.detectChanges();
            });

        this.eventService.filter(
            [
                {name: 'TRANSACTION_CANCEL'},
                {name: 'TRANSACTION_CONFIRM'},
                {name: 'TRANSACTION_CONFIRM_FAIL'},
            ],
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
                this.cdr.detectChanges();
            },
        });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }

    protected getAlertTitle(): string {
        return this.translateService.instant(gettext(this.alertConfig.title));
    }

    protected getAlertText(): string {
        return this.translateService.instant(gettext(this.alertConfig.text));
    }
}
