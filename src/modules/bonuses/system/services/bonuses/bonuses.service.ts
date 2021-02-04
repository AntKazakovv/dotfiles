import {Injectable} from '@angular/core';
import {Bonus} from '../../models/bonus';
import {
    IData,
    ConfigService,
    EventService,
    LogService,
    DataService,
    CachingService,
} from 'wlc-engine/modules/core/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
import {
    IIndexing,
    IForbidBanned,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    IBonus,
    RestType,
    BonusesFilterType,
    IQueryParams,
    ActionType,
    IGetSubscribeParams,
} from '../../interfaces/bonuses.interface';
import {
    BehaviorSubject,
    Subscription,
    Observable,
    pipe,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    filter as _filter,
    includes as _includes,
    extend as _extend,
    each as _each,
    isObject as _isObject,
    get as _get,
    isArray as _isArray,
    map as _map,
    size as _size,
    unset as _unset,
    sortBy as _sortBy,
} from 'lodash-es';

interface IBonusData extends IData {
    data?: IBonus;
}

@Injectable({
    providedIn: 'root',
})
export class BonusesService {
    public storeBonuses: Bonus[] = [];
    public promoBonus: Bonus = null;
    public dbPromoUrl: string = 'promocode';

    protected bonuses: Bonus[] = [];
    protected activeBonuses: Bonus[] = [];
    protected historyBonuses: Bonus[] = [];

    private subjects: { [key: string]: BehaviorSubject<Bonus[]> } = {
        bonuses$: new BehaviorSubject(null),
        active$: new BehaviorSubject(null),
        history$: new BehaviorSubject(null),
        store$: new BehaviorSubject(null),
    };

    private profile = this.userService.userProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private depEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
    private regEvents = ['deposit first', 'registration', 'verification'];

    constructor(
        private cachingService: CachingService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private userService: UserService,
        private logService: LogService,
    ) {
        this.registerMethods();
        this.setSubscribers();
    }

    /**
     * Get subscribtion from bonuses observer
     *
     * @param {IGetSubscribeParams} params params for subscribtion
     * @returns {Subscription} subsctibtion
     */
    public getSubscribe(params: IGetSubscribeParams): Subscription {
        if (params.useQuery) {
            this.queryBonuses(true, params?.type);
        }

        return this.getObserver(params?.type).pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(params.observer);
    }

