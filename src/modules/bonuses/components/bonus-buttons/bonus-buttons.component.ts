import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    EventService,
    InjectionService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {SportsbookService} from 'wlc-engine/modules/sportsbook';
import {BonusItemComponentEvents} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {Theme as BonusItemTheme} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';

import * as Params from './bonus-buttons.params';

@Component({
    selector: '[wlc-bonus-buttons]',
    templateUrl: './bonus-buttons.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusButtonsComponent extends AbstractComponent implements OnInit {
    @Input() public bonus: Bonus;
    @Input() public bonusItemTheme: BonusItemTheme;
    @Input() public isChooseBtn: boolean;
    public $params: Params.IBonusButtonsCParams;
    public isAuth: boolean;

    private static sportsbookService: SportsbookService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusButtonsCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected router: UIRouter,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IBonusButtonsCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
        }, this.$destroy);

        if (this.configService.get<boolean>('$base.useButtonPending')) {
            GlobalHelper.addPendingToBtnsParams(this.$params.btnsParams);
        }
    }

    /**
     * Determines show or not the play button in template
     *
     * @returns {boolean}
     */
    public get isShowPlayBtn(): boolean {
        return ((this.bonus.isSubscribed && !this.bonus.isDeposit) || this.bonus.isActive)
            && !this.bonus.isLootbox && !this.bonus.inventoried;
    }

    /**
     * Get inventory bonus
     */
    public async getInventory(): Promise<void> {
        const bonus = await this.bonusesService.takeInventory(this.bonus);

        if (bonus) {
            this.bonus = bonus;

            this.redrawingThemeLong();
        }
    }

    /**
     * Subscribe for a bonus
     */
    public async join(): Promise<void> {
        this.$params.btnsParams.subscribeBtnParams.pending$?.next(true);
        const bonus = await this.bonusesService.subscribeBonus(this.bonus);
        this.$params.btnsParams.subscribeBtnParams.pending$?.next(false);

        if (bonus) {
            this.bonus = bonus;
            this.bonusesService.clearPromoBonus();
            this.hideActiveModal('bonus-modal');

            this.redrawingThemeLong();

            if (bonus.event === 'deposit' &&
                this.configService.get<boolean>('$base.finances.redirectAfterDepositBonus')) {
                this.router.stateService.go(
                    this.$params.promoLinks?.deposit?.state || 'app.profile.cash.deposit',
                    this.$params.promoLinks?.deposit?.params || {},
                );
            }
        }
    }

    /**
     * Leave from active bonus
     */
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
                this.$params.btnsParams.cancelBtnParams.pending$?.next(true);
                const bonus = await this.bonusesService.cancelBonus(this.bonus);
                this.$params.btnsParams.cancelBtnParams.pending$?.next(false);
                if (bonus) {
                    this.bonus = bonus;

                    this.redrawingThemeLong();
                }
            },
            dismissAll: true,
        });
    }

    /**
     * Unsubscribe from bonus
     */
    public async unsubscribe(): Promise<void> {
        this.$params.btnsParams.unsubscribeBtnParams.pending$?.next(true);
        const bonus = await this.bonusesService.unsubscribeBonus(this.bonus);
        this.$params.btnsParams.unsubscribeBtnParams.pending$?.next(false);

        if (bonus) {
            this.bonus = bonus;
            this.hideActiveModal('bonus-modal');

            this.redrawingThemeLong();
        }
    }

    /**
     * Open registration modal
     */
    public registration(): void {
        this.modalService.showModal('signup');
    }

    /**
     * Selects the specified bonus
     */
    public chooseBonus(): void {
        this.bonus.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents['reg'],
            data: this.bonus,
        });
    }

    /**
     * Execution select action
     *
     * @param {string} type action type
     */
    public async action(type: string): Promise<void> {
        switch (type) {
            case 'register':
                await this.modalService.showModal('signup');

                if (this.bonusesService.filterBonuses([this.bonus], 'reg').length) {
                    this.chooseBonus();
                }
                break;
            case 'deposit':
                this.router.stateService.go(
                    this.$params.promoLinks?.deposit?.state || 'app.profile.cash.deposit',
                    this.$params.promoLinks?.deposit?.params || {},
                );
                break;
            case 'play':
                this.playActionHandler();
                break;
            case 'openLootbox':
                this.modalService.showModal('lootbox', {bonus: this.bonus});
                break;
        }
    }

    /**
     * Closed bonus modal
     *
     * @param {string} id
     */
    protected hideActiveModal(id: string): void {
        if (this.modalService.getActiveModal(id)) {
            this.modalService.hideModal(id);
        }
    }

    /**
     * Redraw component, if theme long
     *
     * @param {void}
     */
    protected redrawingThemeLong(): void {
        if (this.bonusItemTheme === 'long') {
            this.cdr.markForCheck();
        }
    }

    private async playActionHandler(): Promise<void> {
        switch (this.bonus.bonusType) {
            case 'sport':
                if (!BonusButtonsComponent.sportsbookService) {
                    BonusButtonsComponent.sportsbookService
                        = await this.injectionService.getService('sportsbook.sportsbook-service');
                    await BonusButtonsComponent.sportsbookService.ready;
                }

                if (BonusButtonsComponent.sportsbookService.targetSportsbookEnabled) {
                    this.router.stateService.go(BonusButtonsComponent.sportsbookService.getBonusSportsbookState());
                }
                break;
            default:
                this.router.stateService.go(
                    this.$params.promoLinks?.play?.state || 'app.catalog',
                    this.$params.promoLinks?.play?.params || {category: 'casino'},
                );
                break;
        }
    }
}
