import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged, skipWhile} from 'rxjs/operators';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    InjectionService,
    LogService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';

import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models/cashback-plan.model';
import {
    ICashbackPlan,
    ICashbackReward,
} from 'wlc-engine/modules/cashback/system/interfaces/cashback.interface';

@Injectable({
    providedIn: 'root',
})
export class CashbackService {

    public cashbackPlans: BehaviorSubject<CashbackPlanModel[]> = new BehaviorSubject([]);
    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    private $resolve: () => void;

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        protected logService: LogService,
    ) {
        this.init();
    }

    protected async init(): Promise<void> {
        this.setupCashbackRequest();

        this.configService
            .get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                distinctUntilChanged((prev: UserProfile, next: UserProfile): boolean => prev?.idUser === next?.idUser),
                skipWhile((profile) => profile === null),
            )
            .subscribe((profile: UserProfile) => {
                CashbackPlanModel.userCurrency = profile.originalCurrency;
                this.fetchCashback();
                this.$resolve();
            });
    }

    /**
     * Getting cashback plans
     *
     * @method fetchCashback
     * @returns {Promise<void>}
     */
    public async fetchCashback(): Promise<void> {

        try {
            const res: ICashbackPlan[] = await this.getCashbackPlan();
            const filteredPlans: ICashbackPlan[] = res.filter(el => !!el);
            this.cashbackPlans.next(filteredPlans.map((plan: ICashbackPlan): CashbackPlanModel => {
                return new CashbackPlanModel(
                    {
                        service: 'CashbackService',
                        method: 'init',
                    },
                    plan,
                    this.translateService.currentLang,
                );
            }));
        } catch (error) {
            this.cashbackPlans.next([]);
        }
    }

    /**
     * Cashback reward claim
     *
     * @method claimCashback
     * @param {string} id - cashback plan id
     * @returns {Promise<void>}
     */
    public async claimRewardById(id: string): Promise<ICashbackReward> {
        try {
            const response: IData<ICashbackReward> = await this.dataService.request({
                name: 'cashback',
                system: 'cashback',
                url: `/cashback/${id}`,
                type: 'POST',
                events: {
                    success: 'CASHBACK_CLAIM_SUCCESS',
                    fail: 'CASHBACK_CLAIM_FAILED',
                },
            });

            return response.data;
        } catch (error) {
            this.logService.sendLog({code: '17.3.1', data: error});
            throw error;
        }
    }

    protected async getCashbackPlan(): Promise<ICashbackPlan[]> {
        try {
            const response: IData<ICashbackPlan[]> = await this.dataService.request('cashback/cashback');
            return response.data;
        } catch (error) {
            this.logService.sendLog({code: '17.3.0', data: error});
            throw error;
        }
    }

    protected setupCashbackRequest(): void {
        this.dataService.registerMethod({
            name: 'cashback',
            system: 'cashback',
            url: '/cashback',
            type: 'GET',
        });
    }
}