    /**
     * Get bonuses observer from bonses subjects by rest type
     *
     * @param {RestType} type bonuses rest type ('active' | 'history' | 'store' | 'any')
     * @returns {Observable<Bonus[]>} Observable
     */
    public getObserver(type?: RestType): Observable<Bonus[]> {
        let flow$: BehaviorSubject<Bonus[]>;

        switch (type) {
            case 'active':
                flow$ = this.subjects.active$;
                break;
            case 'history':
                flow$ = this.subjects.history$;
                break;
            case 'store':
                flow$ = this.subjects.store$;
                break;
            default:
                flow$ = this.subjects.bonuses$;
                break;
        }

        return flow$.asObservable();
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
                        && (!hasPromoCode || (hasPromoCode && (selected || active)));
                case 'deposit':
                    return (allowCatalog || (!allowCatalog && (selected || active)))
                        && (!hasPromoCode || (hasPromoCode && (selected || active)))
                        && this.depEvents.indexOf(bonus.event) !== -1;
                case 'reg':
                    return (allowCatalog || (!allowCatalog && (selected || active)))
                        && (!hasPromoCode || (hasPromoCode && (selected || active)))
                        && this.regEvents.indexOf(bonus.event) !== -1;
                case 'main':
                    return !active && (!hasPromoCode || (hasPromoCode && selected))
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
            let bonusResult: Bonus[] = [];
            const bonuses = await this.queryBonuses(false, null, code);
            bonusResult = bonuses.filter((bonus: Bonus) => {
                return bonus.status == 1 && !bonus.selected;
            });

            _each(bonusResult, (bonus: Bonus) => {
                bonus.data.PromoCode = code;
            });
            return bonusResult;
        } catch (error) {
            this.logService.sendLog({code: '10.0.2', data: error});
            return [];
        }
    }

    /**
     * Get bonus by id
     *
     * @param {number} id bonus id
     * @returns {Bonus} bonus object
     */
    public async getBonus(id: number): Promise<Bonus | void> {
        // TODO add get from cache
        try {
            const data: IBonusData = await this.dataService.request({
                name: 'bonusById',
                system: 'bonuses',
                url: `/bonuses/${id}`,
                type: 'GET',
            });
            if (_isObject(data.data)) {
                const bonus: Bonus = new Bonus(data.data, this.configService, this);
                return bonus;
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
     * @returns {Bonus} bonus object
     */
    public async subscribeBonus(bonus: Bonus): Promise<Bonus> {
        bonus.data.PromoCode = bonus.data.PromoCode || '';
        const params = {ID: bonus.id, PromoCode: bonus.promoCode, Selected: 1};

        try {
            const response: IData = await this.dataService.request({
                name: 'bonusSubscribe',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'POST',
                mapFunc: (res) => this.prepareBonusActionData(res, bonus, 'subscribe'),
                events: {
                    success: 'BONUS_SUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_SUBSCRIBE_FAILED',
                },
            }, params);
            return response.data;
        } catch (error) {
            this.showError(gettext('Bonus subscribe failed'), error?.errors);
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
                mapFunc: (res) => this.prepareBonusActionData(res, bonus, 'unsubscribe'),
                events: {
                    success: 'BONUS_UNSUBSCRIBE_SUCCEEDED',
                    fail: 'BONUS_UNSUBSCRIBE_FAILED',
                },
            }, params);
            return response.data;
        } catch (error) {
            this.showError(gettext('Bonus unsubscribe failed'), error?.errors);
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
                mapFunc: (res) => this.prepareBonusActionData(res, bonus, 'cancel'),
                events: {
                    success: 'BONUS_CANCEL_SUCCEEDED',
                    fail: 'BONUS_CANCEL_FAILED',
                },
            });
            return response.data;
        } catch (error) {
            this.showError(gettext('Bonus cancel failed'), error?.errors);
        }
    }

    /**
     * Take inventory bonus
     *
     * @param {Bonus} bonus bonus object
     * @returns {Bonus} bonus object
     */
    public async takeInventory(bonus: Bonus): Promise<Bonus> {
        const params = {ID: bonus.id, type: 'take'};
        try {
            const response: IData = await this.dataService.request({
                name: 'bonusTake',
                system: 'bonuses',
                url: `/bonuses/${bonus.id}`,
                type: 'PUT',
                mapFunc: (res) => this.prepareBonusActionData(res, bonus, 'inventory'),
                events: {
                    success: 'BONUS_TAKE_SUCCEEDED',
                    fail: 'BONUS_TAKE_FAILED',
                },
            }, params);
            return response.data;
        } catch (error) {
            this.showError(gettext('Bonus take failed'), error?.errors);
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
    public async queryBonuses(publicSubject: boolean, type?: RestType, promoCode?: string): Promise<Bonus[]> {
        let bonuses: Bonus[] = [];
        const queryParams: IQueryParams = {};
        if (type) {
            if (type === 'active' || type === 'history') {
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
            const res: IData = await this.dataService.request('bonuses/bonuses', queryParams);
            let result = this.modifyBonuses(res.data);
            result = this.checkForbid(result, queryParams);
            if (result.length) {
                this.checkBonusesInLocalStorage(result);
            }
            _each(result, (bonus: Bonus) => {
                bonus.setFromLocalStorage();
                bonuses.unshift(bonus);
            });

            bonuses = _sortBy(bonuses, (bonus) => {
                return bonus.id;
            });

            switch (type) {
                case 'active':
                    publicSubject ? this.subjects.active$.next(bonuses) : null;
                    this.activeBonuses = bonuses;
                    break;
                case 'history':
                    publicSubject ? this.subjects.history$.next(bonuses) : null;
                    this.historyBonuses = bonuses;
                    break;
                case 'store':
                    publicSubject ? this.subjects.store$.next(bonuses) : null;
                    this.storeBonuses = bonuses;
                    break;
                default:
                    publicSubject ? this.subjects.bonuses$.next(bonuses) : null;
                    this.bonuses = bonuses;
                    break;
            }
            return bonuses;
        } catch (error) {
            this.logService.sendLog({code: '10.0.0', data: error});
            this.eventService.emit({
                name: 'BONUSES_FETCH_FAILED',
                data: error,
            });
        }
    }

    public clearPromoBonus(): void {
        if (this.promoBonus) {
            this.cachingService.claer(this.dbPromoUrl);
            this.promoBonus = null;
        }
    }

    private modifyBonuses(data: IBonus[]): Bonus[] {
        const queryBonuses: Bonus[] = [];

        if (data?.length) {
            for (const bonusData of data) {
                const bonus: Bonus = new Bonus(bonusData, this.configService, this);
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

    private checkBonusesInLocalStorage(bonuses: Bonus[]): void {
        const bonusesIDs: number[] = _map(bonuses, 'id');
        let lsBonuses: IIndexing<number[]>;

        try {
            lsBonuses = JSON.parse(localStorage.getItem('wlc.bonuses') || '{}');
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
            localStorage.setItem('wlc.bonuses', JSON.stringify(lsBonuses));
        } else {
            localStorage.removeItem('wlc.bonuses');
        }

    }

    private setSubscribers() {
        this.subjects.bonuses$.subscribe({
            next: (bonuses: Bonus[]) => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.active$.subscribe({
            next: (bonuses: Bonus[]) => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_ACTIVE_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.history$.subscribe({
            next: (bonuses: Bonus[]) => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_HISTORY_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.subjects.store$.subscribe({
            next: (bonuses: Bonus[]) => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_STORE_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
            {name: 'PROFILE_UPDATE'},
            {name: 'BONUS_TAKE_SUCCEEDED'},
            {name: 'BONUS_CANCEL_SUCCEEDED'},
            {name: 'BONUS_SUBSCRIBE_SUCCEEDED'},
            {name: 'BONUS_UNSUBSCRIBE_SUCCEEDED'},
        ], () => {
            this.updateSubscribers();
        });

        this.eventService.subscribe([
            {name: 'LOGOUT'},
        ], () => {
            this.clearPromoBonus();
        });

        this.eventService.subscribe([
            {name: 'PROMO_SUCCESS'},
        ], (bonus: Bonus) => {
            if (bonus) {
                this.promoBonus = bonus;
                this.cachingService.set(this.dbPromoUrl, this.promoBonus.promoCode, true, 24 * 60 * 60 * 100);
            }
        });
    }

    private showError(title: string, errors: string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message: errors,
            },
        });
    }

    private prepareBonusActionData(res: unknown, bonus: Bonus, actionType: ActionType): Bonus {
        bonus.addToLocalStorage(actionType);
        _extend(bonus.data, res);

        switch (actionType) {
            case 'inventory':
                bonus.data.Inventoried = 0;
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
    }
}
