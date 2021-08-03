import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ViewChild,
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
    DatepickerComponent,
    ISelectCParams, ConfigService,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {IBet} from 'wlc-engine/modules/finances/system/interfaces';

import * as Params from './bet-history.params';

import _clone from 'lodash-es/clone';
import _filter from 'lodash-es/filter';

@Component({
    selector: '[wlc-bet-history]',
    templateUrl: './bet-history.component.html',
    styleUrls: ['./styles/bet-history.component.scss'],
})
export class BetHistoryComponent extends AbstractComponent implements OnInit {

    @ViewChild('datepickerEndComponent') public datepickerEndComponent: DatepickerComponent;
    public ready = false;
    public $params: Params.IBetHistoryCParams;
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
    public filterSelect: ISelectCParams ={
        name: 'type',
        value: 'all',
        theme: 'vertical',
        common: {
            placeholder: gettext('Merchants'),
        },
        labelText: 'Merchants',
        control: new FormControl(''),
        options: 'merchants',
    };

    protected bets: BehaviorSubject<IBet[]> = new BehaviorSubject([]);
    protected startDate: DateTime = DateTime.now().minus({month: 1});
    protected endDate: DateTime = DateTime.now();

    public tableData: ITableCParams = {
        noItemsText: gettext('No bets history'),
        head: Params.betHistoryTableHeadConfig,
        rows: this.bets,
        switchWidth: (this.configService.get('$base.profile.type') === 'first') ? 1200 : 1024,
    };

    protected allBets: IBet[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IBetHistoryCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected historyFilterService: HistoryFilterService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IBetHistoryCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.allBets = await this.financesService.getBetsList({
            startDate: this.startDate.toFormat('y-LL-dd\'\T\'TT'),
            endDate: this.endDate.toFormat('y-LL-dd\'\T\'TT'),
        });

        this.historyFilter();
        this.setMinMaxDate();

        this.filterSelect = _clone(this.filterSelect);

        this.bets.next(this.filterTransaction());

        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.bets.next(this.filterTransaction());
        });

        this.startDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.startDate = value.set({hour: 0, minute: 0, second: 0});
            this.setDisableDate();
            this.bets.next(this.filterTransaction());
        });

        this.endDateInput.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((value) => {
            this.endDate = value.set({hour: 23, minute: 59, second: 59});
            this.bets.next(this.filterTransaction());
        });

        this.bets.subscribe(() => {
            this.historyFilterService.dateChanges$.next({
                startDate: this.startDate,
                endDate: this.endDate,
            });
        });

        this.ready = true;
        this.cdr.detectChanges();
    }

    protected filterTransaction(): IBet[] {

        let result: IBet[] = this.allBets || [];

        if (this.filterSelect.control.value && this.filterSelect.control.value !== 'all') {
            result = _filter(result, el => {
                return el.Merchant === this.filterSelect.control.value;
            });
        }

        result = _filter(result, (item) => {
            const iso = DateTime.fromSQL(item.DateISO).startOf('hours');
            return iso >= this.startDate.startOf('hours') && iso <= this.endDate.startOf('hours');
        });

        return result;
    }

    protected setMinMaxDate(): void {
        const dates = this.allBets.sort((bet, nextBet) => {
            return DateTime.fromSQL(bet.DateISO).toSeconds() - DateTime.fromSQL(nextBet.DateISO).toSeconds();
        });

        if (!dates.length) {
            return;
        }
        this.startDate = (DateTime.fromSQL(dates[0]?.DateISO) || DateTime.local()).startOf('day');
        this.endDate = (DateTime.fromSQL(dates[dates.length - 1]?.DateISO) || DateTime.local()).endOf('day');
        this.startDateInput.control.setValue(this.startDate.toFormat('dd.LL.yyyy'));
        this.endDateInput.control.setValue(this.endDate.toFormat('dd.LL.yyyy'));
        this.startDateInput = _clone(this.startDateInput);
        this.endDateInput = _clone(this.endDateInput);

        this.setDisableDate();
        this.cdr.detectChanges();
    }

    protected historyFilter(): void {
        this.historyFilterService.setDefaultFilter('bet', {
            endDate: this.endDate,
            startDate: this.startDate,
        });

        this.historyFilterService.getFilter('bet')
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data),
            )
            .subscribe((data) => {
                this.endDate = data.endDate;
                this.startDate = data.startDate;
                this.filterSelect.control.setValue(data.filterType);
                this.bets.next(this.filterTransaction());
            });
    }

    protected setDisableDate(): void {
        this.datepickerEndComponent.dp.options.disableUntil = {
            day: this.startDate.day,
            month: this.startDate.month,
            year: this.startDate.year,
        };
        this.datepickerEndComponent.dp.parseOptions(this.datepickerEndComponent.dp.options);
        this.cdr.markForCheck();
    }
}
