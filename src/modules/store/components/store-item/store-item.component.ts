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
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {StoreItem} from 'wlc-engine/modules/store/system/models/store-item';
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
    @Input() public type: Params.Type;
    @Input() public theme: Params.Theme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;

    public $params: Params.IStoreItemCParams;
    public isAuth: boolean;
    public buyClick: boolean = false;
    public storeImage: string;
    public useIconBonusImage: boolean;
    protected isProfileFirst: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreItemCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.storeImage = this.storeItem.image;
        this.useIconBonusImage = this.storeItem.isBonus && !this.storeImage &&
            this.configService.get<boolean>('$bonuses.useIconBonusImage');
        if (!this.storeImage) {
            if (this.isProfileFirst) {
                this.storeImage = this.$params.common?.defaultPicPathFirst;
            } else if (!this.storeItem.isBonus || !this.configService.get<boolean>('$bonuses.useIconBonusImage')) {
                this.storeImage = this.$params.common?.defaultPicPath;
            }
        };

        if (this.configService.get<boolean>('$base.useButtonPending')) {
            GlobalHelper.addPendingToBtnsParams(this.$params.btnsParams);
        }
    }

    public openDescription(storeItem: StoreItem): void {
        this.modalService.showModal('storeItemInfo', {
            title: storeItem.name,
            description: storeItem.description,
            isDisabled: this.storeItem.isAvailable ? false : true,
        });
    }

    public async buyItem(): Promise<void> {
        this.$params.btnsParams.buyBtnParams.pending$?.next(true);
        this.buyClick = true;
        await this.storeService.buyItem(this.storeItem.id);
        this.$params.btnsParams.buyBtnParams.pending$?.next(false);
        this.buyClick = false;
        this.cdr.markForCheck();
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

        if (!this.storeItem.isAvailable) {
            modifiers.push('disabled');
        }

        this.addModifiers(modifiers);
    }
}
