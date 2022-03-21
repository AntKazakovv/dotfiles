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

import _clone from 'lodash-es/clone';
import _filter from 'lodash-es/filter';
import _last from 'lodash-es/last';
import _first from 'lodash-es/first';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    ITableCParams,
    IDatepickerCParams,
    DatepickerComponent,
    ISelectCParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    FinancesService,
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services';
import {IBet} from 'wlc-engine/modules/finances/system/interfaces';

import * as Params from './bet-history.params';

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
    };

    public endDateInput: IDatepickerCParams = {
        name: 'endDate',
        label: 'End date',
        control: new FormControl(''),
    };

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
    protected startDate: DateTime = DateTime.utc().minus({month: 1}).startOf('day');
    protected endDate: DateTime = DateTime.utc().endOf('day');

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
            startDate: this.startDate.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            endDate: this.endDate.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
        });

        this.historyFilter();
        this.setMinMaxDate();

        this.filterSelect = _clone(this.filterSelect);

        this.bets.next(this.filterTransaction());

        this.filterSelect.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
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
            return DateTime.fromSQL(item.DateISO) >= this.startDate && DateTime.fromSQL(item.DateISO) <= this.endDate;
        });

        return result;
    }

    protected setMinMaxDate(): void {
        const dates = this.allBets.sort((bet, nextBet) => {
            return DateTime.fromSQL(nextBet.DateISO).toSeconds() - DateTime.fromSQL(bet.DateISO).toSeconds();
        });

        if (!dates.length) {
            return;
        }

        this.startDate = DateTime.fromSQL(_last(dates).DateISO);
        this.endDate = DateTime.fromSQL(_first(dates).DateISO);
        this.startDateInput.control.setValue(
            this.startDate.plus({minutes: this.startDate.offset}).startOf('day').toFormat('dd.LL.yyyy'));
        this.endDateInput.control.setValue(
            this.endDate.plus({minutes: this.startDate.offset}).endOf('day').toFormat('dd.LL.yyyy'));
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
                filter((data) => !!data),
                takeUntil(this.$destroy),
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
