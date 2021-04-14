import {Injectable} from '@angular/core';
import {
    ConfigService,
    EventService,
    ModalService,
    LogService,
    DataService,
    IData,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
    IForbidBanned,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {
    IStoreResponse,
    IStore,
    IStoreOrder,
    IStoreCategory,
    IStoreBuyResponse,
    IGetSubscribeParams,
    StoreRestType,
} from '../../interfaces/store.interface';
import {StoreItem} from '../../models/store-item';
import {
    BehaviorSubject,
    Subscription,
    Observable,
    pipe,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import _filter from 'lodash-es/filter';
import _get from 'lodash-es/get';
import _toString from 'lodash-es/toString';
import _find from 'lodash-es/find';

interface IRequestParams {
    type?: string;
    status?: number;
}

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    protected storeItems: StoreItem[] = [];
    protected storeCategories: IStoreCategory[] = [];
    protected storeOrders: IStoreOrder[] = [];

    private store$: BehaviorSubject<IStore> = new BehaviorSubject(null);
    private orders$: BehaviorSubject<IStoreOrder[]> = new BehaviorSubject(null);
    private profile = this.userService.userProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private modalService: ModalService,
        private userService: UserService,
        private logService: LogService,
        private bonusesService: BonusesService,
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
            this.storeCategories = result.categories;
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
            publicSubject ? this.orders$.next(result): null;
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

    private async modifyStoreResponse(data: IStoreResponse): Promise<IStore> {
        const queryStore: IStore = {
            categories: [],
            items: [],
        };

        if (data?.Items?.length) {
            const storeBonuses = this.bonusesService.storeBonuses.length ?
                this.bonusesService.storeBonuses :
                await this.bonusesService.queryBonuses(false, 'store');

            for (const itemData of data.Items) {
                const item: StoreItem = new StoreItem(itemData, this.configService, this);
                if (item.isBonus) {
                    item.bonus = _find(storeBonuses, (bonus: Bonus) => bonus.id === item.idBonus);
                }
                queryStore.items.push(item);
            }
            queryStore.items = _filter(queryStore.items, (item: StoreItem) => {
                return item.status && item.quantity !== 0;
            });
        }

        if (data?.Categories?.length) {
            for (const categoryData of data.Categories) {
                queryStore.categories.push(categoryData);
            }
        }

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
    }

    private setSubscribers() {
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
        ], () => {
            this.updateSubscribers();
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
                wlcElement: id ?  'notification-store-' + id + '-error' : undefined,
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
                wlcElement: id ?  'notification-store-' + id + '-success' : undefined,
            },
        });
    }
}
