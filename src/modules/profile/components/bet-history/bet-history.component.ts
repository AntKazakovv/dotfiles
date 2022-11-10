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
import _cloneDeep from 'lodash-es/cloneDeep';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';


import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IDatepickerCParams,
    ISelectCParams,
    ConfigService,
    ActionService,
    DeviceType,
    HistoryFilterService,
    SortDirection,
    IIndexing,
    IHistoryFilter,
} from 'wlc-engine/modules/core';
import {
    betConfig,
    startDate,
    endDate,
} from 'wlc-engine/modules/core/system/config/history.config';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';
import {BetService} from 'wlc-engine/modules/profile/system/services/bet/bet.service';

import * as Params from './bet-history.params';

@Component({
    selector: '[wlc-bet-history]',
    templateUrl: './bet-history.component.html',
    styleUrls: ['./styles/bet-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public awaiting: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.IBetHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams = betConfig.filterSelect;
    public orderSelect: ISelectCParams = betConfig.orderSelect;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public bets$: BehaviorSubject<IBet[]> = new BehaviorSubject([]);

    protected filterValue: 'all' | string = 'all';
    protected orderValue: SortDirection = SortDirection.NewFirst;
    protected startDate: DateTime = DateTime.local().minus({month: 1});
    protected endDate: DateTime = DateTime.local().endOf('day');
    protected readonly today: DateTime = DateTime.local().endOf('day');
    protected allBets: IBet[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IBetHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected betService: BetService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected configService: ConfigService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IBetHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }

        this.setMinMaxDate();
        this.setSubscription();

        this.historyFilterService.setAllFilters('bet', {
            filterValue: this.filterValue,
            orderValue: this.orderValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.tableData = {
            head: Params.betHistoryTableHeadConfig,
            rows: this.bets$,
            switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
        };
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
     * @returns {Promise<IBet[]>}
     */
    protected async getBets(needRequest: boolean): Promise<IBet[]> {
        const bets = await this.betService.getBets(
            {
                endDate: this.endDate,
                startDate: this.startDate,
                orderValue: this.orderValue,
            },
            needRequest,
        );

        return this.filterBetsByMerchant(bets);
    }

    /**
     * Filter bets by merchant and push array to this.filteredBets$
     *
     * @param {IBet[]} bets
     * 
     * @returns {IBet[]}
     */
    protected filterBetsByMerchant(bets: IBet[]): IBet[] {
        if (this.filterValue === 'all') {
            return bets;
        }

        return _filter(bets, (item: IBet): boolean => item.Merchant === this.filterValue);
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('bet')
            .pipe(
                takeUntil(this.$destroy),
                filter((filter: IHistoryFilter) => !!filter),
            )
            .subscribe(async (data: IHistoryFilter): Promise<void> => {
                const changedData: IIndexing<boolean> = {
                    endDate: !this.endDate.equals(data.endDate),
                    startDate: !this.startDate.equals(data.startDate),
                    filterValue: this.filterValue !== data.filterValue,
                    orderValue: this.orderValue !== data.orderValue,
                };

                if (this.ready && !_find(changedData, (value: boolean): boolean => value)) {
                    return;
                }

                const dateChange: boolean = changedData.startDate || changedData.endDate;

                if (dateChange) {
                    this.startDateInput.control.setValue(this.startDate = data.startDate);
                    this.endDateInput.control.setValue(this.endDate = data.endDate);
                    this.setMinMaxDate();
                }

                if (changedData.orderValue) {
                    this.orderSelect.control
                        .setValue(this.orderValue = data.orderValue);
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
                takeUntil(this.$destroy),
                filter((orderValue: SortDirection): boolean => this.orderValue !== orderValue),
            )
            .subscribe((orderValue: SortDirection): void => {
                this.historyFilterService.setFilter('bet', {orderValue});
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((startDate: DateTime): void => {
                this.historyFilterService.setFilter('bet', {startDate});
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((endDate: DateTime): void => {
                this.historyFilterService.setFilter('bet', {endDate});
            });
    }
}
