import {
    Component,
    OnInit,
    OnDestroy,
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
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _cloneDeep from 'lodash-es/cloneDeep';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ConfigService,
    ActionService,
    DeviceType,
    TSortDirection,
    IIndexing,
    IDatepickerCParams,
} from 'wlc-engine/modules/core';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';
import {IHistoryFilter} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {
    betConfig,
    startDate,
    endDate,
} from 'wlc-engine/modules/history/system/config/history.config';
import {Bet} from 'wlc-engine/modules/history/system/models';
import {BetService} from 'wlc-engine/modules/history/system/services/bet.service';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';

import * as Params from './bet-history.params';

@Component({
    selector: '[wlc-bet-history]',
    templateUrl: './bet-history.component.html',
    styleUrls: ['./styles/bet-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryComponent extends AbstractComponent implements OnInit, OnDestroy {

    public ready: boolean = false;
    public awaiting: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.IBetHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams = _cloneDeep(betConfig.filterSelect);
    public orderSelect: ISelectCParams = _cloneDeep(betConfig.orderSelect);
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public bets$: BehaviorSubject<Bet[]> = new BehaviorSubject([]);

    protected filterValue: 'all' | string = 'all';
    protected orderDirection: TSortDirection = 'desc';
    protected startDate: Dayjs = dayjs().add(-1, 'month');
    protected endDate: Dayjs = dayjs();
    protected readonly today: Dayjs = dayjs().endOf('day');
    protected allBets: Bet[] = [];

    private isMultiWallet: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IBetHistoryCParams,
        cdr: ChangeDetectorRef,
        protected betService: BetService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        configService: ConfigService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IBetHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }

        this.setMinMaxDate();

        this.historyFilterService.setAllFilters('bet', {
            filterValue: this.filterValue,
            orderDirection: this.orderDirection,
            startDate: this.startDate,
            endDate: this.endDate,
        });

        this.prepareTableParams();
        this.setSubscription();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.betService.resetData();
    }

    protected prepareTableParams(): void {
        this.tableData = this.$params.tableConfig;
        this.tableData.rows = this.bets$;
        this.tableData.switchWidth ??= this.configService.get('$base.profile.type') === 'first'
            ? 1200
            : 1024;
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

    /**
     * Push bets to table and show loader in process
     *
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<void>}
     */
    protected async pushNewBetsList(needRequest: boolean): Promise<void> {
        this.awaiting = true;
        this.bets$.next(await this.getBets(needRequest));
        this.awaiting = false;

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    /**
     * Get and filter bets
     *
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<Bet[]>}
     */
    protected async getBets(needRequest: boolean): Promise<Bet[]> {
        const bets = await this.betService.getBets(
            {
                endDate: this.endDate,
                startDate: this.startDate,
                orderDirection: this.orderDirection,
            },
            needRequest,
        );

        return this.filterBetsByMerchant(bets);
    }

    /**
     * Filter bets by merchant and push array to this.filteredBets$
     *
     * @param {Bet[]} bets
     *
     * @returns {Bet[]}
     */
    protected filterBetsByMerchant(bets: Bet[]): Bet[] {
        if (this.filterValue === 'all') {
            return bets;
        }

        return _filter(bets, (item: Bet): boolean => item.merchant === this.filterValue);
    }

    protected setSubscription(): void {
        this.eventService.subscribe({
            name: MultiWalletEvents.CurrencyConversionChanged,
        }, async (): Promise<void> => {
            this.bets$.next(await this.getBets(true));
        }, this.$destroy);

        this.historyFilterService.getFilter('bet')
            .pipe(
                filter((filter: IHistoryFilter) => !!filter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter): Promise<void> => {
                const changedData: IIndexing<boolean> = {
                    endDate: !!this.endDate.diff(data.endDate, 'day'),
                    startDate: !!this.startDate.diff(data.startDate, 'day'),
                    filterValue: this.filterValue !== data.filterValue,
                    orderDirection: this.orderDirection !== data.orderDirection,
                };

                if (this.ready && !_find(changedData, (value: boolean): boolean => value)) {
                    return;
                }

                const dateChange: boolean = this.isMultiWallet || changedData.startDate || changedData.endDate;

                if (dateChange) {
                    this.startDateInput.control.setValue(this.startDate = data.startDate);
                    this.endDateInput.control.setValue(this.endDate = data.endDate);
                    this.setMinMaxDate();
                }

                if (changedData.orderDirection) {
                    this.orderSelect.control
                        .setValue(this.orderDirection = data.orderDirection);
                }

                if (changedData.filterValue) {
                    this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                }

                this.pushNewBetsList(dateChange);
            });

        this.filterHandlers();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }

    protected filterHandlers(): void {
        this.filterSelect.control.valueChanges
            .pipe(
                filter((filterValue: string): boolean => this.filterValue !== filterValue),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),

            )
            .subscribe((filterValue: string): void => {
                this.historyFilterService.setFilter('bet', {filterValue});
            });

        this.orderSelect.control.valueChanges
            .pipe(
                filter((orderDirection: TSortDirection): boolean => this.orderDirection !== orderDirection),
                takeUntil(this.$destroy),
            )
            .subscribe((orderDirection: TSortDirection): void => {
                this.historyFilterService.setFilter('bet', {orderDirection});
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: Dayjs): boolean => this.startDate.unix() !== startDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: Dayjs): void => {
                this.historyFilterService.setFilter('bet', {startDate});
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: Dayjs): boolean => this.endDate.unix() !== endDate.unix()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: Dayjs): void => {
                this.historyFilterService.setFilter('bet', {endDate});
            });
    }
}
