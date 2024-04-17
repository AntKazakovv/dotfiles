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

import _union from 'lodash-es/union';
import _isArray from 'lodash-es/isArray';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item.model';
import {IDisabledItemInfo} from 'wlc-engine/modules/store/system/interfaces/store.interface';
import {StoreService} from 'wlc-engine/modules/store/system/services';

import * as Params from './store-item.params';

@Component({
    selector: '[wlc-store-item]',
    templateUrl: './store-item.component.html',
    styleUrls: ['./styles/store-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class StoreItemComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public inlineParams: Params.IStoreItemCParams;
    @Input() public storeItem: StoreItem;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ComponentThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public userLevel: number;

    public override $params: Params.IStoreItemCParams;
    public isAuth: boolean;
    public storeImage: string;
    public useIconBonusImage: boolean;
    public storeItemTag: string;
    public disabledInfo: IDisabledItemInfo;
    public tagClass: string;

    protected isDisabled: boolean;
    protected isProfileFirst: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreItemCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.isDisabled = !this.storeItem.isAvailable
            || !this.storeItem.hasUserAccessByLevel(this.userLevel)
            || this.storeItem.nextDateAvailable;
        this.prepareModifiers();
        this.disabledInfo = this.storeItem.getDisabledInfo(this.userLevel);
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.storeImage = this.storeItem.image;
        this.storeItemTag = this.isDisabled ? 'Unavailable' : this.storeItem.itemType;
        this.tagClass = this.storeItemTag.toLowerCase();

        this.useIconBonusImage = this.storeItem.isBonus && !this.storeImage &&
            this.configService.get<boolean>('$bonuses.useIconBonusImage');
        if (!this.storeImage) {
            if (this.isProfileFirst) {
                this.storeImage = this.$params.common?.defaultPicPathFirst;
            } else if (!this.storeItem.isBonus || !this.configService.get<boolean>('$bonuses.useIconBonusImage')) {
                this.storeImage = this.$params.common?.defaultPicPath;
            }
        };
    }

    public openDescription(storeItem: StoreItem): void {
        this.modalService.showModal('storeItemInfo', {
            title: storeItem.name,
            description: storeItem.description,
            storeItem: storeItem,
            isDisabled: this.isDisabled,
            disabledMsg: this.disabledInfo?.messageText,
            priceLoyalty: storeItem.priceLoyalty,
            priceExp: storeItem.priceExp,
            canBuy: storeItem.canBuy,
        });
    }

    public showConfirmationModal(): void {
        this.modalService.showModal('storeConfirmation', {
            storeItem: this.storeItem,
            priceLoyalty: this.storeItem.priceLoyalty,
            priceExp: this.storeItem.priceExp,
        });
    }

    /**
     * detectChanges after image loading error
     * @returns {void}
     */
    public imageErrorLoad(): void {
        this.cdr.detectChanges();
    };

    public get valueStore(): number {
        return _isArray(this.storeItem.bonus.value) ? 0 : this.storeItem.bonus.value;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
