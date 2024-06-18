import {
    Component,
    OnInit,
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
import toObject from 'dayjs/plugin/toObject';
dayjs.extend(toObject);

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ActionService,
    DeviceType,
    InjectionService,
    IDatepickerCParams,
    IWrapperCParams,
    ProfileType,
} from 'wlc-engine/modules/core';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/history/system/services/history-filter.service';
import {
    TTournamentsFilter,
    IHistoryFilter,
} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {TournamentHistory} from 'wlc-engine/modules/history';
import {
    endDate,
    startDate,
    tournamentConfig,
} from 'wlc-engine/modules/history/system/config/history.config';

import * as Params from './tournaments-history.params';

@Component({
    selector: '[wlc-tournaments-history]',
    templateUrl: './tournaments-history.component.html',
    styleUrls: ['./styles/tournaments-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentsHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public pending: boolean = false;
    public showFilter: boolean = false;
    public override $params: Params.ITournamentsHistoryCParams;
    public tableData: ITableCParams;
    public startDateInput: IDatepickerCParams = startDate;
    public endDateInput: IDatepickerCParams = endDate;
    public filterSelect: ISelectCParams<TTournamentsFilter> = tournamentConfig.filterSelect;
    public tournaments$: BehaviorSubject<TournamentHistory[]> = new BehaviorSubject([]);
    public reportIntervalExceeded: boolean = false;

    protected filterValue: TTournamentsFilter = 'all';
    protected endDate: Dayjs = dayjs().endOf('day');
    protected startDate: Dayjs = this.endDate.add(-1, 'month').startOf('day');
    protected allTournaments: TournamentHistory[] = [];
    protected tournamentsService: TournamentsService;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentsHistoryCParams,
        protected historyService: HistoryService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.ITournamentsHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.tournamentsService ??= await this.injectionService.getService('tournaments.tournaments-service');
        this.allTournaments = await this.historyService.queryHistory(
            true,
            'tournamentsHistory',
            this.startDate,
            this.endDate,
        );

        this.historyFilterService.setAllFilters('tournaments', {
            filterValue: this.filterValue,
            startDate: this.startDate,
            endDate: this.endDate,
        });

        this.setMinMaxDate();
        this.setSubscription();

        this.prepareTableParams();
        this.tournaments$.next(this.tournamentsFilter());

        this.ready = true;
        this.cdr.markForCheck();
    }

    /**
     * Date range of tournaments history
     */
    public get historyRangeParams(): Params.ITournamentsHistoryRangeParams {
        return this.$params.historyRangeParams;
    }

    /**
     *  Message when setting over 90 days range
     */
    public get rangeExceededConfig(): IWrapperCParams {
        return this.$params.rangeExceededConfig;
    }

    /**
     * Info when tournaments history haven't data
     */
    public get emptyConfig(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    protected prepareTableParams(): void {
        const profileType: ProfileType = this.configService.get<ProfileType>('$base.profile.type') || 'default';

        this.tableData = this.$params.tableConfig;
        this.tableData.themeMod ??= profileType;
        this.tableData.rows = this.tournaments$;
        this.tableData.switchWidth ??= profileType === 'first' ? 1200 : 1024;
    }

    protected tournamentsFilter(): TournamentHistory[] {
        let result: TournamentHistory[] = this.allTournaments || [];

        if (this.filterValue !== 'all') {
            result = result.filter((item: TournamentHistory): boolean => {
                return item.status.toString() === this.filterValue;
            });
        }

        return result.filter((item: TournamentHistory): boolean => {
            return dayjs(item.end).add(dayjs().utcOffset(), 'minute') >= this.startDate
                && dayjs(item.end).add(dayjs().utcOffset(), 'minute') <= this.endDate;
        });
    }

    protected setMinMaxDate(): void {
        const disableSince = this.endDate.toObject();
        const disableUntil = this.startDate.toObject();

        this.startDateInput.control.setValue(this.startDate);
        this.endDateInput.control.setValue(this.endDate);

        if (this.startDateInput.datepickerOptions) {
            this.startDateInput.datepickerOptions.minDate = new Date(
                disableSince.years,
                disableSince.months,
                disableSince.date,
            );

            this.startDateInput.datepickerOptions.maxDate = new Date(
                disableUntil.years,
                disableUntil.months,
                disableUntil.date,
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

        this.historyFilterService.getFilter('tournaments')
            .pipe(
                filter((data: IHistoryFilter<TTournamentsFilter>): boolean => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe(async (data: IHistoryFilter<TTournamentsFilter>): Promise<void> => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                const {startDate, endDate} = data;
                const datesChanged = (!startDate?.isSame(this.startDate) || !endDate?.isSame(this.endDate));

                if (datesChanged) {
                    this.startDateInput.control.setValue(data.startDate);
                    this.endDateInput.control.setValue(data.endDate);
                    await this.changeDateHandler(startDate, endDate);
                }

                this.setMinMaxDate();
                this.tournaments$.next(this.tournamentsFilter());
                this.cdr.markForCheck();
            });

        this.filterHandlers();

        this.eventService.subscribe([
            {name: MultiWalletEvents.CurrencyConversionChanged},
        ], async (): Promise<void> => {
            this.allTournaments = await this.historyService.queryHistory(
                true,
                'tournamentsHistory',
                this.startDate,
                this.endDate,
            );
            this.tournaments$.next(this.tournamentsFilter());
        }, this.$destroy);
    }

    protected filterHandlers(): void {
        this.filterSelect.control.valueChanges
            .pipe(
                filter((filterValue: TTournamentsFilter): boolean => this.filterValue !== filterValue),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: TTournamentsFilter): void => {
                this.historyFilterService.setFilter('tournaments', {
                    filterValue: this.filterValue = filterValue,
                });
                this.tournaments$.next(this.tournamentsFilter());
                this.cdr.markForCheck();
            });

        this.startDateInput.control.valueChanges
            .pipe(
                filter((startDate: Dayjs): boolean => !this.startDate.isSame(startDate)),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (startDate: Dayjs): Promise<void> => {
                await this.changeDateHandler(startDate, this.endDate);
                this.pending = true;
                this.tournaments$.next(this.tournamentsFilter());
                this.pending = false;
                this.cdr.markForCheck();
            });

        this.endDateInput.control.valueChanges
            .pipe(
                filter((endDate: Dayjs): boolean => !this.endDate.isSame(endDate)),
                takeWhile(() => this.showFilter),
                takeUntil(this.$destroy),
            )
            .subscribe(async (endDate: Dayjs): Promise<void> => {
                await this.changeDateHandler(this.startDate, endDate);
                this.pending = true;
                this.tournaments$.next(this.tournamentsFilter());
                this.pending = false;
                this.cdr.markForCheck();
            });

        this.eventService.filter(
            [
                {name: 'TOURNAMENT_TOP_SUCCEEDED'},
                {name: 'TOURNAMENT_TOP_FAILED'},
                {name: 'TOURNAMENT_LEAVE_SUCCEEDED'},
                {name: 'TOURNAMENT_LEAVE_FAILED'},
                {name: 'TOURNAMENT_JOIN_SUCCEEDED'},
                {name: 'TOURNAMENT_JOIN_FAILED'},
                {name: 'TOURNAMENT_USER_SUCCEEDED'},
                {name: 'TOURNAMENT_USER_FAILED'},
            ],
            this.$destroy,
        ).subscribe({
            next: async (): Promise<void> => {
                this.allTournaments = await this.historyService.queryHistory(
                    true,
                    'tournamentsHistory',
                    this.startDate,
                    this.endDate,
                );
                this.setMinMaxDate();
                this.tournaments$.next(this.tournamentsFilter());
                this.cdr.markForCheck();
            },
        });
    }

    protected async changeDateHandler(startDate: Dayjs, endDate: Dayjs): Promise<void> {
        const isStartDateEarlier: boolean = startDate.unix() < this.startDate.unix();
        const isEndDateLater: boolean = endDate.unix() > this.endDate.unix();

        if (isStartDateEarlier && !isEndDateLater) {
            this.startDate = startDate;
        } else if (isEndDateLater && !isStartDateEarlier) {
            this.endDate = endDate;
        } else {
            this.startDate = startDate;
            this.endDate = endDate;
        }

        const newFilterValue: IHistoryFilter<TTournamentsFilter> = {
            startDate: startDate,
            endDate: endDate,
        };
        this.historyFilterService.setFilter('tournaments', newFilterValue);
        const intervalExceeded: boolean = endDate.startOf('day').add(-90, 'day') > startDate;

        if ((isStartDateEarlier || isEndDateLater)
            || (intervalExceeded !== this.reportIntervalExceeded)) {
            this.pending = true;
            this.allTournaments = await this.historyService.queryHistory(
                true,
                'tournamentsHistory',
                this.startDate,
                this.endDate,
            );
            this.reportIntervalExceeded = intervalExceeded;
            this.pending = false;
        }
    }
}
