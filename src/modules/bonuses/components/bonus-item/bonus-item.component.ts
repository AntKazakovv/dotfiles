import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {
    AbstractComponent,
    IMixedParams,
    CachingService,
    ConfigService,
    ModalService,
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    Bonus,
    BonusesService,
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';
import * as Params from './bonus-item.params';

import {
    union as _union,
} from 'lodash-es';

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

    public $params: Params.IBonusItemCParams;
    public isAuth: boolean;
    public currency: string;
    public isNoChooseBtn: boolean;
    public isChooseBtn: boolean;
    public isTypeRegDeposit: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemCParams,
        protected cachingService: CachingService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected bonusesService: BonusesService,
        protected router: UIRouter,
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

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams || GlobalHelper.prepareParams(this,
            ['bonus', 'type', 'theme', 'themeMod', 'customMod', 'view', 'chosen']));

        if (this.$params.bonus) {
            this.$params.common.bonus = this.$params.bonus;
        }
        this.bonus = this.$params.bonus || this.$params.common.bonus;

        if (!this.view) {
            this.view = this.$params.common.bonus?.viewTarget || 'default';
        }

        this.eventService.subscribe([
            {name: BonusItemComponentEvents.reg},
            {name: BonusItemComponentEvents.blank},
        ],
        (bonus: Bonus) => {
            if (this.isPreviewTheme) {
                this.$params.common.bonus = bonus;
                this.cdr.markForCheck();
            }
        }, this.$destroy);

        if (this.isPreviewTheme && !this.$params.common.bonus) {
            const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);
            if (chosenBonus?.id) {
                this.$params.common.bonus = chosenBonus as Bonus;
                this.cdr.markForCheck();
            }
        }

        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.currency = this.ConfigService.get<string>('appConfig.user.currency') === 'EUR' ?
            '€' : this.ConfigService.get<string>('appConfig.user.currency');
        this.isTypeRegDeposit = this.$params.common?.type === 'reg' || this.$params.common?.type === 'deposit';
        this.isNoChooseBtn = this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;
        this.isChooseBtn = !this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;

        if (!this.$params.common.bonus?.description) {
            this.addModifiers('no-description');
        }

        if (this.$params.common.bonus?.isActive) {
            this.addModifiers('is-active');
        }

        if (!this.getBonusTag()) {
            this.addModifiers('no-tag');
        }
    }

    public getBonusTag(): string {
        if (this.$params.common.bonus?.isActive) {
            return gettext('Active');
        }
        if (this.$params.common.bonus?.isSubscribed) {
            return gettext('Subscribed');
        }

        if (this.$params.common.bonus?.inventoried) {
            return gettext('Inventoried');
        }
        return this.$params.common.bonus?.group;
    }

    public openDescription(bonus: Bonus): void {
        this.modalService.showModal({
            id: 'bonus-info',
            modalTitle: bonus.name,
            modifier: 'info',
            modalMessage: [
                bonus.description,
            ],
            dismissAll: false,
        });
    }

    public chooseBonusNoBtn(bonus: Bonus, type: Params.Type): void {
        if (!this.isChooseBtn) {
            this.chooseBonus(bonus, type);
        }
    }

    public chooseBonus(bonus: Bonus, type: Params.Type): void {
        bonus.isChoose = this.$params.common.bonus.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents[type],
            data: bonus,
        });
        this.cdr.markForCheck();
    }

    public chooseBlankBonus(): void {
        this.eventService.emit({name: 'CHOOSE_BLANK_BONUS'});
    }

    public async getInventory(): Promise<void> {
        this.bonus = await this.bonusesService.takeInventory(this.bonus);
        if (this.bonus) {
            this.cdr.markForCheck();
        }
    }

    public async join(): Promise<void> {
        this.bonus = await this.bonusesService.subscribeBonus(this.bonus);
        if (this.bonus) {
            this.bonusesService.clearPromoBonus();
            this.cdr.markForCheck();
        }
    }

    public leave(): void {
        this.modalService.showModal({
            id: 'bonus-info',
            modalTitle: gettext('Confirmation'),
            modifier: 'confirmation',
            modalMessage: gettext('Are you sure?'),
            showConfirmBtn: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('No'),
                },
            },
            confirmBtnText: gettext('Yes'),
            textAlign: 'center',
            onConfirm: async () => {
                this.bonus = await this.bonusesService.cancelBonus(this.bonus);
                if (this.bonus) {
                    this.cdr.markForCheck();
                }
            },
            dismissAll: true,
        });
    }

    public async unsubscribe(): Promise<void> {
        this.bonus = await this.bonusesService.unsubscribeBonus(this.bonus);

        if (this.bonus) {
            this.cdr.markForCheck();
        }
    }

    /**
     * Registration
     */
    public registration(): void {
        this.modalService.showModal('signup');
    }

    public action(type: string) {
        switch (type) {
            case 'register':
                this.modalService.showModal('signup');
                setTimeout(() => {
                    this.chooseBonus(this.$params.common?.bonus, 'reg');
                });
                break;
            case 'deposit':
                this.router.stateService.go(
                    this.$params.common?.promoLinks?.deposit.state || 'app.profile.cash.deposit',
                    this.$params.common?.promoLinks?.deposit?.params || {},
                );
                break;
            case 'play':
                this.router.stateService.go(
                    this.$params.common?.promoLinks?.play.state || 'app.catalog',
                    this.$params.common?.promoLinks?.play?.params || {category: 'casino'},
                );
                break;
        }
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
