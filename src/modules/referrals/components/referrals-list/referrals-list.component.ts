import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    BehaviorSubject,
    distinctUntilChanged,
    map,
    merge,
    skip,
} from 'rxjs';

import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import minMaxPlugin from 'dayjs/plugin/minMax';

import {
    AbstractComponent,
    ISelectCParams,
    ISelectOptions,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {monthsArray} from 'wlc-engine/modules/core/system/constants/months.constant';

import {IRefDateFilterParam} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {
    IReferralsListController,
    ReferralsListController,
} from '../../system/classes/referrals-list.controller';

import * as Params from './referrals-list.params';

@Component({
    selector: '[wlc-referrals-list]',
    templateUrl: './referrals-list.component.html',
    styleUrls: ['./styles/referrals-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ReferralsListController],
})

export class ReferralsListComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IReferralsListCParams;

    public override $params: Params.IReferralsListCParams;
    public isListExpanded: boolean = false;
    public monthSelect: ISelectCParams<number>;
    public yearSelect: ISelectCParams<number>;
    public filterInterval: string;

    protected readonly controller: IReferralsListController = inject(ReferralsListController);

    private static readonly _refProgramStartYear: number = 2024;
    private readonly _currentYear: number = dayjs().year();
    private readonly _currentMonth: number = dayjs().month() + 1;
    private _selectedYear: number;
    private _selectedMonth: number;
    private _monthSelectOptionsBase: ISelectOptions<number>[];
    private _monthSelectOptions: ISelectOptions<number>[];
    private _yearSelectOptions: ISelectOptions<number>[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IReferralsListCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});

        this.prepareSelects();
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.controller.init(this.$params);

        this.setFilters();
    }

    public get monthProfit(): number {
        return this.controller?.totalProfitSum || 0;
    }

    public get profitReferralsCount(): number {
        return this.controller?.profitReferralsCount || 0;
    }

    public get showAllText(): string {
        return this.isListExpanded ? gettext('Show less') : gettext('Show all');
    }

    public get showMoreBtn(): boolean {
        return this.profitReferralsCount > this.$params.rowsLimit;
    }

    public get emptyDataConfig(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    public get referralsList$(): BehaviorSubject<RefItemModel[]> {
        return this.controller.referralsList$;
    }

    public toggleRowsExpansion(): void {
        this.isListExpanded = !this.isListExpanded;
        this.controller.updateReferralsList(this.isListExpanded);
    }

    /** Prepare options for date selects */
    protected prepareSelects(): void {
        dayjs.extend(minMaxPlugin);

        this._yearSelectOptions = Array.from(
            {length: this._currentYear - ReferralsListComponent._refProgramStartYear + 1},
            (_, i) => {
                const value = this._currentYear - i;
                return {value, title: value};
            })
            .reverse();

        this._selectedYear = this._currentYear;
        this.yearSelect = {
            name: 'years',
            updateOnControlChange: true,
            labelText: null,
            control: new UntypedFormControl(),
            items: this._yearSelectOptions,
            value: this._selectedYear,
        };

        this._monthSelectOptionsBase = monthsArray.map((title, index) => ({title, value: ++index}));
        this._monthSelectOptions = this._monthSelectOptionsBase.slice(0, this._currentMonth);
        this._selectedMonth = this._currentMonth;
        this.monthSelect = {
            name: 'months',
            updateOnControlChange: true,
            labelText: gettext('Report by month'),
            control: new UntypedFormControl(),
            items: this._monthSelectOptions,
            value: this._selectedMonth,
        };

        merge(
            this.yearSelect.control.valueChanges
                .pipe(
                    skip(1),
                    distinctUntilChanged(),
                    map((value: number): IRefDateFilterParam => ({field: 'year', value}))),
            this.monthSelect.control.valueChanges
                .pipe(
                    skip(1),
                    distinctUntilChanged(),
                    map((value: number): IRefDateFilterParam => ({field: 'month', value}))),
        )
            .pipe(
                takeUntilDestroyed())
            .subscribe((filterParams: IRefDateFilterParam): void => {
                this.updateFilters(filterParams);
            });
    }

    protected updateFilters(filterParams?: IRefDateFilterParam): void {
        switch(filterParams.field) {
            case 'month':
                this._selectedMonth = filterParams.value;
                break;
            case 'year':
                this._selectedYear = filterParams.value;

                if (this._selectedYear === this._currentYear) {
                    this._monthSelectOptions = this._monthSelectOptionsBase.slice(0, this._currentMonth);

                    if (this._selectedMonth > this._currentMonth) {
                        this._selectedMonth = this._currentMonth;
                        this.monthSelect.control.setValue(this._selectedMonth);
                        return;
                    }
                } else {
                    this._monthSelectOptions = this._monthSelectOptionsBase;
                }

                break;
        }

        this.setFilters();
    }

    protected setFilters(): void {
        const from: Dayjs = dayjs(`${this._selectedYear}-${this._selectedMonth}-01`);
        const to: Dayjs = dayjs.min(from.endOf('month'), dayjs());

        this.filterInterval =
            `${from.format(this.$params.filterDateFormat)} - ${to.format(this.$params.filterDateFormat)}`;

        this.monthSelect = {
            ...this.monthSelect,
            items: this._monthSelectOptions,
            value: this._selectedMonth,
        };
        this.yearSelect = {
            ...this.yearSelect,
            value: this._selectedYear,
        };

        this.controller.fetchReferralsList({from, to});
    }
}
