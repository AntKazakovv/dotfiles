import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
    takeWhile,
} from 'rxjs/operators';
import {DateTime} from 'luxon';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ConfigService,
    ActionService,
    DeviceType,
    InjectionService,
    IDatepickerCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    TBonusFilter,
    bonusesConfig,
    HistoryService,
    HistoryFilterService,
    BonusHistoryItemModel,
    startDate,
    endDate,
    IHistoryFilter,
} from 'wlc-engine/modules/history';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';

import * as Params from './bonuses-history.params';
import {IBonusesHistoryRangeParams} from './bonuses-history.params';

@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public pending: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.IBonusesHistoryCParams;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    public filterSelect: ISelectCParams<keyof typeof TBonusFilter> = bonusesConfig.filterSelect;
    public bonuses$: BehaviorSubject<BonusHistoryItemModel[]> = new BehaviorSubject([]);
    public reportIntervalExceeded: boolean = false;

    protected filterValue: keyof typeof TBonusFilter = 'all';
    protected endDate: DateTime = DateTime.local().endOf('day');
    protected startDate: DateTime = this.endDate.minus({month: 1});
    protected allBonuses: BonusHistoryItemModel[] = [];
    protected historyFilterService: HistoryFilterService;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesHistoryCParams,
        cdr: ChangeDetectorRef,
        protected historyService: HistoryService,
        protected eventService: EventService,
        configService: ConfigService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IBonusesHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.allBonuses = await this.historyService.queryHistory(
            true,
            'bonusesHistory',
            this.startDate,
            this.endDate,
        );

        this.historyFilterService
            = await this.injectionService.getService<HistoryFilterService>('history.history-filter');

        this.setMinMaxDate();
        this.setSubscription();

        this.historyFilterService.setAllFilters('bonus', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });

        this.bonuses$.next(this.bonusesFilter());

        this.prepareTableParams();

        this.ready = true;
        this.cdr.markForCheck();
    }

    /**
     * Date range of bonus history
     */
    public get historyRangeParams(): IBonusesHistoryRangeParams {
        return this.$params.historyRangeParams;
    }

    /**
     * Info when bonus history haven't data
     */
    public get emptyConfig(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    /**
     *  Message when setting over 90 days range
     */
    public get rangeExceededConfig(): IWrapperCParams {
        return this.$params.rangeExceededConfig;
    }

    protected prepareTableParams(): void {
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.bonuses$;
        this.tableData.switchWidth ??= (this.configService.get('$base.profile.type') === 'first')
            ? 1200
            : 1024;
    }

    protected bonusesFilter(): BonusHistoryItemModel[] {
        let result: BonusHistoryItemModel[] = this.allBonuses || [];

        if (this.filterValue !== 'all') {
            result = result.filter((item: BonusHistoryItemModel): boolean => {
                return item.Status === this.filterValue;
            });
        }

        return result.filter((item: BonusHistoryItemModel) => {
            return DateTime.fromSQL(item.End).toLocal() >= this.startDate
                && DateTime.fromSQL(item.End).toLocal() <= this.endDate;
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
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;

                if (this.showFilter) {
                    this.filterHandlers();
                }

                this.cdr.markForCheck();
            });

        this.historyFilterService.getFilter('bonus')
            .pipe(
                filter((data: IHistoryFilter<keyof typeof TBonusFilter>): boolean => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter<keyof typeof TBonusFilter>): Promise<void> => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                const {startDate, endDate} = data;
                const datesChanged = (!startDate?.equals(this.startDate) || !endDate?.equals(this.endDate));

                if (datesChanged) {
                    this.startDateInput.control.setValue(data.startDate);
                    this.endDateInput.control.setValue(data.endDate);
                    await this.changeDateHandler(startDate, endDate);
                }

                this.setMinMaxDate();
                this.bonuses$.next(this.bonusesFilter());
                this.cdr.markForCheck();
            });

        this.filterHandlers();

        this.eventService.subscribe([
            {name: MultiWalletEvents.CurrencyConversionChanged},
        ], async (): Promise<void> => {
            this.historyService.queryHistory(
                true,
                'bonusesHistory',
                this.startDate,
                this.endDate,
            );
            this.bonuses$.next(this.bonusesFilter());
        }, this.$destroy);
    }

    protected filterHandlers(): void {
        this.filterSelect.control.valueChanges
            .pipe(
                filter((filterValue: keyof typeof TBonusFilter): boolean => this.filterValue !== filterValue),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: keyof typeof TBonusFilter): void => {
                this.historyFilterService.setFilter('bonus', {
                    filterValue: this.filterValue = filterValue,
                });
                this.bonuses$.next(this.bonusesFilter());
                this.cdr.markForCheck();
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => !this.startDate.equals(startDate)),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (startDate: DateTime): Promise<void> => {
                await this.changeDateHandler(startDate, this.endDate);
                this.pending = true;
                this.bonuses$.next(this.bonusesFilter());
                this.pending = false;
                this.cdr.markForCheck();
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => !this.endDate.equals(endDate)),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (endDate: DateTime): Promise<void> => {
                await this.changeDateHandler(this.startDate, endDate);
                this.pending = true;
                this.bonuses$.next(this.bonusesFilter());
                this.pending = false;
                this.cdr.markForCheck();
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }

    protected async changeDateHandler(startDate: DateTime, endDate: DateTime): Promise<void> {
        const isStartDateEarlier: boolean = startDate?.toMillis() < this.startDate.toMillis();
        const isEndDateLater: boolean = endDate?.toMillis() > this.endDate.toMillis();

        if (isStartDateEarlier && !isEndDateLater) {
            this.startDate = startDate;
        } else if (isEndDateLater && !isStartDateEarlier) {
            this.endDate = endDate;
        } else {
            this.startDate = startDate;
            this.endDate = endDate;
        }

        const newFilterValue: IHistoryFilter<keyof typeof TBonusFilter> = {
            startDate: startDate,
            endDate: endDate,
        };
        this.historyFilterService.setFilter('bonus', newFilterValue);
        const intervalExceeded: boolean = endDate.startOf('day').minus({days: 90}) > startDate;

        if ((isStartDateEarlier || isEndDateLater)
            || (intervalExceeded !== this.reportIntervalExceeded)) {
            this.pending = true;
            this.allBonuses = await this.historyService.queryHistory(
                true,
                'bonusesHistory',
                this.startDate,
                this.endDate,
            );
            this.reportIntervalExceeded = intervalExceeded;
            this.pending = false;
        }
    }
}
