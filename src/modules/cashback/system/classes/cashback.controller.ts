import {
    Subject,
    takeUntil,
} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core';
import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models/cashback-plan.model';
import {CashbackService} from 'wlc-engine/modules/cashback/system/services/cashback/cashback.service';
import {TCashbackType} from 'wlc-engine/modules/cashback/components/cashback-rewards/cashback-rewards.component';
import {ICashbackReward} from 'wlc-engine/modules/cashback';

export interface ICashbackController {
    cashbackType: TCashbackType;
    cashback$: Subject<CashbackPlanModel[]>;
    // @ts-ignore no-implicit-any #672571
    getComponentDestroy(Subject): void;
    getCashbackPlans(): void;
    fetchCashback(): Promise<void>;
    claimRewardById(id: string): Promise<ICashbackReward>;
}

export class CashbackController implements ICashbackController {

    public isCashbackDeposit: boolean;
    public readonly cashbackType: TCashbackType;
    public cashback$: Subject<CashbackPlanModel[]> = new Subject();

    constructor(
        protected configService: ConfigService,
        protected cashbackService: CashbackService,
        private componentDestroy: Subject<void>,

    ) {
        this.isCashbackDeposit = this.configService.get<boolean>('appConfig.siteconfig.CashbackPayoutByClaimButton');
        this.cashbackType = this.isCashbackDeposit ? 'deposit' : 'default';
    }

    public getComponentDestroy(destroy: Subject<void>): void {
        this.componentDestroy = destroy;
    }

    public async getCashbackPlans(): Promise<void> {
        await this.cashbackService.ready;
        this.cashbackService.cashbackPlans
            .pipe(takeUntil(this.componentDestroy))
            .subscribe((cashbackPlans: CashbackPlanModel[]): void => {
                this.cashback$.next(
                    cashbackPlans.filter((plan) => plan.type !== 'cron'),
                );
            });

        await this.fetchCashback();
    }

    public async fetchCashback(): Promise<void> {
        await this.cashbackService.fetchCashback();
    }

    public async claimRewardById(id: string): Promise<ICashbackReward> {
        return this.cashbackService.claimRewardById(id);
    }
}
