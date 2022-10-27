import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';

import {
    BehaviorSubject,
    Observable,
    Subscription,
    pipe,
} from 'rxjs';
import {
    takeUntil,
    filter,
    takeWhile,
    distinctUntilChanged,
    map,
} from 'rxjs/operators';
import {DateTime} from 'luxon';
import _each from 'lodash-es/each';
import _extend from 'lodash-es/extend';
import _filter from 'lodash-es/filter';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _map from 'lodash-es/map';
import _size from 'lodash-es/size';
import _unset from 'lodash-es/unset';
import _orderBy from 'lodash-es/orderBy';
import _reduce from 'lodash-es/reduce';
import _union from 'lodash-es/union';
import _unionBy from 'lodash-es/unionBy';
import _isNumber from 'lodash-es/isNumber';
import _find from 'lodash-es/find';
import _isEqual from 'lodash-es/isEqual';
import _isUndefined from 'lodash-es/isUndefined';
import _keys from 'lodash-es/keys';
import _forEach from 'lodash-es/forEach';

import {
    UserProfile,
    UserInfo,
} from 'wlc-engine/modules/user';
import {
    CachingService,
    ConfigService,
    DataService,
    EventService,
    IBonusesBalance,
    IData,
    IEvent,
    IForbidBanned,
    IFreeRound,
    IIndexing,
    InjectionService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {HistoryItemModel} from 'wlc-engine/modules/bonuses/system/models/bonus-history-item/bonus-history-item.model';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {
    ActionType,
    BonusesFilterType,
    TBonusSortOrder,
    IBonus,
    IGetSubscribeParams,
    IQueryParams,
    RestType,
    IBonusHistory,
    TBonusesHistory,
    ILootboxPrize,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';

type TUserLoyaltyInfo = Pick<UserInfo, 'bonusesBalance' | 'freeRounds'>;

interface IBonusesData extends IData {
    data?: IBonus[] | TBonusesHistory | ILootboxPrize[];
}

interface ISubjects {
    bonuses$: BehaviorSubject<Bonus[]>;
    active$: BehaviorSubject<Bonus[]>;
    store$: BehaviorSubject<Bonus[]>;
    history$: BehaviorSubject<HistoryItemModel[]>;
    lootboxPrizes$: BehaviorSubject<LootboxPrizeModel[]>;
}

interface IFreeRoundData {
    merch: string,
    games: string[],
    count: string,
    date: string,
}

@Injectable({
    providedIn: 'root',
})
export class BonusesService {
    public storeBonuses: Bonus[] = [];
    public promoBonus: Bonus = null;
    public dbPromoUrl: string = 'promocode';
    public bonuses: Bonus[] = [];

    protected activeBonuses: Bonus[] = [];
    protected historyBonuses: HistoryItemModel[] = [];
    protected lootboxPrizes: LootboxPrizeModel[] = [];
    protected gamesCatalogService: GamesCatalogService;
    protected promocodeFetchSubscriber: Subscription = {} as Subscription;
    protected promocodeFetchData: IData = {} as IData;

    private subjects: ISubjects = {
        bonuses$: new BehaviorSubject(null),
        active$: new BehaviorSubject(null),
        history$: new BehaviorSubject(null),
        lootboxPrizes$: new BehaviorSubject(null),
        store$: new BehaviorSubject(null),
    };

    private profile: UserProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private depEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
    private regEvents = ['deposit first', 'registration', 'verification'];

    private queryPromises: {
        [Property in RestType]: BehaviorSubject<boolean>;
    } = {
            active: new BehaviorSubject(false),
            history: new BehaviorSubject(false),
            lootboxPrizes: new BehaviorSubject(false),
            store: new BehaviorSubject(false),
            any: new BehaviorSubject(false),
        };

    constructor(
        private cachingService: CachingService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private translate: TranslateService,
        private stateService: StateService,
        private injectionService: InjectionService,
    ) {
        this.registerMethods();
        this.setSubscribers();

        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .subscribe((UserProfile) => {
                this.profile = UserProfile;
            });

        if (this.configService.get<boolean>('$base.finances.redirectAfterDepositBonus')) {
            this.configService
                .get<BehaviorSubject<UserInfo>>('$user.userInfo$')
                .pipe(
                    filter((userInfo: UserInfo): boolean => !!userInfo && this.hasBonuses),
                    map((userInfo: UserInfo): TUserLoyaltyInfo =>
                        ({bonusesBalance: userInfo.bonusesBalance, freeRounds: userInfo.freeRounds})),
                    distinctUntilChanged((
                        prev: {
                            bonusesBalance: UserInfo['bonusesBalance'],
                            freeRounds: UserInfo['freeRounds'],
                        },
                        curr: {
                            bonusesBalance: UserInfo['bonusesBalance'],
                            freeRounds: UserInfo['freeRounds'],
                        }): boolean => {
                        return (
                            _isEqual(curr.bonusesBalance, prev.bonusesBalance)
                            && _isEqual(curr.freeRounds, prev.freeRounds)
                        );
                    }),
                )
                .subscribe((userLoyaltyInfo: TUserLoyaltyInfo): void => {
                    this.checkNewActiveBonuses(userLoyaltyInfo.bonusesBalance, userLoyaltyInfo.freeRounds);
                });
        }
    }

    public get hasBonuses(): boolean {
        return !!this.bonuses.length;
    }

    /**
     * Check if bonuses with type and filter are exist
     * @param filter params for filtering
     * @param type bonuses type
     * @returns boolean
     */
    public hasFilteredBonuses(filter: BonusesFilterType, type: RestType = 'any'): boolean {
        let bonuses: Bonus[];

        switch (type) {
            case 'history':
                return !!this.subjects.history$.getValue()?.length;
            case 'lootboxPrizes':
                return !!this.subjects.lootboxPrizes$.getValue()?.length;
            case 'active':
                bonuses = this.subjects.active$.getValue();
                break;
            case 'store':
                bonuses = this.subjects.store$.getValue();
                break;
            default:
                bonuses = this.subjects.bonuses$.getValue();
                break;
        }

        return !!this.filterBonuses(bonuses, filter).length;
    }

    /**
     * Get lootbox prizes
     *
     * @param {Bonus} bonus - lootbox bonus
     * @returns {Promise<LootboxPrizeModel[]>}
     */
    public async getLootboxPrizes(bonus: Bonus): Promise<LootboxPrizeModel[]> {
        const lootboxPrizes: LootboxPrizeModel[] = await this.queryBonuses(false, 'lootboxPrizes');

        return _filter(lootboxPrizes, (prize: LootboxPrizeModel): boolean => {

            return _includes(bonus.value as number[], prize.id);
        });
    }

    /**
     * Get subscription from bonuses observer
     *
     * @param {IGetSubscribeParams} params params for subscription
     * @returns {Subscription} subscription
     */
    public getSubscribe(params: IGetSubscribeParams): Subscription {

        if (params.useQuery) {
            params.ready$?.next(false);
            const subj$ = this.queryPromises[params.type || 'any'];
            if (!subj$.getValue()) {
                this.queryBonuses(true, params.type || 'any')
                    .finally(() => params.ready$?.next(true));
            } else {
                subj$.pipe(takeWhile((v: boolean) => v))
                    .toPromise()
                    .finally(() => params.ready$?.next(true));
            }
        }

        return this.getObserver(params.type)
            .pipe(
                filter((v) => !!v),
                (params.until) ? takeUntil(params.until) : pipe(),
            ).subscribe(params.observer);
    }

    /**
     * Get bonuses observer from bonuses subjects by rest type
     *
     * @param {RestType} type bonuses rest type ('active' | 'history' | 'store' | 'any')
     * @returns {Observable<Bonus[]>} Observable
     */
    public getObserver<T extends HistoryItemModel | Bonus | LootboxPrizeModel>(type?: RestType): Observable<T[]> {
        let flow$: BehaviorSubject<(HistoryItemModel | Bonus | LootboxPrizeModel)[]>;

        switch (type) {
            case 'active':
                flow$ = this.subjects.active$;
                break;
            case 'history':
                flow$ = this.subjects.history$;
                break;
            case 'lootboxPrizes':
                flow$ = this.subjects.lootboxPrizes$;
                break;
            case 'store':
                flow$ = this.subjects.store$;
                break;
            default:
                flow$ = this.subjects.bonuses$;
                break;
        }

        return (flow$ as BehaviorSubject<T[]>).asObservable();
    }

    /**
     * Filter bonuses
     *
     * @param {Bonus[]} bonuses bonuses array
     * @param {BonusesFilterType} filter bonuses filter
     * ('all' | 'reg' | 'deposit' | 'promocode' | 'inventory' | 'main' | 'active' | 'default')
     * @returns {Bonus[]} filtered bonuses array
     */
    public filterBonuses(bonuses: Bonus[], filter: BonusesFilterType): Bonus[] {
        return _filter(bonuses, (bonus: Bonus) => {
            const status = bonus.status,
                active = bonus.active,
                allowCatalog = bonus.allowCatalog,
                selected = bonus.selected,
                hasPromoCode = bonus.hasPromoCode,
                inventoried = bonus.inventoried;

            if (!status) {
                return false;
            }

            switch (filter) {
                case 'all':
                    return (allowCatalog || (!allowCatalog && (selected || active)))
                        && (!hasPromoCode || selected || active || inventoried || this.isPromocodeEntered(bonus))
                        && (bonus.event !== 'store' || bonus.isActive);
                case 'deposit':
                    return (allowCatalog || (!allowCatalog && (selected || active)))
                        && (!hasPromoCode || selected || active || this.isPromocodeEntered(bonus))
                        && this.depEvents.indexOf(bonus.event) !== -1;
                case 'reg':
                    return (allowCatalog || (!allowCatalog && (selected || active)))
                        && (!hasPromoCode || selected || active || this.isPromocodeEntered(bonus))
                        && this.regEvents.indexOf(bonus.event) !== -1;
                case 'main':
                    return !active && (!hasPromoCode || selected || this.isPromocodeEntered(bonus))
                        && (allowCatalog || (!allowCatalog && selected))
                        && !inventoried;
                case 'promocode':
                    return hasPromoCode && !selected;
                case 'inventory':
                    return inventoried && !active;
                case 'active':
                    return bonus.isActive;
            }

            return true;
        });
    }

    /**
     * Get bonuses by promocode
     *
     * @param {string} code promocode
     * @returns {Bonus[]} bonuses array
     */
    public async getBonusesByCode(code: string): Promise<Bonus[]> {
        try {
            this.promocodeFetchSubscriber = this.eventService.subscribe([
                {name: 'BONUSES_BY_PROMO_FETCH_SUCCESS'},
                {name: 'BONUSES_BY_PROMO_FETCH_FAILED'},
            ], (data: IData) => {
                this.promocodeFetchData = data;
                this.promocodeFetchSubscriber.unsubscribe();
            });

            let bonusResult: Bonus[] = [];
            const bonuses: Bonus[] = await this.queryBonuses(false, undefined, code);

            _forEach(this.promocodeFetchData?.errors, (error: string): void => {
                throw error;
            });

            bonusResult = bonuses.filter((bonus: Bonus) => {
                return bonus.status == 1;
            });

            _each(bonusResult, (bonus: Bonus) => {
                bonus.data.PromoCode = code;
            });
            return bonusResult;
        } catch (error) {
            this.logService.sendLog({code: '10.0.2', data: error});
            throw error;
        }
    }

    /**
     * Get bonus by id
     *
     * @param {number} id bonus id
     * @returns {Bonus} bonus object
     */
    public async getBonus(id: number): Promise<Bonus> {
        try {
            const data: IData<IBonus> = await this.dataService.request({
                name: 'bonusById',
                system: 'bonuses',
                url: `/bonuses/${id}`,
                type: 'GET',
            });
            if (_isObject(data.data)) {
                try {
                    return new Bonus(
                        {service: 'BonusesService', method: 'getBonus'},
                        data.data,
                        this.configService,
                        this.cachingService,
                    );
                } catch (error) {
                    //
                }
            } else {
                this.logService.sendLog({code: '10.0.1', data: data.data});
            }
        } catch (error) {
            this.logService.sendLog({code: '10.0.1', data: error});
        }
    }

    /**
     * Subscribe bonus
     *
     * @param {Bonus} bonus bonus object
     * @param {boolean} showPush show success push message or not
     * @returns {Bonus} bonus object
     */
    public async subscribeBonus(bonus: Bonus, showPush: boolean = true): Promise<Bonus> {
        bonus.data.PromoCode = (bonus.id === this.promoBonus?.id) ? this.promoBonus.promoCode : '';
        const params = {ID: bonus.id, PromoCode: bonus.promoCode, Selected: 1};

        try {
            const response: IData = await this.dataService.request({
                name: 'bonusSubscribe',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'subscribe'),
                events: {
                    success: 'BONUS_SUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_SUBSCRIBE_FAILED',
                },
            }, params);

            if (showPush) {
                this.showSuccess(gettext('Bonus subscribe success'));
            }

            return response.data;
        } catch (error) {
            this.showError(error?.errors);
        }
    }

    /**
     * Unsubscribe bonus
     *
     * @param {Bonus} bonus bonus object
     * @returns {Bonus} bonus object
     */
    public async unsubscribeBonus(bonus: Bonus): Promise<Bonus> {
        const params = {ID: bonus.id, Selected: 0};

        try {
            const response: IData = await this.dataService.request({
                name: 'bonusSubscribe',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'unsubscribe'),
                events: {
                    success: 'BONUS_UNSUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_UNSUBSCRIBE_FAILED',
                },
            }, params);
            this.showSuccess(gettext('Bonus unsubscribe success'));
            return response.data;
        } catch (error) {
            this.showError(error?.errors);
        }
    }

    /**
     * Cancel bonus
     *
     * @param {Bonus} bonus bonus object
     * @returns {Bonus} bonus object
     */
    public async cancelBonus(bonus: Bonus): Promise<Bonus> {
        try {
            const response: IData = await this.dataService.request({
                name: 'bonusCancel',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'DELETE',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'cancel'),
                events: {
                    success: 'BONUS_CANCEL_SUCCEEDED',
                    fail: 'BONUS_CANCEL_FAILED',
                },
            });
            this.showSuccess(gettext('Bonus cancel success'));
            return response.data;
        } catch (error) {
            this.showError(error?.errors);
        }
    }

    /**
     * Take inventory bonus
     *
     * @param {Bonus} bonus bonus object
     * @returns {Bonus} bonus object
     */
    public async takeInventory(bonus: Bonus, emitDelay?: number): Promise<Bonus> {
        const params = {id: bonus.id, type: 'take'};
        try {
            const response: IData<Bonus> = await this.dataService.request<IData<Bonus>>({
                name: 'bonusTake',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'PUT',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'inventory'),
            }, params);

            if (emitDelay) {
                setTimeout((): void => {
                    this.eventService.emit({name: 'BONUS_TAKE_SUCCEEDED'});
                    this.showSuccess(gettext('Bonus take success'));
                }, emitDelay);
            } else {
                this.eventService.emit({name: 'BONUS_TAKE_SUCCEEDED'});
                this.showSuccess(gettext('Bonus take success'));
            }

            return response.data;
        } catch (error) {
            this.eventService.emit({name: 'BONUS_TAKE_FAILED'});
            this.showError(error?.errors);
        }
    }

    /**
     * Get bonuses
     *
     * @param {boolean} publicSubject is public rxjs subject from query
     * @param {RestType} type bonuses rest type ('active' | 'history' | 'store' | 'any') (no required)
     * @param {string} promoCode bonus promocode (no required)
     * @returns {Bonus[]} bonuses array
     */
    public async queryBonuses<T extends Bonus | HistoryItemModel | LootboxPrizeModel>(
        publicSubject: boolean,
        type: RestType = 'any',
        promoCode?: string,
    ): Promise<T[]> {
        this.queryPromises[type].next(true);
        const queryParams: IQueryParams = {};
        if (type) {
            if (type === 'active' || type === 'history' || type === 'lootboxPrizes') {
                queryParams.type = type;
            }
            if (type === 'store') {
                queryParams.event = type;
            }
        }

        if (promoCode) {
            queryParams.PromoCode = promoCode;
        }

        try {
            const res: IBonusesData = await this.dataService.request('bonuses/bonuses', queryParams);

            if (type === 'history') {
                this.historyBonuses = _map((res as IData<TBonusesHistory>).data,
                    (bonus: IBonusHistory): HistoryItemModel => {
                        return new HistoryItemModel({service: 'BonusesService', method: 'queryBonuses'}, bonus);
                    });

                if (publicSubject) {
                    this.subjects.history$.next(this.historyBonuses);
                }

                return this.historyBonuses as T[];
            }

            if (type === 'lootboxPrizes') {
                this.lootboxPrizes = _map(
                    (res as IData<ILootboxPrize[]>).data,
                    (bonus: ILootboxPrize): LootboxPrizeModel => {
                        return new LootboxPrizeModel(
                            {service: 'BonusesService', method: 'queryBonuses'},
                            bonus,
                            this.configService,
                        );
                    });

                if (publicSubject) {
                    this.subjects.lootboxPrizes$.next(this.lootboxPrizes);
                }

                return this.lootboxPrizes as T[];
            }

            const bonuses: Bonus[] = _orderBy(
                this.checkForbid(await this.modifyBonuses((res as IData<IBonus[]>).data), queryParams),
                'weight',
                'desc',
            );

            if (bonuses.length) {
                await this.checkBonusesInCache(bonuses);
                await this.checkExpiredBonusesInCache(bonuses);
                if (!queryParams.PromoCode && !this.promoBonus) {
                    await this.checkPromoBonus();
                }
            }

            switch (type) {
                case 'active':
                    if (publicSubject) {
                        this.subjects.active$.next(bonuses);
                    }
                    this.activeBonuses = bonuses;
                    break;
                case 'store':
                    if (publicSubject) {
                        this.subjects.store$.next(bonuses);
                    }
                    this.storeBonuses = bonuses;
                    break;
                default:
                    if (publicSubject) {
                        this.subjects.bonuses$.next(bonuses);
                    }
                    this.bonuses = bonuses;
                    break;
            }

            if (promoCode) {
                this.eventService.emit({
                    name: 'BONUSES_BY_PROMO_FETCH_SUCCESS',
                });
            }
            return bonuses as T[];
        } catch (error) {
            this.logService.sendLog({code: '10.0.0', data: error});

            if (!!promoCode) {
                this.eventService.emit({
                    name: 'BONUSES_BY_PROMO_FETCH_FAILED',
                    data: error as IData,
                });
            }

            this.eventService.emit({
                name: 'BONUSES_FETCH_FAILED',
                data: error,
            });
        } finally {
            this.queryPromises[type].next(false);
        }
    }

    public clearPromoBonus(): void {
        if (this.promoBonus) {
            this.cachingService.clear(this.dbPromoUrl);
            this.promoBonus = null;
        }
    }

    /**
     * Unchooses all bonuses
     * @returns {void}
     */
    public unchooseAllBonuses(): void {
        _each(this.bonuses, (bonus: Bonus): void => {
            bonus.isChoose = false;
        });
    }

    /**
     * Sorts bonuses according to sort order
     * @param {Bonus[]} bonuses bonuses array
     * @param {TBonusSortOrder[]} sortOrder bonuses order
     * @returns {Bonus[]} bonuses bonuses array
     */
    public sortBonuses(bonuses: Bonus[], sortOrder: TBonusSortOrder[]): Bonus[] {
        const result = _reduce(_union(sortOrder), (res: Bonus[], element: TBonusSortOrder): Bonus[] => {
            if (_isNumber(element)) {
                return _unionBy(res, [_find(bonuses, (bonus: Bonus): boolean => bonus.id === element)], 'id');
            }
            switch (element) {
                case 'active':
                    return _unionBy(res, _filter(bonuses, (bonus: Bonus): boolean => bonus.isActive), 'id');
                case 'inventory':
                    return _unionBy(res, _filter(bonuses, (bonus: Bonus): boolean => bonus.inventoried), 'id');
                case 'subscribe':
                    return _unionBy(res, _filter(
                        bonuses,
                        (bonus: Bonus): boolean => bonus.isSubscribed,
                    ), 'id');
                case 'promocode':
                    return _unionBy(res, _filter(bonuses, (bonus: Bonus): boolean => bonus.id === this.promoBonus?.id),
                        'id');
                default:
                    return _unionBy(res, bonuses, 'id');
            }
        }, []);

        return (result.length === bonuses.length)
            ? result : _unionBy(result, bonuses, 'id');
    }

    /**
     * Saves bonus with promo if promo exists in cache
     * @returns {Promise<void>}
     */
    public async checkPromoBonus(): Promise<void> {
        const promocode: string = await this.cachingService.get<string>(this.dbPromoUrl);

        if (!promocode) return;
        try {
            const bonuses: Bonus[] = await this.getBonusesByCode(promocode);

            if (bonuses.length) {
                this.promoBonus = bonuses[0];
            }
        } catch (error) {
            this.logService.sendLog({code: '10.0.2', data: error});
            throw error;
        }
    }

    private async modifyBonuses(data: IBonus[]): Promise<Bonus[]> {
        const queryBonuses: Bonus[] = [];

        if (data?.length) {
            for (const bonusData of data) {
                const bonus: Bonus = new Bonus(
                    {service: 'BonusesService', method: 'modifyBonuses'},
                    bonusData,
                    this.configService,
                    this.cachingService,
                );
                await bonus.setFromCache();
                await bonus.setExpiredFromCache();
                queryBonuses.push(bonus);
            }
        }
        return _filter(queryBonuses, (bonus: Bonus) => {
            return bonus.allowCatalog || (!bonus.allowCatalog && (bonus.selected || bonus.active));
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'bonuses',
            system: 'bonuses',
            url: '/bonuses',
            type: 'GET',
        });
    }

    private checkForbid(bonuses: Bonus[], queryParams: IQueryParams): Bonus[] {
        if (!bonuses.length) {
            return bonuses;
        }

        const userCategory: string = _get(this.profile, 'info.category', '').toLowerCase();
        const forbiddenCategories = this.configService.get<IIndexing<IForbidBanned>>('$loyalty.forbidBanned');
        if (
            (this.useForbidUserFields &&
                (
                    _get(this.profile, 'info.loyalty.ForbidBonuses') === '1' ||
                    _get(forbiddenCategories, `${userCategory}.forbidBonuses`, false)
                ) &&
                queryParams.type !== 'history')
        ) {
            bonuses = _filter(bonuses, (bonus: Bonus) => {
                return bonus.active || bonus.selected || bonus.inventoried;
            });
        }
        return bonuses;
    }

    private async checkBonusesInCache(bonuses: Bonus[]): Promise<void> {
        const bonusesIDs: number[] = _map(bonuses, 'id');
        let lsBonuses: IIndexing<number[]>;

        try {
            lsBonuses = await this.cachingService.get('bonuses') || {};
        } catch {
            lsBonuses = {};
        }

        _each(lsBonuses, (list: number[], key: string) => {

            if (!_isArray(list) || list.length === 0) {
                _unset(lsBonuses, key);
                return;
            }

            list = _filter(list, (bonusId: number) => _includes(bonusesIDs, bonusId));

            if (list.length === 0) {
                _unset(lsBonuses, key);
            }
        });

        if (_size(lsBonuses) !== 0) {
            this.cachingService.set<IIndexing<number[]>>('bonuses', lsBonuses, true, Number.MAX_SAFE_INTEGER);
        } else {
            this.cachingService.clear('bonuses');
        }
    }

    private async checkExpiredBonusesInCache(bonuses: Bonus[]): Promise<void> {
        const bonusesIDs: number[] = _map(bonuses, 'id');
        let expBonuses: IIndexing<number[]>;

        try {
            expBonuses = await this.cachingService.get('expired-bonuses') || {};
        } catch {
            expBonuses = {};
        }

        _each(expBonuses, (list: number[], key: string) => {

            if (!_isArray(list) || list.length === 0) {
                _unset(expBonuses, key);
                return;
            }

            list = _filter(list, (bonusId: number) => _includes(bonusesIDs, bonusId));

            if (list.length === 0) {
                _unset(expBonuses, key);
            }
        });

        if (expBonuses.expired && _size(expBonuses) === 0) {
            this.cachingService.clear('expired-bonuses');
        }
    }

    private isPromocodeEntered(bonus: Bonus): boolean {
        return bonus.id === this.promoBonus?.id;
    }

    private setSubscribers(): void {

        this.subjects.bonuses$.subscribe({
            next: (bonuses: Bonus[]): void => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.active$.subscribe({
            next: (bonuses: Bonus[]): void => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_ACTIVE_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.history$.subscribe({
            next: (bonuses: HistoryItemModel[]): void => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_HISTORY_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.lootboxPrizes$.subscribe({
            next: (bonuses: LootboxPrizeModel[]): void => {
                this.eventService.emit({
                    name: 'LOOTBOX_PRIZES_FETCH_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.store$.subscribe({
            next: (bonuses: Bonus[]): void => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_STORE_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.eventService.filter([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
            {name: 'PROFILE_UPDATE'},
            {name: 'BONUS_TAKE_SUCCEEDED'},
            {name: 'BONUS_CANCEL_SUCCEEDED'},
            {name: 'BONUS_SUBSCRIBE_SUCCEEDED'},
            {name: 'BONUS_UNSUBSCRIBE_SUCCEEDED'},
            {name: 'PROMO_SUCCESS'},
            {name: 'BONUS_REFRESH'},
        ]).subscribe({
            next: (event: IEvent<unknown>): void => {
                if (event.name === 'LOGIN' || event.name === 'LOGOUT') {
                    this.bonuses = [];
                    this.subjects.bonuses$.next([]);
                }
                this.updateSubscribers();
            },
        });

        this.eventService.subscribe([
            {name: 'LOGOUT'},
        ], (): void => {
            this.clearPromoBonus();
        });

        this.eventService.subscribe([
            {name: 'PROMO_SUCCESS'},
        ], (bonus: Bonus): void => {
            if (bonus) {
                this.promoBonus = bonus;
                this.cachingService.set(this.dbPromoUrl, this.promoBonus.promoCode, true, 24 * 60 * 60 * 100);
            }
        });

        this.translate.onLangChange.subscribe((): void => {
            this.updateSubscribers();
        });
    }

    private showError(errors: string[], title: string = gettext('Bonus error')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message: errors,
                wlcElement: 'notification_bonus-error',
            },
        });
    }

    private showSuccess(message: string | string[], title: string = gettext('Bonus success')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title,
                message,
                wlcElement: 'notification_bonus-success',
            },
        });
    }

    private async prepareBonusActionData(res: unknown, bonus: Bonus, actionType: ActionType): Promise<Bonus> {
        await bonus.addToCache(actionType);
        _extend(bonus.data, res);

        switch (actionType) {
            case 'inventory':
                bonus.data.Inventoried = 0;
                bonus.data.Active = 1;
                break;

            case 'subscribe':
                if (bonus.isInventory) {
                    bonus.data.Inventoried = 1;
                }
                break;

            case 'unsubscribe':
                if (bonus.isInventory) {
                    bonus.data.Inventoried = 0;
                }
                break;

            case 'cancel':
                bonus.data.Status = 0;
                break;
        }

        return bonus;
    }

    private updateSubscribers(): void {
        if (this.subjects.active$.observers.length > 1) {
            this.queryBonuses(true, 'active');
        }
        if (this.subjects.bonuses$.observers.length > 1) {
            this.queryBonuses(true, 'any');
        }
        if (this.subjects.store$.observers.length > 1) {
            this.queryBonuses(true, 'store');
        }
        if (this.subjects.history$.observers.length > 1) {
            this.queryBonuses(true, 'history');
        }
        if (this.subjects.lootboxPrizes$.observers.length > 1) {
            this.queryBonuses(true, 'lootboxPrizes');
        }
    }

    /**
     * Receives active bonuses and writes them to cache. Switches active bonuses, compares their differences
     * with what we received before the data update, if any, then updates them and shows a message with the bonus
     * balance. It also sorts through free spins and notifies you of their availability.
     *
     * @param {IIndexing<IBonusBalance>} bonusesBalance data about bonus balance from userInfo
     * @param {IFreeRound[]} freeRounds data about free rounds from userInfo
     *
     * @return {Promise<void>}
     */
    private async checkNewActiveBonuses(
        bonusesBalance: IIndexing<IBonusesBalance>,
        freeRounds: IFreeRound[],
    ): Promise<void> {
        const cacheDataBonusesLBID: string[] = await this.cachingService.get<string[]>('active-loyalty-bonuses') || [];
        const cacheDataFreeRounds: IFreeRoundData[] =
            await this.cachingService.get<IFreeRoundData[]>('freeround-games') || [];
        const activeBonusesLBID: string[] = _map(bonusesBalance, 'IDLoyaltyBonuses');

        if (!_isEqual(activeBonusesLBID, cacheDataBonusesLBID) && activeBonusesLBID.length) {
            _each(_keys(bonusesBalance), (bonusID: string): void => {
                const dataBonus: IBonusesBalance = bonusesBalance[bonusID];
                if (!_isUndefined(dataBonus.IDLoyaltyBonuses)
                    && !_includes(cacheDataBonusesLBID, dataBonus.IDLoyaltyBonuses)
                    && _find(this.bonuses, {id: +bonusID, isDeposit: true})) {
                    this.showMessageBonusBalance(dataBonus.Balance);
                }
            });
            await this.cachingService.set('active-loyalty-bonuses', activeBonusesLBID, true, Number.MAX_SAFE_INTEGER);
        }

        if (freeRounds) {
            const activeFreeRoundGames: IFreeRoundData[] =
                _map(freeRounds, (freeRound: IFreeRound): IFreeRoundData => {
                    return ({
                        merch: freeRound.IDMerchant,
                        games: freeRound.Games,
                        count: freeRound.Count,
                        date: freeRound.ExpireDate,
                    });
                });

            if (!this.gamesCatalogService) {
                this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
                await this.gamesCatalogService.ready;
            }

            _each(activeFreeRoundGames, (freeroundData: IFreeRoundData): void => {
                if (!_find(cacheDataFreeRounds, freeroundData) && +freeroundData.count) {
                    _each(freeroundData.games, (gameLaunchCode: string): boolean => {
                        const game: Game = this.gamesCatalogService.getGame(+freeroundData.merch, gameLaunchCode);
                        if (game) {
                            this.showMessageBonusFreeRound(freeroundData, game);
                            return false;
                        }
                    });
                }
            });
            await this.cachingService.set('freeround-games', activeFreeRoundGames, true, Number.MAX_SAFE_INTEGER);
        }
    }

    /**
     * It accepts a bonus balance and displays a corresponding message.
     *
     * @param {string} balance - accepts a bonus balance.
     *
     * @return {void}
     */
    private showMessageBonusBalance(balance: string): void {
        const currencyElement = `<span wlc-currency [value]="${balance}" `
            + `[currency]="'${this.profile.currency}'"></span>`;
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Bonus take success'),
                wlcElement: 'notification_bonus-activated',
                displayAsHTML: true,
                message: this.translate.instant(gettext('The bonus balance has been increased by'))
                    + ` ${currencyElement}`,
            },
        });
    }

    /**
     * It accepts the object of freerounds, finds their balance and displays the corresponding message.
     *
     * @param {IFreeRoundData} freeRound - freeRound data object.
     * @param {Game} game - game object.
     *
     * @return {void}
     */
    private showMessageBonusFreeRound(freeRound: IFreeRoundData, game: Game): void {
        const defaultTime = DateTime.fromSQL(freeRound.date);
        const offsetTime = defaultTime.plus({minutes: defaultTime.offset});

        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Bonus is available'),
                wlcElement: 'notification_bonus-freespins-game',
                themeMod: 'with-games',
                message: gettext('Free spins available: {{count}}\n Play until: {{date}}'),
                messageContext: {
                    count: freeRound.count,
                    date: offsetTime.setLocale(defaultTime.locale).toFormat('MM/dd/yyyy hh:mm:ss'),
                },
                image: {
                    src: game.image,
                },
                action: {
                    label: gettext('Play'),
                    onClick: (): void => {
                        this.stateService.go('app.gameplay', {
                            merchantId: game.merchantID,
                            launchCode: game.launchCode,
                        });
                    },
                },
            },
        });
    }
}
