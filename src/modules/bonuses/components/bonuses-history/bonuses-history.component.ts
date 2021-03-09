import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
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
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {HistoryItemModel} from 'wlc-engine/modules/bonuses/system/models/bonus-history-item.model';

import * as Params from './bonuses-history.params';

import {
    sortBy as _sortBy,
    map as _map,
    filter as _filter,
} from 'lodash-es';

@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready = false;

    public $params: Params.IBonusesHistoryCParams;

    public filterSelect: ISelectCParams = {
        name: 'status',
        value: 'all',
        common: {
            placeholder: 'Status',
        },
        control: new FormControl('all'),
        items: [
            {
                value: 'all',
                title: 'All',
            },
            {
                value: '-100',
                title: 'Expired',
            },
            {
                value: '-99',
                title: 'Canceled',
            },
            {
                value: '100',
                title: 'Wagered',
            },
        ],
    };

    protected bets: any = new BehaviorSubject([]);
    protected filterType: 'all' | '-100' | '-99' | '100' = 'all';

    public tableData: ITableCParams = {
        noItemsText: gettext('No bonuses history'),
        head: Params.betHistoryTableHeadConfig,
        rows: this.bets,
    };

    protected allBets: any[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusesHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.bonusesService.queryBonuses(true, 'history');
        this.bonusesService.getObserver('history').subscribe((value) => {
            this.allBets = _map(value, (item) => {
                return new HistoryItemModel(item);
            });
        });

        this.bets.next(this.filterTransaction());


        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.filterType = value;
            this.bets.next(this.filterTransaction());
        });

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected filterTransaction(): Transaction[] {

        let result: any[] = this.allBets || [];

        if (this.filterType !== 'all') {
            result = _filter(result, item => {
                return item.Status === this.filterType;
            });
        }

        result = _sortBy(result, (item) => {
            return DateTime.fromSQL(item.End).toSeconds();
        });

        return result;
    }
}
