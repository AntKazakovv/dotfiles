import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Input,
    Output,
    ViewChild,
    TemplateRef,
    ElementRef,
    EventEmitter,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import _map from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';

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
import {Size} from 'wlc-engine/modules/core/components/button/button.params';

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
    @Input() public isInsideModal: boolean = false;
    @Input() public readMoreClick: () => Promise<void>;
    @Input() public isShowUnsubscribe: boolean = false;
    @Input() public size: Size;
    @Output() public showGames = new EventEmitter<void>();

    @ViewChild('cancelModal') public tplModal: TemplateRef<ElementRef>;
    public override $params: Params.IBonusButtonsCParams;
    public isAuth: boolean;
    public isDisableButtons: boolean;

    private static sportsbookService: SportsbookService;
    private componentWillBeDestroyedNow: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusButtonsCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
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
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        if (this.size) {
            this.addButtonsSize();
        }

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
     * High Order Function for disable all buttons when some of them in action
     *
     * @param handler event handler
     * @param args event handler params
     *
     * @returns {void}
     */
    public async clickHandleHof(handler: Params.TClickHandler, ...args: unknown[]): Promise<void>  {
        if (handler) {
            this.isDisableButtons = true;
            await handler.bind(this, ...args)();

            if (!this.componentWillBeDestroyedNow) {
                this.isDisableButtons = false;
                this.cdr.markForCheck();
            }
        }
    }

    /**
     * Determines show or not the unsubscribe button in template.
     * Not shown in the inventory bonuses cards, but shown inside modal of them.
     *
     * @returns {boolean}
     */
    public get isShowUnsubscribeBtn(): boolean {
        return this.bonus.canUnsubscribe && (!this.bonus.inventoried || this.isInsideModal);
    }

    /**
     * Get inventory bonus
     */
    public async getInventory(): Promise<void> {
        const bonus: Bonus = await this.bonusesService.takeInventory(this.bonus);

        if (bonus) {
            this.bonus = bonus;
            this.hideActiveModal('bonus-modal');
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
            showConfirmBtn: true,
            confirmBtnText: gettext('Yes'),
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('No'),
                },
            },
            templateRef: this.tplModal,
            textAlign: 'center',
            onConfirm: async () => {
                this.$params.btnsParams.cancelBtnParams.pending$?.next(true);
                const bonus = await this.bonusesService.cancelBonus(this.bonus);
                this.$params.btnsParams.cancelBtnParams.pending$?.next(false);
                if (bonus) {
                    this.bonus = bonus;
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
            case 'close':
                this.hideActiveModal('bonus-modal');
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
            this.componentWillBeDestroyedNow = true;
        }
    }

    protected addButtonsSize(): void {
        this.$params.btnsParams = _map(this.$params.btnsParams, (btnParams) => {
            return _merge(btnParams, {common: {size: this.size}});
        });
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
                if (this.bonusItemTheme !== 'modal') {
                    this.readMoreClick();
                } else {
                    this.showGames.emit();
                }
                break;
        }
    }
}
