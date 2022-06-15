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
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {IBet} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {IFinancesFilter} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';
import {
    betConfig,
    startDate,
    endDate,
} from 'wlc-engine/modules/finances/system/config/history.config';

import * as Params from './bet-history.params';

@Component({
    selector: '[wlc-bet-history]',
    templateUrl: './bet-history.component.html',
    styleUrls: ['./styles/bet-history.component.scss'],
})
export class BetHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.IBetHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams = betConfig.filterSelect;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    protected filterValue: 'all' | string = 'all';
    protected startDate: DateTime = DateTime.local().minus({month: 1});
    protected endDate: DateTime = DateTime.local();
    protected bets$: BehaviorSubject<IBet[]> = new BehaviorSubject([]);
    protected allBets: IBet[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IBetHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
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
        this.setMinMaxDate();
        this.setSubscription();

        this.historyFilterService.dateChanges$.next({
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.historyFilterService.setDefaultFilter('bet', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.historyFilterService.setFilter('bet', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });
        this.tableData = {
            noItemsText: gettext('No bets history'),
            head: Params.betHistoryTableHeadConfig,
            rows: this.bets$,
            switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
        };

        this.bets$.next(this.betsFilter());
        this.ready = true;
        this.cdr.detectChanges();
    }

    protected betsFilter(): IBet[] {
        let result: IBet[] = this.allBets || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: IBet): boolean => item.Merchant === this.filterValue);
        }

        return _filter(result, (item: IBet): boolean => {
            return DateTime.fromSQL(item.DateISO, {zone: 'utc'}) >= this.startDate
                && DateTime.fromSQL(item.DateISO, {zone: 'utc'}) <= this.endDate;
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

    protected async getBets(): Promise<void> {
        this.allBets = await this.financesService.getBetsList({
            startDate: this.startDate.startOf('day').toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            endDate: this.endDate.endOf('day').toFormat('y-LL-dd\'\T\'HH:mm:ss'),
        });
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('bet')
            .pipe(
                takeUntil(this.$destroy),
                filter((data: IFinancesFilter): boolean => !!data),
            )
            .subscribe(async (data: IFinancesFilter): Promise<void> => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);

                if (this.startDate.toMillis() !== data.startDate.toMillis() ||
                    this.endDate.toMillis() !== data.endDate.toMillis()) {
                    this.startDateInput.control.setValue(this.startDate);
                    this.endDateInput.control.setValue(this.endDate);
                    this.setMinMaxDate();
                    await this.getBets();
                    this.historyFilterService.dateChanges$.next({
                        startDate: this.startDate,
                        endDate: this.endDate,
                    });
                }

                this.bets$.next(this.betsFilter());
            });

        this.filterSelect.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((filterValue: string): boolean => this.filterValue != filterValue),
            )
            .subscribe((filterType: string): void => {
                this.historyFilterService.setFilter('bet', {filterValue: this.filterValue = filterType});
                this.bets$.next(this.betsFilter());
            });

        this.startDateInput.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((startDate: DateTime): boolean => this.startDate.toMillis() !== startDate.toMillis()),
            )
            .subscribe(async (startDate: DateTime): Promise<void> => {
                this.historyFilterService.setFilter('bet', {startDate: this.startDate = startDate});
                this.historyFilterService.dateChanges$.next({
                    startDate: this.startDate,
                });
                await this.getBets();
                this.bets$.next(this.betsFilter());
            });

        this.endDateInput.control.valueChanges
            .pipe(
                takeUntil(this.$destroy),
                filter((endDate: DateTime): boolean => this.endDate.toMillis() !== endDate.toMillis()),
            )
            .subscribe(async (endDate: DateTime): Promise<void> => {
                this.historyFilterService.setFilter('bet', {endDate: this.endDate = endDate});
                this.historyFilterService.dateChanges$.next({
                    endDate: this.endDate,
                });
                await this.getBets();
                this.bets$.next(this.betsFilter());
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }
}
