import {
    ChangeDetectionStrategy,
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
    ModalService,
    EventService,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {
    ITagCParams,
    ITagCommon,
} from 'wlc-engine/modules/core/components/tag/tag.params';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item.model';
import {
    IDisabledItemInfo,
    IStoreTagsConfig,
    IStoreItemTotalPrice,
} from 'wlc-engine/modules/store/system/interfaces/store.interface';
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
    @Input() public userCurrency: string;

    public override $params: Params.IStoreItemCParams;
    public isAuth: boolean;
    public storeImage: string;
    public useIconBonusImage: boolean;
    public storeItemTag: string;
    public disabledInfo: IDisabledItemInfo;
    public tagClass: string;

    protected isDisabled: boolean;
    protected isProfileFirst: boolean;
    protected tagConfig: ITagCParams;
    protected buyBtnParams: IButtonCParams = Params.defaultParams.buyBtnParams;
    protected storeItemTotalPrice: IStoreItemTotalPrice = {};

    constructor(
        @Inject('injectParams') protected params: Params.IStoreItemCParams,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
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

        if (this.$params.theme === 'wolf') {
            this.buyBtnParams = this.$params.buyBtnParamsWolf;
            this.makeTagConfig();
        }

        this.makeStorePrices();
    }

    public openDescription($event?: MouseEvent): void {
        $event?.stopPropagation();

        this.modalService.showModal('storeItemInfo', {
            title: this.storeItem.name,
            description: this.storeItem.description,
            storeItem: this.storeItem,
            isDisabled: this.isDisabled,
            disabledMsg: this.disabledInfo?.messageText,
            storeItemTotalPrice: this.storeItemTotalPrice,
            canBuy: this.storeItem.canBuy,
        });
    }

    public showConfirmationModal(): void {
        this.modalService.showModal('storeConfirmation', {
            storeItem: this.storeItem,
            storeItemTotalPrice: this.storeItemTotalPrice,
        });
    }

    /**
     * detectChanges after image loading error
     * @returns {void}
     */
    public imageErrorLoad(): void {
        this.cdr.detectChanges();
    };

    public get valueStore(): number | string {
        return _isArray(this.storeItem.bonus.value) ? 0 : this.storeItem.bonus.value;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected makeTagConfig(): void {
        const storeTagsConfig = this.configService.get<IStoreTagsConfig>('$store.tagsConfig');
        const tagCommon: ITagCommon = storeTagsConfig.tagList[this.tagClass];

        this.tagConfig = {
            common: tagCommon,
        };
    }

    protected storeItemClickHadler($event: MouseEvent): void {

        if (($event.target as HTMLElement).closest('.wlc-btn')) {
            return;
        }

        this.openDescription($event);
    }


    protected makeStorePrices(): void {
        this.storeItemTotalPrice.loyaltyPrice = this.storeItem.priceLoyalty;
        this.storeItemTotalPrice.expPrice = this.storeItem.priceExp;

        if (!!Number(this.storeItem.priceMoney?.EUR)) {
            this.storeItemTotalPrice.moneyCurrency = !!Number(this.storeItem.priceMoney[this.userCurrency])
                ? this.userCurrency
                : 'EUR';

            this.storeItemTotalPrice.moneyPrice = Number(
                this.storeItem.priceMoney[this.storeItemTotalPrice.moneyCurrency],
            );
        }
    }
}
