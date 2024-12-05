import {inject, Injectable} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';

import {
    IRefItem,
    IRefListQueryParams,
} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {IReferralsListCParams} from 'wlc-engine/modules/referrals/components/referrals-list/referrals-list.params';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';

export interface IReferralsListController {
    readonly referralsList$: BehaviorSubject<RefItemModel[]>;
    readonly totalProfitSum: number;
    readonly profitReferralsCount: number;
    init(params: IReferralsListCParams): void;
    fetchReferralsList(params: IRefListQueryParams): Promise<void>;
    updateReferralsList(isListExpanded: boolean): void;
};

@Injectable()
export class ReferralsListController implements IReferralsListController {
    public readonly referralsList$: BehaviorSubject<RefItemModel[]> = new BehaviorSubject(null);

    protected readonly referralsService: ReferralsService = inject(ReferralsService);

    private _rowsLimit: number;
    private _skipEmpty: boolean;
    private _isListExpanded: boolean = false;
    private _allReferrals: RefItemModel[] = [];
    private _profitReferrals: RefItemModel[] = [];
    private _totalProfitSum: number = 0;

    public get profitReferralsCount(): number {
        return this._profitReferrals.length || 0;
    }

    public get totalProfitSum(): number {
        return this._totalProfitSum;
    }

    public init({
        rowsLimit = 10,
        skipEmptyReferrals = false,
    }: IReferralsListCParams): void {
        this._rowsLimit = rowsLimit;
        this._skipEmpty = skipEmptyReferrals;
    }

    public updateReferralsList(isListExpanded: boolean): void {
        this._isListExpanded = isListExpanded;
        this.setReferralsList();
    }

    // @ts-ignore no-implicit-any #672571
    public async fetchReferralsList(params): Promise<void> {
        this.referralsList$.next(null);

        const refList: IRefItem[] = await this.referralsService.fetchRefList(params);

        this.processReferralsListResponse(refList);
    }

    private processReferralsListResponse(refList: IRefItem[]): void {
        this._profitReferrals.length = 0;
        this._allReferrals.length = 0;

        this._totalProfitSum = refList.reduce((acc: number, refItem: IRefItem) => {
            const referral = new RefItemModel(refItem);
            acc += referral.profit;

            if (referral.profit) {
                this._profitReferrals.push(referral);
            }

            this._allReferrals.push(referral);

            return acc;
        }, 0);

        this.setReferralsList();
    }

    private setReferralsList(): void {
        let referrals: RefItemModel[] = this._skipEmpty ? this._profitReferrals : this._allReferrals;

        if (!this._isListExpanded) {
            referrals = referrals.slice(0, this._rowsLimit);
        }

        this.referralsList$.next(referrals);
    }
}
