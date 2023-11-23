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
import _merge from 'lodash-es/merge';

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
} from 'wlc-engine/modules/core';
import {ITransactionHistoryAlert, financesConfig} from 'wlc-engine/modules/finances';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';

import {
    transactionConfig as config,
    startDate,
    endDate,
    IHistoryFilter,
    TTransactionFilter,
} from 'wlc-engine/modules/history';

import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';
import {Transaction} from 'wlc-engine/modules/history/system/models/transaction-history/transaction-history.model';

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
    public filterSelect: ISelectCParams<TTransactionFilter>;
    public alertConfig: ITransactionHistoryAlert;

    protected filterValue: TTransactionFilter = 'all';
    protected startDate: DateTime = DateTime.local();
    protected endDate: DateTime = DateTime.local();
    protected allTransactions: Transaction[] = [];
    protected transfersEnabled: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryCParams,
        cdr: ChangeDetectorRef,
        protected historyService: HistoryService,
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
        this.transfersEnabled = this.configService.get<boolean>('$base.profile.transfers.use');
        this.filterSelect = this.transfersEnabled ? config.filterSelectTransfer : config.filterSelect;
        this.allTransactions = await this.historyService.getTransactionList();

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

        this.alertConfig = _merge({}, financesConfig.transactionHistoryAlert,
            this.configService.get<ITransactionHistoryAlert>('$finances.transactionHistoryAlert'));

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
                switch (this.filterValue) {
                    case 'deposit':
                        return item.amount > 0;
                    case 'withdraw':
                        return item.amount < 0;
                    case 'transfer':
                        return item.system === 'Gift';
                }
            });
        }

        return _filter(result, (item: Transaction): boolean => {
            return DateTime.fromISO(item.dateISO, {zone: 'utc'}).toLocal() >= this.startDate
                && DateTime.fromISO(item.dateISO, {zone: 'utc'}).toLocal() <= this.endDate;
        });
    }

    protected setMinMaxDate(): void {
        const disableSince = this.endDate.toObject();
        const disableUntil = this.startDate.toObject();

        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);

        if (this.startDateInput.datepickerOptions) {
            this.startDateInput.datepickerOptions.minDate = new Date(
                disableSince.year,
                disableSince.month - 1,
                disableSince.day,
            );

            this.startDateInput.datepickerOptions.maxDate = new Date(
                disableUntil.year,
                disableUntil.month - 1,
                disableUntil.day,
            );
        }
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

        this.eventService.subscribe([
            {name: MultiWalletEvents.CurrencyConversionChanged},
        ], async (): Promise<void> => {
            this.allTransactions = await this.historyService.getTransactionList();
            this.transaction$.next(this.transactionFilter());
        }, this.$destroy);
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
                this.allTransactions = await this.historyService.getTransactionList();
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
