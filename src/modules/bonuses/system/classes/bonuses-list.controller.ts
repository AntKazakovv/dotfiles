import {
    BehaviorSubject,
    Subject,
    Subscription,
} from 'rxjs';
import _filter from 'lodash-es/filter';
import _isObject from 'lodash-es/isObject';

import {
    IBonusesListCParams,
    IDepositBonusesCParams,
    IGameDashboardBonusesCParams,
} from 'wlc-engine/modules/bonuses/components';
import {
    BonusesFilterType,
    RestType,
    TBonusSortOrder,
} from 'wlc-engine/modules/bonuses/system/interfaces';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {ConfigService} from 'wlc-engine/modules/core';


export interface IBonusesListController {
    ready$: Subject<boolean>;
    bonuses$: BehaviorSubject<Bonus[]>;
    bonuses: Bonus[];
    destroy(): void;
    /** Common method for getting bonuses */
    getBonuses(params: IGetBonusesParams): void;
};

export interface IGetBonusesParams {
    subscribeParams: {
        useQuery: boolean;
        type: RestType;
    };
    filter: BonusesFilterType;
    sort?: TBonusSortOrder[];
    filterByGroup?: string;
}

export type TBonusesListParamsType = IBonusesListCParams | IDepositBonusesCParams | IGameDashboardBonusesCParams;

export class BonusesListController implements IBonusesListController {
    public ready$: Subject<boolean> = new Subject();
    public bonuses$: BehaviorSubject<Bonus[]> = new BehaviorSubject([]);
    public bonuses: Bonus[] = [];

    protected bonusesSubscription: Subscription;
    protected $destroy: Subject<void> = new Subject();

    constructor(
        protected bonusesService: BonusesService,
        protected configService: ConfigService,
    ) {}

    public getBonuses(params: IGetBonusesParams): void {
        this.ready$.next(false);

        const hasFilteredBonuses = this.bonusesService.hasFilteredBonuses(
            params.filter,
            params.subscribeParams.type);
        let bonusList: Bonus[] = [];

        this.bonusesSubscription = this.bonusesService.getSubscribe({
            ...params.subscribeParams,
            observer: {
                next: (bonuses: Bonus[]) => {
                    bonusList = _filter(bonusList, (bonus: Bonus) => _isObject(bonus));
                    bonusList = this.filterBonuses(bonuses, params.filter);

                    if (params.filterByGroup) {
                        bonusList = this.filterBonusesByGroup(bonusList, params.filterByGroup);
                    }

                    if (params.sort) {
                        bonusList = this.sortBonuses(bonusList, params.sort);
                    }

                    this.bonuses = bonusList;
                    this.bonuses$.next(bonusList);

                    if (hasFilteredBonuses) {
                        this.ready$.next(true);
                    }
                },
            },
            until: this.$destroy,
            ready$: !hasFilteredBonuses ? this.ready$ : null,
        });
    }

    private filterBonusesByGroup(bonuses: Bonus[], group: string): Bonus[] {
        let filtered: Bonus[] = [];

        if (group === 'Promo') {
            const isAuth: boolean = this.configService.get<boolean>('$user.isAuthenticated');

            filtered = _filter(bonuses, (bonus: Bonus): boolean =>
                bonus.data.Group === group && !bonus.hasPromoCode || bonus.showInPromotions(isAuth),
            );
        } else {
            filtered = _filter(bonuses, (bonus: Bonus): boolean =>
                bonus.data.Group === group);
        }

        return filtered;
    }

    public destroy(): void {
        this.bonusesSubscription?.unsubscribe();
        this.$destroy.next();
        this.$destroy.complete();
    }

    private filterBonuses(bonuses: Bonus[], filter: BonusesFilterType): Bonus[] {
        return this.bonusesService.filterBonuses(bonuses, filter);
    }

    private sortBonuses(bonuses, sortParams: TBonusSortOrder[]): Bonus[] {
        return this.bonusesService.sortBonuses(bonuses, sortParams);
    }
}
