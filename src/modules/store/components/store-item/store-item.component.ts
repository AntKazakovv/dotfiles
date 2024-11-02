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
    BehaviorSubject,
    of,
} from 'rxjs';

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
    TagTheme,
} from 'wlc-engine/modules/core/components/tag/tag.params';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item.model';
import {
    IDisabledItemInfo,
    IStoreTagsConfig,
    IStoreItemTotalPrice,
} from 'wlc-engine/modules/store/system/interfaces/store.interface';
import {StoreService} from 'wlc-engine/modules/store/system/services';
import {TBonusValue} from 'wlc-engine/modules/bonuses';
import {IWalletConfirmCParams} from 'wlc-engine/modules/multi-wallet/components/wallet-confirm/wallet-confirm.params';

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
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ComponentThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public userCurrency: string;
    @Input() public itemDisabledInfo: IDisabledItemInfo;

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
    protected storeItemTotalPrice: IStoreItemTotalPrice = {};
    protected storeItem: StoreItem;

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
        this.storeItem = this.$params.storeItem;
        this.isDisabled = !this.storeItem.isAvailable
            || !this.storeItem.hasUserAccessByLevel(this.$params.userLevel)
            || this.storeItem.nextDateAvailable;
        this.prepareModifiers();
        this.disabledInfo = this.storeItem.getItemDisabledInfo(this.$params.userLevel);
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.storeImage = this.storeItem.image;
        this.storeItemTag = this.isDisabled ? 'Unavailable' : this.storeItem.itemType;
        this.tagClass = this.storeItemTag.toLowerCase();

        this.useIconBonusImage = this.storeItem.isBonus && !this.storeImage &&
            this.configService.get<boolean>('$bonuses.useIconBonusImage');

        if (!this.storeImage) {
            this.storeImage = this.$params.common?.defaultPicPath;
        };

        this.makeStorePrices();
        this.makeTagConfig();
    }

    public get showWalletConfirmation(): boolean {
        return this.storeItem.type !== 'Item' && this.storeItem.type !== 'TournamentPoints';
    }

    public openDescription($event?: MouseEvent): void {
        $event?.stopPropagation();

        this.modalService.showModal('storeItemInfo', {
            title: this.storeItem.name,
            description: this.storeItem.description,
            storeItem: this.storeItem,
            isDisabled: this.isDisabled,
            disabledMsg: this.itemDisabledInfo?.messageText,
            storeItemTotalPrice: this.storeItemTotalPrice,
            canBuy: this.storeItem.canBuy,
        });
    }

    public async showConfirmationModal(): Promise<void> {
        const isMultiWallet: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

        if (isMultiWallet && this.showWalletConfirmation) {
            this.modalService.showModal<IWalletConfirmCParams>('walletConfirm', {
                model: this.storeItem,
                type: 'store',
            });
        } else {
            this.modalService.showModal('storeConfirmation', {
                storeItem: this.storeItem,
                storeItemTotalPrice: this.storeItemTotalPrice,
            });
        }
    }

    /**
     * detectChanges after image loading error
     * @returns {void}
     */
    public imageErrorLoad(): void {
        this.cdr.detectChanges();
    };

    public get valueStore$(): BehaviorSubject<number | string> {
        return (_isArray(this.storeItem.bonus.value$.getValue())
            ? of(0)
            : this.storeItem.bonus.value$) as BehaviorSubject<number | string>;
    }

    public get showBonusValue(): boolean {
        return !!this.storeItem.bonus.value$.getValue() && this.storeItem.bonus.bonusType !== 'lootbox';
    }

    public get bonusValue(): BehaviorSubject<TBonusValue> {
        return this.storeItem.bonus.value$;
    }

    protected get tagTheme(): TagTheme {
        return this.$params.storeItemParams.tagTheme;
    }

    protected get infoIconPath(): string {
        return this.$params.storeItemParams.infoIcon;
    }

    protected get lockIconUrl(): string {
        return this.$params.storeItemParams.lockIcon;
    }

    protected get buyBtnParams(): IButtonCParams {
        return this.$params.storeItemParams.buyBtnParams;
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

    protected storeItemClickHandler($event: MouseEvent): void {
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

    protected shouldStoreImageBeShown(): boolean {
        return !!this.storeImage && (
            !this.storeItem.isBonus || !this.configService.get<boolean>('$bonuses.useIconBonusImage')
        );
    }
}
