import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _union from 'lodash-es/union';
import _merge from 'lodash-es/merge';
import _get from 'lodash-es/get';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
    ITooltipCParams,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';
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

    public $params: Params.IBonusItemCParams;
    public isAuth: boolean;
    public currency: string;
    public isChooseBtn: boolean;
    public useIconBonusImage: boolean;
    public asProfileTypeFirst: boolean;
    public bonus: Bonus;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get isPreviewTheme(): boolean {
        return this.$params.theme === 'preview';
    }

    public get selectedTag(): string {
        if (this.$params.theme === 'reg-first' && this.bonus.isChoose) {
            return gettext('Selected');
        }
    }

    public get bonusBg(): string {
        let imageUrl: string;

        if (!this.bonus) {
            imageUrl = this.$params.dummy
                ? this.configService.get<string>('$bonuses.defaultImages.imageDummy')
                : this.configService.get<string>('$bonuses.defaultImages.imageBlank');

        } else if (this.$params.theme === 'promo-home') {
            imageUrl = this.bonus.imagePromoHome;

        } else if (this.$params.theme === 'preview') {
            imageUrl = this.bonus.imageReg;

        } else if (this.asProfileTypeFirst) {
            imageUrl = this.bonus.imageProfileFirst;

        } else if (this.$params.theme === 'partial') {

            if (this.$params.themeMod === 'with-image' && this.$params.usePartialMobileImage) {
                imageUrl = this.bonus.image;
            }

        } else {
            imageUrl = this.bonus.image;
        }

        return imageUrl ? `url(${imageUrl})` : '';
    }

    public ngOnInit(): void {
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

        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(takeUntil(this.$destroy))
            .subscribe((profile) => {
                this.isAuth = this.configService.get('$user.isAuthenticated');
                if (this.bonus) {
                    if (this.isAuth) {
                        this.bonus.userCurrency = profile?.currency
                            || this.configService.get<string>('$base.defaultCurrency');
                    } else {
                        this.bonus.userCurrency = 'EUR';
                    }
                    this.cdr.markForCheck();
                }
            });

        if (this.bonus) {
            this.bonus.onChooseChange?.pipe(takeUntil(this.$destroy))
                .subscribe((): void => {
                    this.cdr.detectChanges();
                });
        }
    }

    public ngOnChanges(): void {
        if (_get(this.$params, 'theme') === 'mini'
            && (_get(this.inlineParams, 'bonus.id') !== _get(this, 'bonus.id')
                || _get(this.inlineParams, 'bonus.isChoose') !== _get(this, 'bonus.isChoose'))) {
            this.ngOnInit();
        }
    }

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
     */
    public openDescription($event: MouseEvent): void {
        $event.stopPropagation();

        const modalParams: IBonusModalCParams = _merge({
            bonus: this.bonus,
            bonusItemTheme: this.$params.theme,
        }, this.$params.bonusModalParams || {});

        if (this.bonus.isLootbox) {
            modalParams.bonusItemTheme = 'lootbox';
            modalParams.accordionParams = {
                title: gettext('Possible rewards'),
                titleIconPath: '/wlc/icons/arrow.svg',
                collapseAll: true,
                items: [],
            };

            _each(this.bonusesService.bonuses, (bonus: Bonus): void => {
                if (_includes(<number[]>this.bonus.value, bonus.id)) {
                    modalParams.accordionParams.items.push({
                        title: bonus.name,
                        content: bonus.descriptionClean,
                    });
                }
            });
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
            setTimeout (() => {
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

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        modifiers.push(`view-${this.bonus?.viewTarget || 'default'}`);

        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common?.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);

        if (this.asProfileTypeFirst) {
            this.useIconBonusImage = false;
            this.addModifiers('theme-mod-with-image');
        } else if (this.$params.theme === 'partial') {
            this.useIconBonusImage = true;
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
    }
}
