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
} from 'wlc-engine/modules/core';
import {ProfileType} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services/history-filter/history-filter.service';
import {
    TTournamentsFilter,
    IFilterValue,
} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';
import {
    TournamentHistory,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';
import {tournamentConfig} from 'wlc-engine/modules/finances/system/config/history.config';

import * as Params from './tournaments-history.params';

@Component({
    selector: '[wlc-tournaments-history]',
    templateUrl: './tournaments-history.component.html',
    styleUrls: ['./styles/tournaments-history.component.scss'],
})
export class TournamentsHistoryComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public showFilter: boolean = false;
    public $params: Params.ITournamentsHistoryCParams;
    public tableData: ITableCParams;
    public filterSelect: ISelectCParams<TTournamentsFilter> = tournamentConfig.filterSelect;
    protected filterValue: TTournamentsFilter = 'all';
    protected tournaments$: BehaviorSubject<TournamentHistory[]> = new BehaviorSubject([]);
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
        this.setSubscription();

        this.historyFilterService.setDefaultFilter('tournaments', {
            filterValue: this.filterValue,
        });
        this.historyFilterService.setFilter('tournaments', {
            filterValue: this.filterValue,
        });
        this.tableData = {
            themeMod: profileType,
            noItemsText: gettext('No tournaments history'),
            head: Params.tournamentsHistoryTableHeadConfig,
            rows: this.tournaments$,
            switchWidth: profileType === 'first' ? 1200 : 1024,
        };

        this.tournaments$.next(this.tournamentsFilter());

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected tournamentsFilter(): TournamentHistory[] {
        let result: TournamentHistory[] = this.allTournaments || [];

        if (this.filterValue !== 'all') {
            result = _filter(result, (item: TournamentHistory): boolean => {
                return item.status.toString() === this.filterValue;
            });
        }

        return _orderBy(result, (item: TournamentHistory): number => DateTime.fromSQL(item.end).toSeconds(), 'desc');
    }

    protected setSubscription(): void {
        this.historyFilterService.getFilter('tournaments')
            .pipe(
                takeUntil(this.$destroy),
                filter(
                    (data: IFilterValue<TTournamentsFilter>): boolean => !!data && this.filterValue != data.filterValue,
                ),
            )
            .subscribe((data: IFilterValue<TTournamentsFilter>): void => {
                this.filterSelect.control.setValue(this.filterValue = data.filterValue);
                this.tournaments$.next(this.tournamentsFilter());
            });

        this.tournamentsService.getObserver<TournamentHistory[]>('history')
            .pipe(takeUntil(this.$destroy))
            .subscribe((value: TournamentHistory[]): void => {
                this.allTournaments = value;
            });

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

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.showFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });
    }
}
