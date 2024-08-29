import {Injectable} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    BehaviorSubject,
    skip,
    distinctUntilChanged,
} from 'rxjs';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

import {ISelectOptions, SelectValuesService} from 'wlc-engine/modules/core';
import {IReferralsListCParams} from 'wlc-engine/modules/referrals/components/referrals-list/referrals-list.params';

import {
    IRefDateFilter,
    IRefItem,
    IRefListQueryParams,
} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';

export interface IReferralsListController {
    filtersReady$: BehaviorSubject<boolean>;
    referralsList$: BehaviorSubject<RefItemModel[]>;
    totalProfitSum: number;
    monthsFilterItems: ISelectOptions[];
    yearFilterItems: ISelectOptions[];
    filterInterval: string;
    profitReferralsCount: number;
    currentMonth: string;
    currentYear: string;
    init(params: IReferralsListCParams): void;
    toggleRows(): void;
    getRefsList(skipEmpty: boolean, limit?: number): RefItemModel[];
    updateFilters(filter?: IRefDateFilter): void;
};

@Injectable()
export class ReferralsListController implements IReferralsListController {
    public filtersReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public referralsList$: BehaviorSubject<RefItemModel[]> = new BehaviorSubject(null);
    public totalProfitSum: number = 0;
    public monthsFilterItems: ISelectOptions[];
    public yearFilterItems: ISelectOptions[];
    public filterInterval: string;

    protected requestDateFormat: string = 'YYYY-MM-DD';
    protected visualDateFormat: string;
    protected queryParams$: BehaviorSubject<IRefListQueryParams> = new BehaviorSubject(null);

    private _currentMonth: string;
    private _currentYear: string;
    private _rowsLimit: number;
    private _skipEmpty: boolean;
    private _isExpanded: boolean = false;
    private _allReferrals: RefItemModel[] = [];
    private _profitReferrals: RefItemModel[] = [];

    constructor(
        protected readonly referralsService: ReferralsService,
        protected readonly selectValuesService: SelectValuesService,
    ) {
        this.queryParams$
            .pipe(
                skip(1),
                distinctUntilChanged(),
                takeUntilDestroyed(),
            ).subscribe((params: IRefListQueryParams) => {
                this.fetchReferralsList(params);
            });
    }

    public get profitReferralsCount(): number {
        return this._profitReferrals?.length || 0;
    }

    public get currentMonth(): string {
        return this._currentMonth;
    }

    public get currentYear(): string {
        return this._currentYear;
    }

    public init({
        rowsLimit = 10,
        skipEmptyReferrals = false,
        filterDateFormat = 'DD.MM.YYYY',
    }: IReferralsListCParams): void {
        this._rowsLimit = rowsLimit;
        this._skipEmpty = skipEmptyReferrals;
        this.visualDateFormat = filterDateFormat;

        this.prepareFilterData();
    }

    public toggleRows(): void {
        this._isExpanded = !this._isExpanded;

        this.updateReferralsList();
    }

    public getRefsList(skipEmpty: boolean = true, limit?: number): RefItemModel[] {
        const source: RefItemModel[] = skipEmpty ? this._profitReferrals : this._allReferrals;

        if (limit && source.length > limit) {
            return source.slice(0, limit);
        } else {
            return source;
        }
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
            const from: Dayjs = dayjs(`${this.currentYear}-${this.currentMonth}-01`);
            const to: Dayjs = from.endOf('month');

            this.filterInterval = `${from.format(this.visualDateFormat)} - ${to.format(this.visualDateFormat)}`;

            this.queryParams$.next({
                from: from.format(this.requestDateFormat),
                to: to.format(this.requestDateFormat),
            });
        }
    }

    /** Prepare options for date selects */
    protected prepareFilterData(): void {
        const monthsList: ISelectOptions[] = this.selectValuesService.getDateList('months').getValue();
        const currentMonth: number = dayjs().month() + 1;
        const yearsList: ISelectOptions[] = [];
        const currentYear: number = dayjs().year();

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

    protected async fetchReferralsList(params: IRefListQueryParams): Promise<void> {
        this.referralsList$.next(null);

        const data: IRefItem[] = await this.referralsService.fetchRefList(params);

        this._processReferralsListResponse(data);
    }

    protected updateReferralsList(): void {
        let source: RefItemModel[] = this._skipEmpty ? this._profitReferrals : this._allReferrals;

        if (!this._isExpanded) {
            source = source.slice(0, this._rowsLimit);
        }

        this.referralsList$.next(source);
    }

    private _processReferralsListResponse(data: IRefItem[]): void {
        const profitReferrals: RefItemModel[] = [];
        const allReferrals: RefItemModel[] = [];

        this.totalProfitSum = data.reduce((acc: number, item: IRefItem) => {
            const referral = new RefItemModel(item);
            acc += referral.profit;

            if (referral.profit) {
                profitReferrals.push(referral);
            }

            allReferrals.push(referral);

            return acc;
        }, 0);

        this._profitReferrals = profitReferrals;
        this._allReferrals = allReferrals;

        this.updateReferralsList();
    }
}
