import {Injectable} from '@angular/core';
import {
    UIRouter,
    Transition,
    RawParams,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subscription,
    Observable,
    pipe,
} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';
import _filter from 'lodash-es/filter';
import _get from 'lodash-es/get';
import _toString from 'lodash-es/toString';
import _toNumber from 'lodash-es/toNumber';
import _find from 'lodash-es/find';
import _includes from 'lodash-es/includes';
import _orderBy from 'lodash-es/orderBy';

import {
    ConfigService,
    EventService,
    LogService,
    DataService,
    IData,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
    IForbidBanned,
    InjectionService,
    SortDirection,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {
    IStoreResponse,
    IStore,
    IStoreOrder,
    IStoreBuyResponse,
    IGetSubscribeParams,
    StoreRestType,
} from 'wlc-engine/modules/store/system/interfaces/store.interface';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category';

interface IRequestParams {
    type?: string;
    status?: number;
}

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    protected storeItems: StoreItem[] = [];
    protected storeCategories: StoreCategory[] = [];
    protected storeOrders: IStoreOrder[] = [];

    private store$: BehaviorSubject<IStore> = new BehaviorSubject(null);
    private orders$: BehaviorSubject<IStoreOrder[]> = new BehaviorSubject(null);
    private profile: UserProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private uiRouter: UIRouter,
        private injectionService: InjectionService,
    ) {
        this.registerMethods();
        this.setSubscribers();
    }

    /**
     * Get subscribtion from store observer
     *
     * @param {IGetSubscribeParams} params params for subscribtion
     * @returns {Subscription} subsctibtion
     */
    public getSubscribe(params: IGetSubscribeParams): Subscription {
        if (params.useQuery) {
            params?.type === 'orders' ? this.getOrders(true) : this.getStore(true);
        }

        return this.getObserver(params?.type).pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(params.observer);
    }

    /**
     * Get store observer from store subjects by rest type
     *
     * @param {StoreRestType} type bonuses rest type ('all' | 'orders')
     * @returns {Observable<IStore | IStoreOrder[]>} Observable
     */
    public getObserver(type?: StoreRestType): Observable<IStore | IStoreOrder[]> {
        let flow$: BehaviorSubject<IStore | IStoreOrder[]>;
        type === 'orders' ? flow$ = this.orders$ : flow$ = this.store$;
        return flow$.asObservable();
    }

    /**
     * Get current store info
     *
     * @returns {IStore} Store info
     */
    public getCurrentStore(): IStore {
        return this.store$.getValue();
    }

    /**
     * Get store
     *
     * @param {boolean} publicSubject is public rxjs subject from query
     * @returns {Promise<IStore>} store categories and store items arrays
     */
    public async getStore(publicSubject: boolean): Promise<IStore> {
        try {
            const res: IData = await this.dataService.request('store/store', {});
            let result = await this.modifyStoreResponse(res.data);
            result = this.checkForbid(result);
            if (publicSubject) {
                this.store$.next(result);
            }
            this.storeItems = result.items;
            return result;
        } catch (error) {
            this.logService.sendLog({code: '11.0.0', data: error});
            this.eventService.emit({
                name: 'STORE_FETCH_FAILED',
                data: error,
            });
        }
    }

    /**
     * Get orders
     *
     * @param {boolean} publicSubject is public rxjs subject from query
     * @returns {Promise<IStoreOrder[]>} store orders array
     */
    public async getOrders(publicSubject: boolean, status?: number): Promise<IStoreOrder[]> {
        const params: IRequestParams = {
            type: 'orders',
        };

        if (status) {
            params['status'] = status;
        }

        try {
            const res: IData = await this.dataService.request('store/store', params);
            const result = res.data;
            publicSubject ? this.orders$.next(result) : null;
            this.storeOrders = result;
            return result;
        } catch (error) {
            this.logService.sendLog({code: '11.0.1', data: error});
            this.eventService.emit({
                name: 'STORE_ORDERS_FETCH_FAILED',
                data: error,
            });
        }
    }

    /**
     * Get all store categories with names on all languages
     *
     * @returns {Promise<StoreCategory[]>} Store categories
     */
    public async getCategories(): Promise<StoreCategory[]> {
        try {
            const response: IData = await this.dataService.request('store/storeCategories');
            const categories: StoreCategory[] = [];

            for (const categoryData of response.data) {
                categories.push(new StoreCategory(
                    {service: 'StoresService', method: 'getCategories'},
                    categoryData,
                ));
            }

            categories.push(new StoreCategory(
                {service: 'StoresService', method: 'getCategories'},
                {
                    ID: '0',
                    Name: {
                        en: gettext('All goods'),
                    },
                    Order: '999999',
                    Status: '1',
                }));

            this.storeCategories = _orderBy(categories, 'order', SortDirection.NewFirst);

            return this.storeCategories;
        } catch (error) {
            this.logService.sendLog({code: '11.0.2', data: error});
            this.eventService.emit({
                name: 'STORE_CATEGORIES_FETCH_FAILED',
                data: error,
            });
        }
    }

    public async buyItem(itemId: number, quantity: number = 1): Promise<IStoreBuyResponse> {
        const params = {id: _toString(itemId), quantity: quantity};
        try {
            const response: IData = await this.dataService.request({
                name: 'buyStoreItem',
                system: 'store',
                url: '/store',
                type: 'PUT',
                events: {
                    success: 'STORE_ITEM_BUY_SUCCEEDED',
                    fail: 'STORE_ITEM_BUY_FAILED',
                },
            }, params);
            this.showSuccess(gettext('Product purchase'), gettext('Product successfully purchased'), 'buy');
            return response.data;
        } catch (error) {
            this.showError(gettext('Purchase error'), error?.errors, 'buy');
        }
    }

    /**
     * Get store category by state
     *
     * @returns {StoreCategory} Store category
     */
    public async getCategoryByState(transition?: Transition): Promise<StoreCategory> {
        const stateName: string = transition ? transition.targetState().name() : this.uiRouter.globals.current.name;

        if (!_includes(stateName, 'loyalty-store')) {
            return;
        }

        const stateParams: RawParams = transition ? transition.targetState().params() : this.uiRouter.globals.params;
        const categoryId: number = _toNumber(stateParams?.['category']) || 0;

        const store: IStore = !this.store$.getValue()
            ? await this.getStore(true)
            : await this.store$.pipe(first()).toPromise();

        return _find(store.categories, (category: StoreCategory): boolean => {
            return category.id === categoryId;
        });
    }

    private async modifyStoreResponse(data: IStoreResponse): Promise<IStore> {
        const queryStore: IStore = {
            categories: [],
            items: [],
        };

        if (data?.Items?.length) {
            const bonusesService: BonusesService = await this.injectionService
                .getService<BonusesService>('bonuses.bonuses-service');
            const storeBonuses: Bonus[] = bonusesService.storeBonuses.length ?
                bonusesService.storeBonuses : 
                await bonusesService.queryBonuses<Bonus>(false, 'store');

            for (const itemData of data.Items) {
                const item: StoreItem = new StoreItem(
                    {service: 'StoresService', method: 'modifyStoreResponse'},
                    itemData,
                    this.configService,
                    this,
                );
                if (item.isBonus) {
                    item.bonus = _find(storeBonuses, (bonus: Bonus) => bonus.id === item.idBonus);
                }
                queryStore.items.push(item);
            }
            queryStore.items = _filter(queryStore.items, (item: StoreItem) => {
                return item.status && item.quantity !== 0;
            });
        }

        queryStore.categories = this.storeCategories || await this.getCategories();

        return queryStore;
    }

    private checkForbid(storeQuery: IStore): IStore {
        const userCategory: string = _get(this.profile, 'info.category', '').toLowerCase();
        const forbiddenCategories = this.configService.get<IIndexing<IForbidBanned>>('$loyalty.forbidBanned');

        if (
            this.useForbidUserFields
            && (
                _get(this.profile, 'info.loyalty.ForbidBonuses') === '1'
                || _get(forbiddenCategories, `${userCategory}.forbidBonuses`, false)
            )
        ) {
            storeQuery.items = _filter(storeQuery.items, (item: StoreItem) => !item.isBonus);
        }

        return storeQuery;
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'store',
            system: 'store',
            url: '/store',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'storeCategories',
            system: 'store',
            url: '/store',
            type: 'GET',
            params: {
                type: 'categories',
            },
        });
    }

    private setSubscribers() {
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .subscribe((userProfile) => {
                this.profile = userProfile;
            });

        this.store$.subscribe({
            next: (store: IStore) => {
                this.eventService.emit({
                    name: 'STORE_FETCH_SUCCESS',
                    data: store,
                });
            },
        });

        this.orders$.subscribe({
            next: (orders: IStoreOrder[]) => {
                this.eventService.emit({
                    name: 'STORE_ORDERS_FETCH_SUCCESS',
                    data: orders,
                });
            },
        });

        this.eventService.subscribe([
            {name: 'STORE_ITEM_BUY_SUCCEEDED'},
        ], (data: IData) => {
            if (!(data.data as IStoreBuyResponse).ItemsLeft) {
                this.updateSubscribers();
            }
        });
    }

    private updateSubscribers(): void {
        if (this.store$.observers.length > 1) {
            this.getStore(true);
        }
        if (this.orders$.observers.length > 1) {
            this.getOrders(true);
        }
    }

    private showError(title: string, errors: string[], id?: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message: errors,
                wlcElement: id ? 'notification-store-' + id + '-error' : undefined,
            },
        });
    }

    private showSuccess(title: string, msg: string, id?: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title,
                message: msg,
                wlcElement: id ? 'notification-store-' + id + '-success' : undefined,
            },
        });
    }
}
