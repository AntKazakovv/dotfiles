import _reduce from 'lodash-es/reduce';
import {
    DateTime,
    Duration,
    Interval,
} from 'luxon';
import {
    BehaviorSubject,
    Subject,
    distinctUntilChanged,
    takeUntil,
} from 'rxjs';

import {ISelectOptions, SelectValuesService} from 'wlc-engine/modules/core';
import {IReferralsListCParams} from 'wlc-engine/modules/referrals/components/referrals-list/referrals-list.params';

import {
    IRefDateFilter,
    IRefItem,
    IRefListQueryParams,
} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';

export class ReferralsListController {
    public listReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public filtersReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public referralsList$: BehaviorSubject<RefItemModel[]> = new BehaviorSubject([]);
    public profitReferrals: RefItemModel[] = [];
    public totalProfitSum: number = 0;
    public monthsFilterItems: ISelectOptions[];
    public yearFilterItems: ISelectOptions[];
    public filterInterval: string;

    protected $destroy: Subject<void> = new Subject();
    protected requestDateFormat: string = 'yyyy-MM-dd';
    protected visualDateFormat: string;
    protected queryParams$: BehaviorSubject<IRefListQueryParams> = new BehaviorSubject(null);

    private _currentMonth: string;
    private _currentYear: string;
    private _rowsLimit: number;
    private _skipEmpty: boolean;
    private _isExpanded: boolean = false;

    private allReferrals: RefItemModel[] = [];

    constructor(
        protected referralsService: ReferralsService,
        protected selectValuesService: SelectValuesService,
        protected params: IReferralsListCParams,
    ) {
        this._rowsLimit = params.rowsLimit || 10;
        this._skipEmpty = params.skipEmptyReferrals || false;

        this.init();

        this.queryParams$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            ).subscribe((params: IRefListQueryParams) => {
                this.fetchReferralsList(params);
            });
    }

    public init(): void {
        this.visualDateFormat = this.params.filterDateFormat || 'dd.MM.yyyy';
        this.prepareFilterData();
    }

    public destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public get profitReferralsCount(): number {
        return this.profitReferrals?.length || 0;
    }

    public get currentMonth(): string {
        return this._currentMonth;
    }

    public get currentYear(): string {
        return this._currentYear;
    }

    public toggleRows(): void {
        this._isExpanded = !this._isExpanded;

        this.updateReferralsList();
    }

    public getRefsList(skipEmpty: boolean = true, limit?: number): RefItemModel[] {
        const source: RefItemModel[] = skipEmpty ? this.profitReferrals : this.allReferrals;

        if (limit && source.length > limit) {
            return source.slice(0, limit);
        } else {
            return source;
        }
    }

    /** Prepare options for date selects */
    protected prepareFilterData(): void {
        const monthsList: ISelectOptions[] = this.selectValuesService.getDateList('months').getValue();
        const currentMonth: number = DateTime.now().month;
        const yearsList: ISelectOptions[] = [];
        const currentYear: number = DateTime.now().year;

        for(let y = currentYear; y > 2020; y--) {
            yearsList.push({value: `${y}`, title: `${y}`});
        }

        this.monthsFilterItems = monthsList;
        this.yearFilterItems = yearsList;
        this._currentMonth = currentMonth.toString();
        this._currentYear = currentYear.toString();

        this.filtersReady$.next(true);

        this.updateFilters();
    }

    public updateFilters(filter?: IRefDateFilter): void {
        if (filter) {
            switch (filter.field) {
                case 'month':
                    this._currentMonth = filter.value;
                    break;
                case 'year':
                    this._currentYear = filter.value;
                    break;
            }
        }

        if (this.currentMonth && this.currentYear) {
            const interval = Interval.after(
                DateTime.fromObject({
                    year: +this._currentYear,
                    month: +this._currentMonth,
                    day: 1,
                }),
                Duration.fromObject({months: 1, days: -1}),
            );
            const from: DateTime = interval.start;
            const to: DateTime = interval.end;

            this.filterInterval = `${from.toFormat(this.visualDateFormat)} - ${to.toFormat(this.visualDateFormat)}`;

            this.queryParams$.next({
                from: from.toFormat(this.requestDateFormat),
                to: to.toFormat(this.requestDateFormat),
            });
        }
    }

    protected async fetchReferralsList(params: IRefListQueryParams): Promise<void> {
        this.listReady$.next(false);
        try {
            const data: IRefItem[] = await this.referralsService.fetchRefList(params);
            this.processReferralsListResponse(data);
        } catch (error) {
        } finally {
            this.listReady$.next(true);
        }
    }

    protected updateReferralsList(): void {
        let source: RefItemModel[] = this._skipEmpty ? this.profitReferrals : this.allReferrals;

        if (!this._isExpanded) {
            source = source.slice(0, this._rowsLimit);
        }

        this.referralsList$.next(source);
    }

    private processReferralsListResponse(data: IRefItem[]): void {
        const profitReferrals: RefItemModel[] = [];
        const allReferrals: RefItemModel[] = [];

        this.totalProfitSum = _reduce(data, (acc: number, item: IRefItem) => {
            const referral = new RefItemModel(item);
            acc += referral.profit;

            if (referral.profit) {
                profitReferrals.push(referral);
            }

            allReferrals.push(referral);

            return acc;
        }, 0);

        this.profitReferrals = profitReferrals;
        this.allReferrals = allReferrals;

        this.updateReferralsList();
    }
}
