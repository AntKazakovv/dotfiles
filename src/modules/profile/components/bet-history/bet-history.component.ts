import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    takeUntil,
    takeWhile,
} from 'rxjs/operators';
import {DateTime} from 'luxon';

import _cloneDeep from 'lodash-es/cloneDeep';
import _filter from 'lodash-es/filter';
import _orderBy from 'lodash-es/orderBy';

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
    IHistoryFilter,
    betConfig,
    startDate,
    endDate,
    HistoryFilterService,
} from 'wlc-engine/modules/core';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';
import {BetService} from 'wlc-engine/modules/profile/system/services';

import * as Params from './bet-history.params';

@Component({
    selector: '[wlc-bet-history]',
    templateUrl: './bet-history.component.html',
    styleUrls: ['./styles/bet-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.IBetHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams = betConfig.filterSelect;
    public startDateInput: IDatepickerCParams = _cloneDeep(startDate);
    public endDateInput: IDatepickerCParams = _cloneDeep(endDate);
    public bets$: BehaviorSubject<IBet[]> = new BehaviorSubject([]);

    protected filterValue: 'all' | string = 'all';
    protected startDate: DateTime = DateTime.local().minus({month: 1});
    protected endDate: DateTime = DateTime.local();
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

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.getBets();

        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }

        this.setMinMaxDate();
        this.setSubscription();


        this.historyFilterService.setAllFilters('bet', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.tableData = {
            head: Params.betHistoryTableHeadConfig,
            rows: this.bets$,
            switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
        };

        this.bets$.next(this.betsFilter());
        this.ready = true;
        this.cdr.detectChanges();
    }

    /**
     * The method filters all bets.
     *
     * @method betsFilter
     * @returns {IBet[]} Returns the new array.
     */
    protected betsFilter(): IBet[] {
        if (this.filterValue === 'all') {
            return this.allBets.slice();
        }

        return _filter(this.allBets, (item: IBet): boolean => item.Merchant === this.filterValue);
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

    protected async getBets(): Promise<void> {
        const startDateUTC: DateTime = this.startDate.startOf('day').toUTC(),
            endDateUTC: DateTime = this.endDate.endOf('day').toUTC();

        this.allBets = await this.betService.getBetsList({
            startDate: startDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            endDate: endDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
        });

        this.allBets = _filter(this.allBets, (item: IBet): boolean => {
            const itemDateUTC: DateTime = DateTime.fromSQL(item.DateISO, {zone: 'utc'});
            return itemDateUTC >= startDateUTC && itemDateUTC <= endDateUTC;
        });

        this.allBets = _orderBy(this.allBets, ['DateISO'], 'desc');
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('bet')
            .pipe(
                filter((filter: IHistoryFilter) => !!filter),
                distinctUntilChanged((_: IHistoryFilter, curr: IHistoryFilter) => (
                    this.filterValue === curr.filterValue &&
                    this.startDate.equals(curr.startDate) &&
                    this.endDate.equals(curr.endDate)
                )),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter): Promise<void> => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);

                if (this.startDate.toMillis() !== data.startDate.toMillis()
                    || this.endDate.toMillis() !== data.endDate.toMillis()
                ) {
                    this.startDateInput.control.setValue(this.startDate = data.startDate);
                    this.endDateInput.control.setValue(this.endDate = data.endDate);
                    this.setMinMaxDate();
                    await this.getBets();
                }

                this.filterValue = data.filterValue;

                this.bets$.next(this.betsFilter());

                setTimeout(() => {
                    this.filterSelect.control.setValue(this.filterValue);
                    this.cdr.markForCheck();
                });
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
                this.historyFilterService.setFilter('bet', {
                    filterValue: this.filterValue = filterValue,
                });
                this.bets$.next(this.betsFilter());
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (startDate: DateTime): Promise<void> => {
                this.historyFilterService.setFilter('bet', {startDate: this.startDate = startDate});
                await this.getBets();
                this.bets$.next(this.betsFilter());
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (endDate: DateTime): Promise<void> => {
                this.historyFilterService.setFilter('bet', {endDate: this.endDate = endDate});
                await this.getBets();
                this.bets$.next(this.betsFilter());
            });
    }
}
