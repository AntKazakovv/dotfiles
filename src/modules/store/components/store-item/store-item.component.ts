import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {StoreItem} from '../../system/models/store-item';
import {StoreService} from '../../system/services';
import * as Params from './store-item.params';

import {
    union as _union,
} from 'lodash-es';

export {IStoreItemParams} from './store-item.params';

@Component({
    selector: '[wlc-store-item]',
    templateUrl: './store-item.component.html',
    styleUrls: ['./styles/store-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class StoreItemComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public inlineParams: Params.IStoreItemParams;
    @Input() public storeItem: StoreItem;
    @Input() public type: Params.Type;
    @Input() public theme: Params.Theme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;

    public $params: Params.IStoreItemParams;
    public isAuth: boolean;
    public isMobile: boolean;
    public buyClick: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreItemParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
    }

    public openDescription(storeItem: StoreItem): void {
        this.modalService.showModal({
            id: 'store-item-info',
            modalTitle: storeItem.name,
            modifier: 'info',
            modalMessage: [
                storeItem.description,
            ],
            dismissAll: true,
        });
    }

    public async buyItem(): Promise<void> {
        this.buyClick = true;
        await this.storeService.buyItem(this.storeItem.id);
        this.buyClick = false;
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
