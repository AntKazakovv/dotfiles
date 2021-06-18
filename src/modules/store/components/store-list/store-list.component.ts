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
} from 'wlc-engine/modules/core';
import {StoreService} from '../../system/services';
import {StoreItem} from '../../system/models/store-item';
import {IStore} from '../../system/interfaces/store.interface';
import * as Params from './store-list.params';

import _union from 'lodash-es/union';


export {IStoreListCParams} from './store-list.params';

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
    public isReady: boolean = false;
    public isProfileFirst: boolean;
    public userPoints: number = 0;
    public userExpPoints: number = 0;
    public itemTheme: Params.Theme = 'default';

    constructor(
        @Inject('injectParams') protected params: Params.IStoreListCParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreListCParams>>{injectParams: params, defaultParams: Params.defaultParams}, ConfigService);
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
                        this.storeItems = store.items;
                        this.isReady = true;
                    }
                    this.cdr.markForCheck();
                },
            },
            type: 'all',
            until: this.$destroy,
        });
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
