import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';
import _union from 'lodash-es/union';
import _merge from 'lodash-es/merge';
import _get from 'lodash-es/get';
import _map from 'lodash-es/map';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
    ITooltipCParams,
} from 'wlc-engine/modules/core';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';
import {IBonusModalCParams} from 'wlc-engine/modules/bonuses/components/bonus-modal/bonus-modal.params';

import * as Params from './bonus-item.params';

@Component({
    selector: '[wlc-bonus-item]',
    templateUrl: './bonus-item.component.html',
    styleUrls: ['./styles/bonus-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class BonusItemComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() public inlineParams: Params.IBonusItemCParams;

    public override $params: Params.IBonusItemCParams;
    public isAuth: boolean;
    public currency: string;
    public isChooseBtn: boolean;
    public useIconBonusImage: boolean;
    public asProfileTypeFirst: boolean;
    public bonus: Bonus;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.dummy) {
            this.addModifiers('dummy');
            return;
        }

        this.bonus = this.$params.bonus;

        if (this.isPreviewTheme) {
            this.eventService.subscribe([
                {name: BonusItemComponentEvents.reg},
                {name: BonusItemComponentEvents.blank},
            ], (bonus: Bonus) => {
                this.bonus = bonus;
                if (this.configService.get<boolean>('EMPTY_REGISTER_BONUSES')) {
                    this.$params.dummy = true;
                    this.addModifiers('dummy');
                } else if (this.$params.dummy && this.hasModifier('dummy')) {
                    this.$params.dummy = false;
                    this.removeModifiers('dummy');
                } else if (!this.bonus) {
                    this.addModifiers('blank');
                } else if (this.hasModifier('blank')) {
                    this.removeModifiers('blank');
                }
                this.cdr.detectChanges();
            }, this.$destroy);
        }

        if (this.isPreviewTheme && !this.bonus) {
            const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);
            if (chosenBonus?.id) {
                this.bonus = chosenBonus as Bonus;
            } else if (this.configService.get<boolean>('EMPTY_REGISTER_BONUSES')) {
                this.$params.dummy = true;
                this.addModifiers('dummy');
            } else if (!this.bonus) {
                this.addModifiers('blank');
            }
            this.cdr.markForCheck();
        }

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.isChooseBtn = !this.$params.common?.hideChooseBtn;
        this.useIconBonusImage = this.configService.get<boolean>('$bonuses.useIconBonusImage');
        this.asProfileTypeFirst =
            this.configService.get<string>('$base.profile.type') === 'first' && !this.$params.noDependsOnProfile;

        this.prepareModifiers();

        if (this.bonus) {
            this.bonus.onChooseChange?.pipe(takeUntil(this.$destroy))
                .subscribe((): void => {
                    this.cdr.detectChanges();
                });
        }
    }

    public override ngOnChanges(change: SimpleChanges): void {
        if ((_get(this.$params, 'theme') === 'mini'
                && (_get(this.inlineParams, 'bonus.id') !== _get(this, 'bonus.id')
                    || _get(this.inlineParams, 'bonus.isChoose') !== _get(this, 'bonus.isChoose')))
            || (_get(this.$params, 'theme') === 'long' && change.inlineParams)) {
            this.ngOnInit();
        }
    }

    public get isPreviewTheme(): boolean {
        return this.$params.theme === 'preview';
    }

    public get selectedTag(): string {
        if (this.$params.theme === 'reg-first' && this.bonus.isChoose) {
            return gettext('Selected');
        }
    }

    /**
     * Indicates is themeMod equal to 'with-image' or not
     *
     * @returns {boolean}
     */
    public get isThemeModWithImage(): boolean {
        return this.$params.themeMod === 'with-image';
    }

    public get valueBonus(): number {
        return _isArray(this.bonus.value) ? 0 : this.bonus.value;
    }

    public get bonusBg(): string {
        let imageUrl: string;

        if (!this.bonus) {
            imageUrl = this.$params.dummy
                ? this.configService.get<string>('$bonuses.defaultImages.imageDummy') || this.$params.dummyBonusImage
                : this.configService.get<string>('$bonuses.defaultImages.imageBlank') || this.$params.blankBonusImage;

        } else if (this.$params.theme === 'promo-home') {
            imageUrl = this.bonus.imagePromoHome;

        } else if (this.$params.theme === 'preview') {
            imageUrl = this.bonus.imageReg;

        } else if (this.$params.theme === 'mini') {
            imageUrl = this.bonus.imageDeposit;

        } else if (this.asProfileTypeFirst) {
            imageUrl = this.bonus.imageProfileFirst;

        } else if (this.$params.theme === 'partial') {

            if (this.$params.usePartialMobileImage) {
                imageUrl = this.bonus.image;
            }

        } else {
            imageUrl = this.bonus.image;
        }

        return imageUrl ? `url(${imageUrl})` : '';
    }

    /**
     * detectChanges after image loading error
     * @returns {void}
     */
    public imageErrorLoad(): void {
        this.cdr.detectChanges();
    };

    /**
     * Get promo bonus background image url
     *
     * @param {'promo' | 'default'} imageType
     * @returns {string} image url
     */
    public getPromoBg(imageType: 'promo' | 'default'): string {
        if (imageType === 'default') {
            return this.bonus.imageProfileFirst;
        }

        return this.bonus.imagePromo;
    }

    /**
     * Open bonus modal
     *
     * @param {MouseEvent} $event
     *
     * @returns {Promise<void>}
     */
    public async openDescription($event: MouseEvent): Promise<void> {
        $event.stopPropagation();

        const modalParams: IBonusModalCParams = _merge({
            bonus: this.bonus,
            bonusItemTheme: this.$params.theme,
        }, this.$params.bonusModalParams || {});

        if (this.$params.theme  === 'preview' || this.$params.theme === 'reg-first') {
            modalParams.hideBonusButtons = true;
        }
        if (this.bonus.isLootbox) {
            const lootboxPrizes: LootboxPrizeModel[] = await this.bonusesService.getLootboxPrizes(this.bonus);

            modalParams.accordionParams = {
                title: gettext('Possible rewards'),
                titleIconPath: '/wlc/icons/arrow.svg',
                collapseAll: true,
                items: _map(lootboxPrizes, ((bonus) => {
                    return {
                        title: bonus.name,
                        content: [bonus.descriptionClean, bonus.termsClean],
                    };
                })),
            };
        }

        this.modalService.showModal('bonusModal', modalParams);
    }

    /**
     * choose this bonus on click (theme partial or reg-first)
     */
    public chooseBonusNoBtn(): void {
        if (this.$params.theme === 'partial' || this.$params.theme === 'reg-first') {
            this.bonus.isChoose = true;
            this.eventService.emit({
                name: BonusItemComponentEvents['reg'],
                data: this.bonus,
            });
            this.cdr.detectChanges();
        }
    }

    /**
     * Emit choose blank bonus event
     */
    public chooseBlankBonus(): void {
        this.bonus.isChoose = true;
        this.eventService.emit({name: 'CHOOSE_BLANK_BONUS'});
        this.cdr.detectChanges();
    }

    /**
     * Add to cache expired bonus and refresh bonus list
     * Refresh one more time after 5 min (backend crone timer)
     */
    public updateBonuses(): void {
        if (this.bonus.isActive && !this.bonus.isExpired) {
            this.bonus.addToCache('expired');
            this.eventService.emit({name: 'BONUS_REFRESH'});
            setTimeout((): void => {
                this.eventService.emit({name: 'BONUS_REFRESH'});
            }, 310000);
        }
    }

    public getErrTooltipParams(): ITooltipCParams {
        return {
            inlineText: this.bonus.disabledReason,
            themeMod: 'error',
            bsTooltipMod: 'error',
            iconName: 'blocked',
        };
    }

    /**
     * showing or not the bonus icon
     *
     * @returns {boolean}
     */
    public get isShowBonusIcon(): boolean {
        return (!this.asProfileTypeFirst && this.useIconBonusImage)
            || (this.$params.theme === 'partial' && !_includes(this.$params?.modifiers, 'mobile-reg'))
            || this.bonus.showOnly;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = this.$params?.modifiers || [];
        modifiers.push(`view-${this.bonus?.viewTarget || 'default'}`);

        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common?.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);

        if (this.asProfileTypeFirst) {
            this.addModifiers('theme-mod-with-image');
        }

        if (!this.bonus?.description) {
            this.addModifiers('no-description');
        }

        if (this.bonus?.isActive) {
            this.addModifiers('is-active');
        }

        if (!this.bonus?.tag && !this.selectedTag) {
            this.addModifiers('no-tag');
        }

        if (!this.useIconBonusImage) {
            this.addModifiers('without-bonus-icon');
        }

        if (this.bonus?.showOnly) {
            this.addModifiers('show-only');
        }
    }
}
