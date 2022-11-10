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
} from 'rxjs/operators';

import {DateTime} from 'luxon';
import _filter from 'lodash-es/filter';
import _orderBy from 'lodash-es/orderBy';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ConfigService,
    ActionService,
    DeviceType,
    ProfileType,
    SortDirection,
} from 'wlc-engine/modules/core';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/core/system/services/history-filter/history-filter.service';
import {
    TTournamentsFilter,
    IHistoryFilterValue,
} from 'wlc-engine/modules/core/system/interfaces/history-filter.interface';
import {
    TournamentHistory,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';
import {tournamentConfig} from 'wlc-engine/modules/core/system/config/history.config';

import * as Params from './tournaments-history.params';

@Component({
    selector: '[wlc-tournaments-history]',
    templateUrl: './tournaments-history.component.html',
    styleUrls: ['./styles/tournaments-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentsHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.ITournamentsHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams<TTournamentsFilter> = tournamentConfig.filterSelect;
    public tournaments$: BehaviorSubject<TournamentHistory[]> = new BehaviorSubject([]);
    protected filterValue: TTournamentsFilter = 'all';
    protected allTournaments: TournamentHistory[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentsHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected tournamentsService: TournamentsService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected configService: ConfigService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ITournamentsHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        const profileType: ProfileType = this.configService.get<ProfileType>('$base.profile.type') || 'default';
        await this.tournamentsService.queryTournaments(true, 'history');
        this.showFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        if (this.showFilter) {
            this.filterHandlers();
        }
        this.setSubscription();

        this.historyFilterService.setAllFilters('tournaments', {
            filterValue: this.filterValue,
        });
        this.tableData = {
            themeMod: profileType,
            head: Params.tournamentsHistoryTableHeadConfig,
            rows: this.tournaments$,
            switchWidth: profileType === 'first' ? 1200 : 1024,
        };

        this.tournaments$.next(this.tournamentsFilter());

        this.ready = true;
        this.cdr.detectChanges();
    }

    protected tournamentsFilter(): TournamentHistory[] {
        let result: TournamentHistory[] = this.allTournaments || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: TournamentHistory): boolean => {
                return item.status.toString() === this.filterValue;
            });
        }

        return _orderBy(
            result,
            (item: TournamentHistory): number => DateTime.fromSQL(item.end).toSeconds(),
            SortDirection.NewFirst,
        );
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('tournaments')
            .pipe(
                takeUntil(this.$destroy),
                filter(
                    (data: IHistoryFilterValue<TTournamentsFilter>): boolean => {
                        return !!data && this.filterValue !== data.filterValue;
                    },
                ),
            )
            .subscribe((data: IHistoryFilterValue<TTournamentsFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.tournaments$.next(this.tournamentsFilter());
            });

        this.tournamentsService.getObserver<TournamentHistory[]>('history')
            .pipe(takeUntil(this.$destroy))
            .subscribe((value: TournamentHistory[]): void => {
                this.allTournaments = value;
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
                takeUntil(this.$destroy),
                filter((filterValue: TTournamentsFilter): boolean => this.filterValue != filterValue),
            )
            .subscribe((filterValue: TTournamentsFilter): void => {
                this.historyFilterService.setFilter('tournaments', {
                    filterValue: this.filterValue = filterValue,
                });
                this.tournaments$.next(this.tournamentsFilter());
            });
    }
}
