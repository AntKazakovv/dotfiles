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
    IDatepickerCParams,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {BonusesService} from "wlc-engine/modules/bonuses/system/services";
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

import * as Params from './bonuses-history.params';

import {
    filter as _filter,
} from 'lodash-es';
import {IBonusesHistoryCParams} from "./bonuses-history.params";


@Component({
    selector: '[wlc-bonuses-history]',
    templateUrl: './bonuses-history.component.html',
    styleUrls: ['./styles/bonuses-history.component.scss'],
})
export class BonusesHistoryComponent extends AbstractComponent implements OnInit {

    public ready = false;

    public $params: Params.IBonusesHistoryCParams;

    public startDateInput: IDatepickerCParams = {
        name: 'startDate',
        label: 'Start date',
        control: new FormControl(''),
    }

    public endDateInput: IDatepickerCParams = {
        name: 'endDate',
        label: 'End date',
        control: new FormControl(''),
    }

    protected bets: any = new BehaviorSubject([]);
    protected startDate: DateTime = DateTime.now().minus({month: 1});
    protected endDate: DateTime = DateTime.now();

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
    )
    {
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
            this.allBets = value;
        });

        this.setMinMaxDate();
        this.historyFilter();

        this.bets.next(this.filterTransaction());


        this.startDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.startDate = value.set({hour: 0, minute: 0, second: 0});
            this.bets.next(this.filterTransaction());
        });

        this.endDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.endDate = value.set({hour: 23, minute: 59, second: 59});
            this.bets.next(this.filterTransaction());
        });

        this.ready = true;
        this.cdr.markForCheck();
    }

    protected filterTransaction(): Transaction[] {

        let result: any[] = this.allBets || [];
        result = _filter(result, (item) => {
            const iso = DateTime.fromSQL(item.DateISO).startOf('hours');
            return iso >= this.startDate.startOf('hours') && iso <= this.endDate.startOf('hours');
        });

        return result;
    }

    protected setMinMaxDate(): void {
        const dates = this.allBets.map((transaction) => transaction.DateISO).sort((a, b) => {
            return DateTime.fromSQL(a).diff(DateTime.fromSQL(b)).toObject().milliseconds;
        });
        this.startDate = DateTime.fromSQL(dates[0]).startOf('day');
        this.endDate = DateTime.fromSQL(dates[dates.length - 1]).endOf('day');
    }

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('bonus', {
            endDate: this.endDate,
            startDate: this.startDate,
        });

        this.historyFilterService.getFilter('bonus')
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data),
            )
            .subscribe((data) => {
                this.endDate = data.endDate;
                this.startDate = data.startDate;
                this.bets.next(this.filterTransaction());
            });
    }
}
