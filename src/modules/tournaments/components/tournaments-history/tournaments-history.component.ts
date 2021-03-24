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

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {Tournament, TournamentsService} from 'wlc-engine/modules/tournaments';

import * as Params from './tournaments-history.params';

import {
    sortBy as _sortBy,
    filter as _filter,
} from 'lodash-es';

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

    protected tournaments: any = new BehaviorSubject([]);
    protected filterType: 'all' | '-99' | '99' | '100' | '0' | '1' = 'all';

    public tableData: ITableCParams = {
        noItemsText: gettext('No tournaments history'),
        head: Params.tournamentsHistoryTableHeadConfig,
        rows: this.tournaments,
    };

    protected allTournaments: Tournament[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentsHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected tournamentsService: TournamentsService,
    ) {
        super(
            <IMixedParams<Params.ITournamentsHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.tournamentsService.queryTournaments(true, 'history');
        this.tournamentsService.getObserver('history').subscribe((value) => {
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

    protected filterTransaction(): Tournament[] {

        let result: Tournament[] = this.allTournaments || [];

        if (this.filterType !== 'all') {
            result = _filter(result, item => {
                return item.status.toString() == this.filterType;
            });
        }

        result = _sortBy(result, (item) => {
            return DateTime.fromSQL(item.ends).toSeconds();
        });

        return result;
    }

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('tournaments', {
            filterType: this.filterSelect.value,
        });

        this.historyFilterService.getFilter('tournaments')
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data),
            )
            .subscribe((data) => {
                this.filterType = data.filterType;
                this.tournaments.next(this.filterTransaction());
            });
    }
}
