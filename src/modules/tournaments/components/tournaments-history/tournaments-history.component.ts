import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {FormControl} from '@angular/forms';
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
    InjectionService,
} from 'wlc-engine/modules/core';
import {ProfileType} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services/history-filter/history-filter.service';
import {
    TournamentHistory,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';

import * as Params from './tournaments-history.params';

@Component({
    selector: '[wlc-tournaments-history]',
    templateUrl: './tournaments-history.component.html',
    styleUrls: ['./styles/tournaments-history.component.scss'],
})
export class TournamentsHistoryComponent extends AbstractComponent implements OnInit {
    public ready = false;

    public $params: Params.ITournamentsHistoryCParams;

    public filterSelect: ISelectCParams = {
        name: 'status',
        value: 'all',
        common: {
            placeholder: gettext('Status'),
        },
        theme: 'vertical',
        labelText: gettext('Status'),
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: gettext('All'),
            },
            {
                value: '0',
                title: gettext('Selected'),
            },
            {
                value: '1',
                title: gettext('Qualified'),
            },
            {
                value: '-99',
                title: gettext('Canceled'),
            },
            {
                value: '99',
                title: gettext('Ending'),
            },
            {
                value: '100',
                title: gettext('Ended'),
            },
        ],
    };

    public tableData: ITableCParams;

    protected tournaments: BehaviorSubject<TournamentHistory[]> = new BehaviorSubject([]);
    protected filterType: 'all' | '-99' | '99' | '100' | '0' | '1' = 'all';

    protected allTournaments: TournamentHistory[] = [];
    protected historyFilterService: HistoryFilterService;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentsHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected tournamentsService: TournamentsService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITournamentsHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
        this.init();
    }

    public init(): void {

        const profileType = this.configService.get<ProfileType>('$base.profile.type') || 'default';

        this.tableData = {
            themeMod: profileType,
            noItemsText: gettext('No tournaments history'),
            head: Params.tournamentsHistoryTableHeadConfig,
            rows: this.tournaments,
            switchWidth: profileType === 'first' ? 1200 : 1024,
        };
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        await this.tournamentsService.queryTournaments(true, 'history');
        this.historyFilterService = await this.injectionService
            .getService<HistoryFilterService>('finances.history-filter');
        this.tournamentsService.getObserver<TournamentHistory[]>('history')
            .subscribe((value) => {
                this.allTournaments = value;
            });

        this.tournaments.next(this.filterTransaction());

        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.filterType = value;
            this.tournaments.next(this.filterTransaction());
        });

        this.historyFilter();
        this.ready = true;
        this.cdr.markForCheck();
    }

    protected filterTransaction(): TournamentHistory[] {

        let result: TournamentHistory[] = this.allTournaments || [];

        if (this.filterType !== 'all') {
            result = _filter(result, item => {
                return item.status.toString() == this.filterType;
            });
        }

        return _orderBy(result, (item: TournamentHistory): number => DateTime.fromSQL(item.end).toSeconds(), 'desc');
    }

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('tournaments', {
            filterType: this.filterSelect.value,
        });

        this.historyFilterService.getFilter('tournaments')
            .pipe(
                filter((data) => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe((data) => {
                this.filterType = data.filterType;
                this.tournaments.next(this.filterTransaction());
            });
    }
}
