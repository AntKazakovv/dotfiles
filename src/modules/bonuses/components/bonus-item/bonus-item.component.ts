import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    Bonus,
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
    IBonusType,
} from 'wlc-engine/modules/bonuses';
import {UserProfile} from 'wlc-engine/modules/user';

import * as Params from './bonus-item.params';

import _union from 'lodash-es/union';
import _merge from 'lodash-es/merge';
import _isEmpty from 'lodash-es/isEmpty';

@Component({
    selector: '[wlc-bonus-item]',
    templateUrl: './bonus-item.component.html',
    styleUrls: ['./styles/bonus-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class BonusItemComponent extends AbstractComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public inlineParams: Params.IBonusItemCParams;
    @Input() public type: Params.Type;
    @Input() public theme: Params.Theme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public view: string;
    @Input() public chosen: boolean;
    @Input() public bonus: Bonus;
    @Input() public dummy: boolean;

    public $params: Params.IBonusItemCParams;
    public isAuth: boolean;
    public currency: string;
    public isNoChooseBtn: boolean;
    public isChooseBtn: boolean;
    public isTypeRegDeposit: boolean;
    public useIconBonusImage: boolean;
    public profileTypeFirst: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
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
        if (this.$params.theme === 'reg-first' && this.$params.common.bonus.isChoose) {
            return gettext('Selected');
        }
    }

    public get bonusBg(): string {
        const {bonus, imageByType, type} = this.$params.common;

        if (imageByType) {
            return `url(${bonus.getImageByType(type)})`;
        } else if (bonus.image) {
            return `url(${bonus.image})`;
        }
    }

    public ngOnInit(): void {

        const inlineParams = _merge(
            this.inlineParams || {},
            GlobalHelper.prepareParams(this,
                ['bonus', 'type', 'theme', 'themeMod', 'customMod', 'view', 'chosen']) || {},
        );

        super.ngOnInit(_isEmpty(inlineParams) ? null : inlineParams);

        if (this.dummy) {
            this.addModifiers('dummy');
            return;
        }

        if (this.$params.bonus) {
            this.$params.common.bonus = this.$params.bonus;
        }
        this.bonus = this.$params.bonus || this.$params.common.bonus;

        if (!this.view) {
            this.view = this.$params.common.bonus?.viewTarget || 'default';
        }

        if (this.isPreviewTheme) {
            this.eventService.subscribe([
                {name: BonusItemComponentEvents.reg},
                {name: BonusItemComponentEvents.blank},
            ], (bonus: Bonus) => {
                this.$params.common.bonus = bonus;
                if (this.configService.get<boolean>('EMPTY_REGISTER_BONUSES')) {
                    this.dummy = true;
                    this.addModifiers('dummy');
                } else if (this.dummy === true && this.hasModifier('dummy')) {
                    this.dummy = false;
                    this.removeModifiers('dummy');
                }
                this.cdr.markForCheck();
            }, this.$destroy);
        }

        if (this.isPreviewTheme && !this.$params.common.bonus) {
            const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);
            if (chosenBonus?.id) {
                this.$params.common.bonus = chosenBonus as Bonus;
            } else if (this.configService.get<boolean>('EMPTY_REGISTER_BONUSES')) {
                this.dummy = true;
                this.addModifiers('dummy');
            }
            this.cdr.markForCheck();
        }

        this.prepareModifiers();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.isTypeRegDeposit = this.$params.common?.type === 'reg' || this.$params.common?.type === 'deposit';
        this.isNoChooseBtn = this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;
        this.isChooseBtn = !this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;
        this.useIconBonusImage = this.configService.get<boolean>('$bonuses.useIconBonusImage');
        this.profileTypeFirst = this.configService.get<string>('$base.profile.type') === 'first';

        if (this.profileTypeFirst) {
            this.useIconBonusImage = false;
            this.addModifiers('theme-mod-with-image');
        }

        if (!this.$params.common.bonus?.description) {
            this.addModifiers('no-description');
        }

        if (this.$params.common.bonus?.isActive) {
            this.addModifiers('is-active');
        }

        if (!this.$params.common.bonus?.tag && !this.selectedTag) {
            this.addModifiers('no-tag');
        }

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
    }

    public getPromoBg(imageType: 'promo' | 'default'): string {
        const {bonus} = this.$params.common;

        if (this.profileTypeFirst && (imageType === 'default')) {
            return bonus.image;
        }

        return bonus.imagePromo;
    }

    public openDescription(bonus: Bonus): void {
        this.modalService.showModal('bonusModal', {bonus, 'bonusItemTheme': this.$params.theme});
    }

    public chooseBonusNoBtn(bonus: Bonus, type: IBonusType): void {
        if (!this.isChooseBtn || this.$params.theme === 'reg-first') {
            bonus.isChoose = this.$params.common.bonus.isChoose = true;
            this.eventService.emit({
                name: BonusItemComponentEvents[type] || BonusItemComponentEvents['other'],
                data: bonus,
            });
            this.cdr.markForCheck();
        }
    }

    public chooseBlankBonus(): void {
        this.eventService.emit({name: 'CHOOSE_BLANK_BONUS'});
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        modifiers.push(`view-${this.view}`);

        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
