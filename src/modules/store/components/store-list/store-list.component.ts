import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    IPaginateOutput,
} from 'wlc-engine/modules/core';
import {
    StoreService,
    StoreItem,
    IStore,
} from 'wlc-engine/modules/store';

import * as Params from 'wlc-engine/modules/store/components/store-list/store-list.params';

import _union from 'lodash-es/union';

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

    public $params: Params.IStoreListCParams;
    public storeItems: StoreItem[] = [];
    public paginatedStoreItems: StoreItem[] = [];
    public isReady: boolean = false;
    public isProfileFirst: boolean;
    public userPoints: number = 0;
    public userExpPoints: number = 0;
    public itemTheme: Params.Theme = 'default';

    protected itemsPerPage: number = 0;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreListCParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.isReady = false;
        this.isProfileFirst = this.ConfigService.get<string>('$base.profile.type') === 'first';
        this.itemTheme = this.isProfileFirst ? 'first' : 'default';

        this.storeService.getSubscribe({
            useQuery: true,
            observer: {
                next: (store: IStore) => {
                    if (store) {
                        this.paginatedStoreItems = this.storeItems = store.items;
                        this.isReady = true;
                    }
                    this.cdr.markForCheck();
                },
            },
            type: 'all',
            until: this.$destroy,
        });
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedStoreItems = value.paginatedItems as StoreItem[];
        this.itemsPerPage = value.itemsPerPage;
        this.cdr.markForCheck();
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
