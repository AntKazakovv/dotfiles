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
} from 'wlc-engine/modules/core';
import {
    Bonus,
    BonusesService,
    BonusItemComponentEvents,
    IBonusType,
} from 'wlc-engine/modules/bonuses';
import * as Params from './bonus-buttons.params';

@Component({
    selector: '[wlc-bonus-buttons]',
    templateUrl: './bonus-buttons.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusButtonsComponent extends AbstractComponent implements OnInit {
    @Input() public bonus: Bonus;
    @Input() public bonusItemTheme: string;
    @Input() public isChooseBtn: boolean;
    public $params: Params.IBonusButtonsCParams;
    public isAuth: boolean;
    public isTypeRegDeposit: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusButtonsCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IBonusButtonsCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.isTypeRegDeposit = this.$params.bonusType === 'reg' || this.$params.bonusType === 'deposit';

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.detectChanges();
        }, this.$destroy);
    }

    /**
     * Get inventory bonus
     */
    public async getInventory(): Promise<void> {
        const bonus = await this.bonusesService.takeInventory(this.bonus);

        if (bonus) {
            this.bonus = bonus;
            this.cdr.markForCheck();
        }
    }

    /**
     * Subscribe for a bonus
     */
    public async join(): Promise<void> {
        const bonus = await this.bonusesService.subscribeBonus(this.bonus);

        if (bonus) {
            this.bonus = bonus;
            this.bonusesService.clearPromoBonus();
            this.hideActiveModal('bonus-modal');
            this.cdr.markForCheck();
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
                const bonus = await this.bonusesService.cancelBonus(this.bonus);
                if (bonus) {
                    this.bonus = bonus;
                    this.cdr.markForCheck();
                }
            },
            dismissAll: true,
        });
    }

    /**
     * Unsubscribe from bonus
     */
    public async unsubscribe(): Promise<void> {
        const bonus = await this.bonusesService.unsubscribeBonus(this.bonus);

        if (bonus) {
            this.bonus = bonus;
            this.hideActiveModal('bonus-modal');
            this.cdr.markForCheck();
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
     *
     * @param bonus {Bonus} choose bonus
     * @param type {IBonusType} bonus type
     */
    public chooseBonus(bonus: Bonus, type: IBonusType): void {
        bonus.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents[type] || BonusItemComponentEvents['other'],
            data: bonus,
        });
        this.cdr.markForCheck();
    }

    /**
     * Execution select action
     *
     * @param type {string} action type
     */
    public async action(type: string) {
        switch (type) {
            case 'register':
                await this.modalService.showModal('signup');

                if (this.bonusesService.filterBonuses([this.bonus], 'reg').length) {
                    this.chooseBonus(this.bonus, 'reg');
                }
                break;
            case 'deposit':
                this.router.stateService.go(
                    this.$params.promoLinks?.deposit?.state || 'app.profile.cash.deposit',
                    this.$params.promoLinks?.deposit?.params || {},
                );
                break;
            case 'play':
                this.router.stateService.go(
                    this.$params.promoLinks?.play?.state || 'app.catalog',
                    this.$params.promoLinks?.play?.params || {category: 'casino'},
                );
                break;
        }
    }

    /**
     * Closed bonus modal
     *
     * @param id {string}
     */
    protected hideActiveModal(id: string): void {
        if (this.modalService.getActiveModal(id)) {
            this.modalService.hideModal(id);
        }
    }
}
