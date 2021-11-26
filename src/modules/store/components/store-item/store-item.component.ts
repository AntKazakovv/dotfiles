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

import _union from 'lodash-es/union';

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
    public buyClick: boolean = false;
    public storeImage: string;
    public useIconBonusImage: boolean;
    protected isProfileFirst: boolean;

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
    }

    public openDescription(storeItem: StoreItem): void {
        this.modalService.showModal({
            id: 'store-item-info',
            modalTitle: storeItem.name,
            wlcElement: 'store_modal-info',
            modifier: 'info',
            html: storeItem.description,
            dismissAll: true,
        });
    }

    public async buyItem(): Promise<void> {
        this.buyClick = true;
        await this.storeService.buyItem(this.storeItem.id);
        this.buyClick = false;
        this.cdr.markForCheck();
    }
    /** builds path for bonus icon */
    public get bonusIconPath(): string {
        return `${this.$params.common?.bonusIconsPath}`
            + `${this.storeItem.bonus.viewTarget}`
            + `.${this.$params.common?.iconFormat}`;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
