import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {UIRouter} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import {
    skipWhile,
    takeUntil,
    filter,
} from 'rxjs/operators';
import _union from 'lodash-es/union';
import _filter from 'lodash-es/filter';
import _orderBy from 'lodash-es/orderBy';

import {
    AbstractComponent,
    IMixedParams,
    IPaginateOutput,
    EventService,
    ActionService,
    DeviceType,
    ModalService,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    StoreService,
    StoreItem,
    IStore,
} from 'wlc-engine/modules/store';
import {
    UserService,
    UserProfile,
} from 'wlc-engine/modules/user';
import {
    IDisabledItemInfo,
    IStoreFilterValue,
    TStoreFilter,
} from 'wlc-engine/modules/store/system/interfaces/store.interface';
import {
    IStoreFilterFormCParams,
    StoreFilterFormComponent,
} from 'wlc-engine/modules/store/components/store-filter-form/store-filter-form.component';
import {storeConfig} from 'wlc-engine/modules/store/system/config/store.config';

import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import * as Params from 'wlc-engine/modules/store/components/store-list/store-list.params';

@Component({
    selector: '[wlc-store-list]',
    templateUrl: './store-list.component.html',
    styleUrls: ['./styles/store-list.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() protected type: Params.Type;
    @Input() protected theme: Params.Theme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;
    @Input() protected inlineParams: Params.IStoreListCParams;

    public override $params: Params.IStoreListCParams;
    public storeItems: StoreItem[] = [];
    public paginatedStoreItems: StoreItem[] = [];
    public isReady: boolean = false;
    public isProfileFirst: boolean;
    public userPoints: number = 0;
    public userLevel: number = 0;
    public userExpPoints: number = 0;
    public itemTheme: Params.ThemeMod = 'default';
    public isMultiWallet: boolean;

    protected itemsPerPage: number = 0;
    protected store: IStore;
    protected userCurrency: string;
    protected readonly userService: UserService = inject(UserService);
    protected storeFilter: ISelectCParams<TStoreFilter> = storeConfig.storeFilterConfig;
    protected showDesktopFilter: boolean = false;
    protected filterIconPath: string;

    private filterValue: TStoreFilter = 'all';
    private formData$: BehaviorSubject<IStoreFilterValue> = new BehaviorSubject(null);
    private formConfig: IWrapperCParams = Params.defaultParams.formConfig;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreListCParams,
        protected storeService: StoreService,
        protected eventService: EventService,
        protected router: UIRouter,
        protected actionService: ActionService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.IStoreListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();

        this.isReady = false;
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.itemTheme = this.$params.themeMod ?? 'default';
        this.filterIconPath = this.$params.filterIconPath;
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
        this.storeService.setStoreFilter(this.filterValue);
        this.storeFilter.control.setValue(this.filterValue);
        this.showDesktopFilter = this.actionService.getDeviceType() === DeviceType.Desktop;

        this.setSubscribers();
        this.filterHandlers();
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedStoreItems = value.paginatedItems as StoreItem[];
        this.itemsPerPage = value.event.itemsPerPage;
        this.cdr.detectChanges();
    }

    protected get userStatsConfig(): IWrapperCParams {
        return this.$params.userStatsConfig;
    }

    protected get emptyConfig(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    /**
     * Init store
     *
     * @param {IStore} store Store info
     */
    protected initStore(store: IStore): void {
        if (store) {
            this.store = store;

            let storeItems: StoreItem[] = store.items;
            const category = this.router.globals.params['category'];

            if (category) {
                storeItems = _filter(storeItems, (item: StoreItem): boolean => {
                    return item.hasCategory(category);
                });
            }

            const selectedItems = this.getSelectedItems(storeItems);
            this.paginatedStoreItems = this.storeItems = this.sortItems(selectedItems);

            this.cdr.detectChanges();
        }
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected setSubscribers(): void {
        this.configService
            .get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((profile: UserProfile): void => {
                this.userCurrency = profile?.idUser
                    ? profile.currency
                    : this.configService.get<string>('$base.defaultCurrency');
            });

        this.storeService.storeFilter$
            .pipe(
                filter((filterValue: TStoreFilter): boolean => this.filterValue !== filterValue),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: TStoreFilter): void => {
                this.filterValue = filterValue;
                this.initStore(this.store);
            });

        this.actionService.deviceType()
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((type: DeviceType): void => {
                this.showDesktopFilter = type === DeviceType.Desktop;
                this.cdr.detectChanges();
            });

        this.storeService.getSubscribe({
            useQuery: true,
            observer: {
                next: (store: IStore) => {
                    this.initStore(store);
                },
            },
            type: 'all',
            until: this.$destroy,
        });

        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            if (this.store) {
                this.initStore(this.store);
            }
        }, this.$destroy);

        this.userService.userInfo$
            .pipe(
                skipWhile(v => !v),
                takeUntil(this.$destroy),
            )
            .subscribe((userInfo) => {
                this.userLevel = userInfo.level;

                if (!this.isReady && userInfo.level) {
                    this.isReady = true;
                }

                this.cdr.detectChanges();
            });
    }

    protected filterHandlers(): void {
        this.storeFilter.control.valueChanges
            .pipe(
                filter((filterValue: TStoreFilter): boolean => this.filterValue !== filterValue),
                takeUntil(this.$destroy),
            )
            .subscribe((filterValue: TStoreFilter): void => {
                this.storeService.setStoreFilter(filterValue);
                this.cdr.detectChanges();
            });
    }

    protected getSelectedItems(storeItems: StoreItem[]): StoreItem[] {
        switch (this.filterValue) {
            case 'available':
                return storeItems.filter((item) => {
                    return !item.isItemDisabled(this.userLevel);
                });
                ;
            case 'unavailable':
                return storeItems.filter((item) => {
                    return item.isItemDisabled(this.userLevel);
                });
            default:
                return storeItems;
        }
    }

    protected sortItems(storeItems: StoreItem[]): StoreItem[] {
        return _orderBy(
            storeItems,
            [
                (storeItem: StoreItem) => storeItem.hasUserAccessByLevel(this.userLevel),
                (storeItem: StoreItem) => storeItem.isAvailable,
                (storeItem: StoreItem) => storeItem.nextDateAvailable,
            ],
            [
                'desc',
                'desc',
                'asc',
            ],
        );
    }

    protected getItemDisabledInfo(item: StoreItem): IDisabledItemInfo {
        return item.getItemDisabledInfo(this.userLevel);
    }

    protected openFilter(): void {
        this.createFormData();

        this.modalService.showModal({
            modalTitle: gettext('Filter'),
            id: 'store-filter',
            modifier: 'store-filter',
            component: StoreFilterFormComponent,
            componentParams: <IStoreFilterFormCParams>{
                formConfig: this.formConfig,
                onSubmit: this.ngSubmit.bind(this),
                formData: this.formData$,
            },
            size: 'md',
            showFooter: false,
        });
    }

    protected createFormData(): void {
        this.formData$.next({
            filterValue: this.filterValue,
        });
    }

    protected ngSubmit(form: UntypedFormGroup): void {
        if (form.value.filterValue !== this.filterValue) {
            this.storeFilter.control.setValue(form.value.filterValue);
            this.storeService.setStoreFilter(form.value.filterValue);
        }

        this.modalService.hideModal('store-filter');
    }
}
