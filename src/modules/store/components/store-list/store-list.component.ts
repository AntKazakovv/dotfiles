import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import _union from 'lodash-es/union';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    IPaginateOutput,
    EventService,
} from 'wlc-engine/modules/core';
import {
    StoreService,
    StoreItem,
    IStore,
} from 'wlc-engine/modules/store';

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
    public userExpPoints: number = 0;
    public itemTheme: Params.Theme = 'default';

    protected itemsPerPage: number = 0;
    protected store: IStore;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreListCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected storeService: StoreService,
        protected eventService: EventService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IStoreListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.isReady = false;
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.itemTheme = this.isProfileFirst ? 'first' : 'default';

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

    /**
     * Init store
     *
     * @param {IStore} store Store info
     */
    protected initStore(store: IStore) {
        if (store) {
            this.store = store;

            let storeItems: StoreItem[] = store.items;
            const category = this.router.globals.params['category'];

            if (category) {
                storeItems = _filter(storeItems, (item: StoreItem): boolean => {
                    return item.hasCategory(category);
                });
            }

            this.paginatedStoreItems = this.storeItems = storeItems;
            this.isReady = true;
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
}
