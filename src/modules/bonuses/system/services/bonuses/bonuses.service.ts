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
import _toNumber from 'lodash-es/toNumber';
import _find from 'lodash-es/find';
import _isEqual from 'lodash-es/isEqual';
import _isUndefined from 'lodash-es/isUndefined';
import _keys from 'lodash-es/keys';
import _forEach from 'lodash-es/forEach';
import _toString from 'lodash-es/toString';
import _pull from 'lodash-es/pull';

import {
    UserProfile,
    UserInfo,
} from 'wlc-engine/modules/user';
import {
    CachingService,
    ConfigService,
    DataService,
    EventService,
    ModalService,
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
    IRequestMethod,
} from 'wlc-engine/modules/core';
import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {
    ActionType,
    BonusesFilterType,
    TBonusSortOrder,
    IBonus,
    IGetSubscribeParams,
    IQueryParams,
    RestType,
    ILootboxPrize,
    IBonusCanceledInfo,
    RequestType,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';
import {BonusCancellationInfo} from '../../models/bonus/bonus-cancellation-info.model';
import {RequestParamsType} from 'wlc-engine/modules/core/system/services/data/data.service';

type TUserLoyaltyInfo = Pick<UserInfo, 'bonusesBalance' | 'freeRounds'>;

interface IBonusesData extends IData {
    data?: IBonus[] | ILootboxPrize[];
}

interface ISubjects {
    bonuses$: BehaviorSubject<Bonus[]>;
    active$: BehaviorSubject<Bonus[]>;
    store$: BehaviorSubject<Bonus[]>;
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
    public profile: UserProfile;

    protected activeBonuses: Bonus[] = [];
    protected lootboxPrizes: LootboxPrizeModel[] = [];
    protected gamesCatalogService: GamesCatalogService;
    protected promocodeFetchSubscriber: Subscription = {} as Subscription;
    protected promocodeFetchData: IData = {} as IData;

    private subjects: ISubjects = {
        bonuses$: new BehaviorSubject(null),
        active$: new BehaviorSubject(null),
        lootboxPrizes$: new BehaviorSubject(null),
        store$: new BehaviorSubject(null),
    };

    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private depEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
    private regEvents = ['deposit first', 'registration', 'verification'];

    private queryPromises: {
        [Property in RestType]: BehaviorSubject<boolean>;
    } = {
            active: new BehaviorSubject(false),
            lootboxPrizes: new BehaviorSubject(false),
            store: new BehaviorSubject(false),
            any: new BehaviorSubject(false),
        };

    private requests: RequestType[] = [];

    constructor(
        private cachingService: CachingService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
        private translateService: TranslateService,
        private stateService: StateService,
        private injectionService: InjectionService,
    ) {
        this.init();
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
    public getObserver<T extends Bonus | LootboxPrizeModel>(type?: RestType): Observable<T[]> {
        let flow$: BehaviorSubject<(Bonus | LootboxPrizeModel)[]>;

        switch (type) {
            case 'active':
                flow$ = this.subjects.active$;
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
            const {allowCatalog, selected, active, status, inventoried, hasPromoCode, isStoreEvent} = bonus;

            if (!status) {
                return false;
            }

            switch (filter) {
                case 'all':
                    return this.isCatalogAllowOrSelectedOrActive(bonus)
                        && (this.isNotPromoOrSelectedOrActive(bonus) || inventoried || this.isPromocodeEntered(bonus))
                        && (!isStoreEvent || bonus.isActive || inventoried);
                case 'deposit':
                    return this.isCatalogAllowOrSelectedOrActive(bonus)
                        && (this.isNotPromoOrSelectedOrActive(bonus) || this.isPromocodeEntered(bonus))
                        && (this.depEvents.indexOf(bonus.event) !== -1 && !inventoried);
                case 'reg':
                    return this.isCatalogAllowOrSelectedOrActive(bonus)
                        && (this.isNotPromoOrSelectedOrActive(bonus) || this.isPromocodeEntered(bonus))
                        && this.regEvents.indexOf(bonus.event) !== -1
                        && !bonus.showOnly;
                case 'main':
                    return !active && (!hasPromoCode || selected || this.isPromocodeEntered(bonus))
                        && (allowCatalog || selected)
                        && !inventoried;
                case 'promocode':
                    return hasPromoCode && !selected;
                case 'inventory':
                    return inventoried && !active;
                case 'active':
                    return bonus.isActive;
                case 'united':
                    return !active && (allowCatalog || selected || inventoried)
                        && (this.isNotPromoOrSelectedOrActive(bonus) || inventoried || this.isPromocodeEntered(bonus))
                        && (!isStoreEvent || inventoried);
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

            const bonuses: Bonus[] = await this.queryBonuses(false, undefined, code);
            let bonusResult: Bonus[] = [];

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
     * Subscribes bonus with promocode from URL
     *
     * @param {IIndexing<string>} promoCode
     * @returns {Promise<void>}
     */
    public async processPromocode(promoCode: string): Promise<void> {
        const promocodeCacheKey: string = this.dbPromoUrl;

        await this.configService.ready;
        await this.cachingService.set<string>(
            promocodeCacheKey,
            promoCode,
            true,
            7 * 24 * 60 * 60 * 1000, // 7 days
        );

        try {
            await this.checkPromoBonus();

            if (await this.cachingService.get(promocodeCacheKey)) {
                if (this.promoBonus) {
                    if (this.configService.get<boolean>('$user.isAuthenticated')) {
                        const bonus: Bonus = await this.subscribeBonus(this.promoBonus, false);
                        if (bonus) {

                            switch (bonus.event) {
                                case 'sign up':
                                case 'registration':
                                case 'verification':
                                    this.modalService.showModal('promoSuccess', {
                                        title: gettext('Bonus success'),
                                        status: 'fromLink',
                                        texts: {
                                            fromLink: this.translateService.instant(
                                                gettext('Congratulations! You activated bonus'))
                                                + ` ${bonus.name}! `
                                                + this.translateService.instant(
                                                    gettext('Bonus successfully added to the Bonuses page.')),
                                        },
                                    });
                                    break;
                                default:
                                    this.modalService.showModal('promoSuccess', {
                                        title: gettext('Bonus success'),
                                        status: 'fromLink',
                                        texts: {
                                            fromLink: this.translateService.instant(
                                                gettext('Congratulations! You have got bonus'))
                                                + ` ${bonus.name}! `
                                                + this.translateService.instant(
                                                    gettext('Bonus successfully added to the Bonuses page.')),
                                        },
                                    });
                                    break;
                            }
                            this.cachingService.clear(promocodeCacheKey);
                        }
                    } else {
                        const subscription: Subscription = this.eventService.subscribe([
                            {name: 'LOGIN'},
                        ], (): void => {
                            this.processPromocode(promoCode).then((): void => {
                                subscription.unsubscribe();
                            });
                        });
                        if (!this.modalService.getActiveModal('signup')) {
                            this.modalService.showModal('login');
                        }
                    }
                } else {
                    this.showPromoCodeError();
                    this.cachingService.clear(promocodeCacheKey);
                }
            }
        } catch (error) {
            this.showError(
                error.errors || error,
                gettext('Promo code error'),
            );
        }
    }

    public showPromoCodeError(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Promo code error'),
                message: gettext('No voucher found'),
                wlcElement: 'notification_promocode-error',
            },
        });
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
            const response: IData = await this.limitedRequests({
                name: 'bonusSubscribe',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'subscribe'),
                events: {
                    success: 'BONUS_SUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_SUBSCRIBE_FAILED',
                },
            }, 'subscribe', params);

            if (showPush) {
                this.showSuccess(gettext('Successful subscription to the bonus'));

                if (bonus.stackIsUnavailable) {
                    this.showWarning(
                        gettext('The bonus you have subscribed to cannot be activated '
                            + 'due to the presence of another active bonus'),
                        gettext('Bonus'),
                    );
                }
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
            const response: IData = await this.limitedRequests( {
                name: 'bonusSubscribe',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'unsubscribe'),
                events: {
                    success: 'BONUS_UNSUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_UNSUBSCRIBE_FAILED',
                },
            }, 'unsubscribe', params);
            this.showSuccess(gettext('You have been successfully unsubscribed from the bonus'));
            return response.data;
        } catch (error) {
            this.showError(error?.errors);
        }
    }

    private limitedRequests(
        request: string | IRequestMethod,
        type: RequestType,
        params?: RequestParamsType,
    ): Promise<IData> {
        if (this.requests.find((res: RequestType): boolean => res === type)) {
            throw {errors: gettext('Too many requests')};
        }
        this.requests.push(type);
        const res: Promise<IData> = this.dataService.request(request, params);
        res.finally(() => _pull(this.requests, type));
        return res;
    }

    /**
     * Cancel bonus
     *
     * @param {Bonus} bonus bonus object
     * @returns {Bonus} bonus object
     */
    public async cancelBonus(bonus: Bonus): Promise<Bonus> {
        const params = {LBID: bonus.LBID};

        try {
            const response: IData = await this.limitedRequests({
                name: 'bonusCancel',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'DELETE',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'cancel'),
                events: {
                    success: 'BONUS_CANCEL_SUCCEEDED',
                    fail: 'BONUS_CANCEL_FAILED',
                },
            }, 'cancel', params);
            this.showSuccess(gettext('The bonus has been cancelled'));
            return response.data;
        } catch (error) {
            this.showError(error?.errors);
        }
    }

    /**
     * Receiving information to cancel the bonus
     * @param {string} loyaltyBonusId loyalty bonus id
     * @param {number} bonusId bonus id
     * @returns {BonusCancellationInfo} bonus cancellation information object
     */
    public async getCancelInformation(loyaltyBonusId: string, bonusId: number): Promise<BonusCancellationInfo> {
        try {

            const response: IData = await this.limitedRequests({
                name: 'getCancelInformation',
                system: 'bonuses',
                url: `/bonuses?type=cancelInfo&lbid=${loyaltyBonusId}`,
                type: 'GET',
            }, 'cancelInfo');

            const bonusInfo: IBonusCanceledInfo = response.data[loyaltyBonusId];

            if (bonusInfo) {
                return new BonusCancellationInfo(bonusInfo);
            } else throw new Error();

        } catch (error) {
            let {errors} = error;
            if (!errors) {
                errors = [gettext('An error has occurred while loading data. Please try again later.')];
            }

            this.logService.sendLog({code: '10.0.3', data: {bonusId}});
            this.showError(errors);
            throw errors;
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
            const response: IData<Bonus> = await this.limitedRequests({
                name: 'bonusTake',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'PUT',
                mapFunc: async (res) => await this.prepareBonusActionData(res, bonus, 'inventory'),
            }, 'inventory', params);

            if (emitDelay) {
                setTimeout((): void => {
                    this.eventService.emit({name: 'BONUS_TAKE_SUCCEEDED'});
                    this.showSuccess(gettext('The bonus has been taken successfully'));
                }, emitDelay);
            } else {
                this.eventService.emit({name: 'BONUS_TAKE_SUCCEEDED'});
                this.showSuccess(gettext('The bonus has been taken successfully'));
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
    public async queryBonuses<T extends Bonus | LootboxPrizeModel>(
        publicSubject: boolean,
        type: RestType = 'any',
        promoCode?: string,
    ): Promise<T[]> {
        this.queryPromises[type].next(true);
        const queryParams = this.prepareQueryParams(type, promoCode);

        try {
            const res: IBonusesData = await this.limitedRequests('bonuses/bonuses', type, queryParams);

            if (type === 'lootboxPrizes') {
                this.lootboxPrizes = this.processLootboxPrizes((res as IData<ILootboxPrize[]>).data, publicSubject);
                return this.lootboxPrizes as T[];
            }

            const bonuses: Bonus[] = _orderBy(
                this.checkForbid(await this.modifyBonuses(
                    (res as IData<IBonus[]>).data, 
                    Date.parse(res.headers.get('Date')))),
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

            this.saveBonuses(type, bonuses, publicSubject);

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
        let result: Bonus[] = [];

        if (!!sortOrder) {
            result = _reduce(_union(sortOrder), (res: Bonus[], element: TBonusSortOrder): Bonus[] => {
                if (_isNumber(element)) {
                    return _unionBy(res, [_find(bonuses, {id: element})], 'id');
                }

                return _unionBy(res, this.filterBonusesBySortOrder(bonuses, element), 'id');
            }, []);
        }

        result = (result.length === bonuses.length) ? result : _unionBy(result, bonuses, 'id');

        // after sorting by sortOrder, move unavailable (showOnly) bonuses to the end of result list
        if (bonuses.some((bonus: Bonus) => !bonus.showOnly)) {
            result.sort((a: Bonus, b: Bonus) => (_toNumber(a.showOnly) - _toNumber(b.showOnly)));
        }

        return result;
    }

    /**
     * Saves bonus with promo if promo exists in cache
     * @returns {Promise<void>}
     */
    private async checkPromoBonus(): Promise<void> {
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

    private saveBonuses(type: RestType, bonuses: Bonus[], publicSubject: boolean): void {
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
    }

    private processLootboxPrizes(data: ILootboxPrize[], publicSubject: boolean): LootboxPrizeModel[] {
        const lootboxPrizes = _map(data, (prize: ILootboxPrize): LootboxPrizeModel => {
            return new LootboxPrizeModel(
                {service: 'BonusesService', method: 'queryBonuses'},
                prize,
                this.configService,
            );
        });

        if (publicSubject) {
            this.subjects.lootboxPrizes$.next(lootboxPrizes);
        }

        return lootboxPrizes;
    }

    private prepareQueryParams(type: RestType, promoCode: string): IQueryParams {
        const params: IQueryParams = {};

        if (type) {
            if (type === 'active' || type === 'lootboxPrizes') {
                params.type = type;
            }
            if (type === 'store') {
                params.event = type;
            }
        }

        if (promoCode) {
            params.PromoCode = promoCode;
        }

        return params;
    }

    /**
     * Return bonuses fileterd by sort order
     * @param {Bonus[]} bonuses bonuses array
     * @param {TBonusSortOrder[]} sortOrder bonuses order
     * @returns {Bonus[]} bonuses bonuses array
     */
    private filterBonusesBySortOrder(bonuses: Bonus[], order: TBonusSortOrder): Bonus[] {
        switch (order) {
            case 'active':
                return _filter(bonuses, {isActive: true});
            case 'inventory':
                return _filter(bonuses, {inventoried: true});
            case 'subscribe':
                return _filter(bonuses, {isSubscribed: true});
            case 'promocode':
                return _filter(bonuses, {id: this.promoBonus?.id});
            default:
                return bonuses;
        }
    }

    private async init(): Promise<void> {
        this.registerMethods();
        this.setSubscribers();

        await this.configService.ready;

        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .subscribe((UserProfile) => {
                this.profile = UserProfile;

                Bonus.userCurrency = UserProfile?.idUser
                    ? UserProfile.currency
                    : this.configService.get<string>('$base.defaultCurrency') || 'EUR';
            });

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
                this.checkNewActiveBonuses(userLoyaltyInfo.bonusesBalance);

                if (userLoyaltyInfo.freeRounds) {
                    this.checkNewFreeRoundGames(userLoyaltyInfo.freeRounds);
                }
            });
    }

    private async modifyBonuses(data: IBonus[], bonusesServerTime: number): Promise<Bonus[]> {
        const queryBonuses: Bonus[] = [];

        if (data?.length) {
            Bonus.serverTime = bonusesServerTime;
            Bonus.existActiveBonus = false;
            Bonus.stackIsLocked = false;

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
            return bonus.allowCatalog
                || (!bonus.allowCatalog && (bonus.selected || bonus.active || bonus.inventoried));
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

    private checkForbid(bonuses: Bonus[]): Bonus[] {
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
                )
            )
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

    /**
     * Does bonus can be shown in catalog, or is active, or selected
     * @param bonus
     * @returns
     */
    private isCatalogAllowOrSelectedOrActive(bonus: Bonus): boolean {
        return bonus.allowCatalog || bonus.selected || bonus.active || bonus.inventoried;
    }

    /**
     * Does bonus has promo code or is active, or selected
     * @param bonus
     * @returns
     */
    private isNotPromoOrSelectedOrActive(bonus: Bonus): boolean {
        return !bonus.hasPromoCode || bonus.selected || bonus.active;
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

        this.translateService.onLangChange.subscribe((): void => {
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

    private showWarning(message: string | string[], title: string = gettext('Bonus warning')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'warning',
                title,
                message,
                wlcElement: 'notification_bonus-warning',
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
    private async checkNewActiveBonuses(bonusesBalance: IIndexing<IBonusesBalance>): Promise<void> {
        const cacheData: string[] = await this.cachingService.get<string[]>('active-loyalty-bonuses') || [];
        const activeBonusesIds: string[] = _map(bonusesBalance, 'IDLoyaltyBonuses');

        if (activeBonusesIds.length && !_isEqual(activeBonusesIds, cacheData)) {
            _each(_keys(bonusesBalance), (bonusID: string): void => {
                const dataBonus: IBonusesBalance = bonusesBalance[bonusID];
                if (!_isUndefined(dataBonus.IDLoyaltyBonuses)
                    && !_includes(cacheData, dataBonus.IDLoyaltyBonuses)
                    && _find(this.bonuses, {id: +bonusID, isDeposit: true})) {
                    this.showMessageBonusBalance(dataBonus.Balance);
                }
            });

            await this.cachingService.set('active-loyalty-bonuses', activeBonusesIds, true, Number.MAX_SAFE_INTEGER);
        }
    }

    private async checkNewFreeRoundGames(freeRounds: IFreeRound[]): Promise<void> {
        const cacheData: IFreeRoundData[] = await this.cachingService.get<IFreeRoundData[]>('freeround-games') || [];
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

        _each(activeFreeRoundGames, (freeRoundData: IFreeRoundData): void => {
            if (!_find(cacheData, freeRoundData) && +freeRoundData.count) {
                _each(freeRoundData.games, (gameLaunchCode: string): boolean => {
                    const game: Game = this.gamesCatalogService.getGame(+freeRoundData.merch, gameLaunchCode);
                    if (game) {
                        this.showMessageBonusFreeRound(freeRoundData, game);
                        return false;
                    }
                });
            }
        });

        await this.cachingService.set('freeround-games', activeFreeRoundGames, true, Number.MAX_SAFE_INTEGER);
    }

    /**
     * It accepts a bonus balance and displays a corresponding message.
     *
     * @param {string} balance - accepts a bonus balance.
     *
     * @return {void}
     */
    private showMessageBonusBalance(balance: string): void {
        const currencyElement =
            `<span
                wlc-currency
                [value]="${_toString(_toNumber(balance))}"
                [currency]="'${this.profile.originalCurrency}'"></span>`;
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('The bonus has been taken successfully'),
                wlcElement: 'notification_bonus-activated',
                displayAsHTML: true,
                message: this.translateService.instant('The bonus balance has been increased by')
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
                title: gettext('Free Spins'),
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
                        }, {
                            reload: true,
                        });
                    },
                },
            },
        });
    }
}
