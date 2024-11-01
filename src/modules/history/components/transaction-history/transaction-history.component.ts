import {
    Component,
    OnInit,
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
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _union from 'lodash-es/union';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ActionService,
    DeviceType,
    ProfileType,
    ISelectCParams,
    IDatepickerCParams,
    ISelectOptions,
} from 'wlc-engine/modules/core';
import {ITransactionHistoryAlert, financesConfig} from 'wlc-engine/modules/finances';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';

import {
    transactionConfig as config,
    startDate,
    endDate,
    refCommissionFilterConfig,
    IHistoryFilter,
    TTransactionFilter,
} from 'wlc-engine/modules/history';

import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';
import {Transaction} from 'wlc-engine/modules/history/system/models/transaction-history/transaction-history.model';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

import * as Params from './transaction-history.params';

@Component({
    selector: '[wlc-transaction-history]',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./styles/transaction-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public pending: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.ITransactionHistoryCParams;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    public transaction$: BehaviorSubject<Transaction[]> = new BehaviorSubject([]);
    public filterSelect: ISelectCParams<TTransactionFilter>;
    public alertConfig: ITransactionHistoryAlert;
    public reportIntervalExceeded: boolean = false;

    protected filterValue: TTransactionFilter = 'all';
    protected endDate: Dayjs = dayjs().endOf('day');
    protected startDate: Dayjs = this.endDate.add(-1, 'month').startOf('day');
    protected allTransactions: Transaction[] = [];
    protected transfersEnabled: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionHistoryCParams,
        protected historyService: HistoryService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected actionService: ActionService,
        protected translateService: TranslateService,
    ) {
        super(
            <IMixedParams<Params.ITransactionHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.transfersEnabled = this.configService.get<boolean>('$base.profile.transfers.use');
        this.filterSelect = this.transfersEnabled ? config.filterSelectTransfer : config.filterSelect;

        if (this.configService.get<boolean>('appConfig.siteconfig.EnableRefferals')) {
            const items: ISelectOptions<TTransactionFilter>[] =
                _union(this.filterSelect.items, [refCommissionFilterConfig as ISelectOptions<TTransactionFilter>]);
            this.filterSelect.items = items;
        }

        this.allTransactions = await this.historyService.getTransactionList(
            {
                startDate: this.startDate,
                endDate: this.endDate,
            }, true);

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

    @CustomHook('history', 'historyTransactionFilter')
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
                    case 'commission':
                        return item.system === 'commission';
                }
            });
        }

        return _filter(result, (item: Transaction): boolean => {
            if (!item.dateISO) {
                return false;
            }
            return dayjs(item.dateISO, 'YYYY-MM-DDTHH:mm:ss').unix() >= this.startDate.unix()
                && dayjs(item.dateISO, 'YYYY-MM-DDTHH:mm:ss').unix() <= this.endDate.unix();
        });
    }

    protected setMinMaxDate(): void {
        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);

        if (this.startDateInput.datepickerOptions) {
            this.startDateInput.datepickerOptions.minDate = new Date(
                this.endDate.year(),
                this.endDate.month(),
                this.endDate.date(),
            );

            this.startDateInput.datepickerOptions.maxDate = new Date(
                this.startDate.year(),
                this.startDate.month(),
                this.startDate.date(),
            );
        }
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('transaction')
            .pipe(
                filter((data: IHistoryFilter<TTransactionFilter>): boolean => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter<TTransactionFilter>): Promise<void> => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                const {startDate, endDate} = data;
                const datesChanged = (
                    startDate?.unix() !== this.startDate.unix()
                    || endDate?.unix() !== this.endDate.unix()
                );
                if (datesChanged) {
                    this.startDateInput.control.setValue(data.startDate);
                    this.endDateInput.control.setValue(data.endDate);
                    await this.changeDateHandler(startDate, endDate);
                }

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
            this.allTransactions = await this.historyService.getTransactionList(
                {
                    startDate: this.startDate,
                    endDate: this.endDate,
                }, false);
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
                filter((startDate: Dayjs): boolean => this.startDate.unix() !== startDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (startDate: Dayjs): Promise<void> => {
                await this.changeDateHandler(startDate, this.endDate);
                this.pending = true;
                this.transaction$.next(this.transactionFilter());
                this.pending = false;
                this.cdr.detectChanges();
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: Dayjs): boolean => this.endDate.unix() !== endDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (endDate: Dayjs): Promise<void> => {
                await this.changeDateHandler(this.startDate, endDate);
                this.pending = true;
                this.transaction$.next(this.transactionFilter());
                this.pending = false;
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
                this.allTransactions = await this.historyService.getTransactionList(
                    {
                        startDate: this.startDate,
                        endDate: this.endDate,
                    }, true);
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

    protected async changeDateHandler(startDate: Dayjs, endDate: Dayjs): Promise<void> {
        const isStartDateEarlier: boolean = startDate?.unix() < this.startDate.unix();
        const isEndDateLater: boolean = endDate?.unix() > this.endDate.unix();

        if (isStartDateEarlier && !isEndDateLater) {
            this.startDate = startDate;
        } else if (isEndDateLater && !isStartDateEarlier) {
            this.endDate = endDate;
        } else {
            this.startDate = startDate;
            this.endDate = endDate;
        }

        const newFilterValue: IHistoryFilter<TTransactionFilter> = {startDate: startDate, endDate: endDate};
        this.historyFilterService.setFilter('transaction', newFilterValue);
        const intervalExceeded: boolean = endDate.startOf('day').add(-90, 'day') > startDate;

        if ((isStartDateEarlier || isEndDateLater)
            || (intervalExceeded !== this.reportIntervalExceeded)) {
            this.pending = true;
            this.allTransactions = await this.historyService.getTransactionList(
                {
                    startDate: this.startDate,
                    endDate: this.endDate,
                }, true);
            this.reportIntervalExceeded = intervalExceeded;
            this.pending = false;
        }
    }
}
