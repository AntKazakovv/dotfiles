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
    filter,
} from 'rxjs/operators';
import {DateTime} from 'luxon';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    ISelectCParams,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {HistoryItemModel} from 'wlc-engine/modules/bonuses/system/models/bonus-history-item.model';
import {IBonus} from 'wlc-engine/modules/bonuses';

import * as Params from './bonuses-history.params';

import _sortBy from 'lodash-es/sortBy';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';

@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready = false;

    public $params: Params.IBonusesHistoryCParams;

    public filterSelect: ISelectCParams = {
        name: 'bonuses',
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
        switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
    };

    protected allBets: any[] = [];
    protected historyFilterService: HistoryFilterService;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected bonusesService: BonusesService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IBonusesHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.historyFilterService = await this.injectionService
            .getService<HistoryFilterService>('finances.history-filter');
        await this.bonusesService.queryBonuses(true, 'history');
        this.bonusesService.getObserver<IBonus>('history').subscribe((value) => {
            this.allBets = _map(value, (item) => {
                return new HistoryItemModel({component: 'BonusesHistoryComponent', method: 'ngOnInit'}, item);
            });
        });

        this.bets.next(this.filterTransaction());


        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.filterType = value;
            this.bets.next(this.filterTransaction());
        });

        this.historyFilter();
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

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('bonus', {
            filterType: this.filterSelect.value,
        });

        this.historyFilterService.getFilter('bonus')
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data),
            )
            .subscribe((data) => {
                this.filterType = data.filterType;
                this.bets.next(this.filterTransaction());
            });
    }
}
