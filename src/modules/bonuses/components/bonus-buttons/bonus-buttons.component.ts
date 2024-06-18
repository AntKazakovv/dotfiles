import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Input,
    Output,
    ViewChild,
    TemplateRef,
    ElementRef,
    EventEmitter,
    AfterViewChecked,
} from '@angular/core';

import {UIRouter} from '@uirouter/core';
import _map from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';
import _forOwn from 'lodash-es/forOwn';

import {
    AbstractComponent,
    IMixedParams,
    ModalService,
    EventService,
    InjectionService,
    GlobalHelper,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {ButtonComponent} from 'wlc-engine/modules/core/components/button/button.component';
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
    styleUrls: ['./styles/bonus-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusButtonsComponent extends AbstractComponent implements OnInit, AfterViewChecked {
    @Input() public inlineParams: Partial<Params.IBonusButtonsCParams>;
    @Input() public bonus: Bonus;
    @Input() public bonusItemTheme: BonusItemTheme;
    @Input() public isChooseBtn: boolean;
    @Input() public isInsideModal: boolean;
    @Input() public readMoreClick: () => Promise<void>;
    @Input() public size: Size;
    @Input() public useReadMoreBtnMode: boolean;
    @Output() public showGames = new EventEmitter<void>();

    @ViewChild('cancelModal') public tplModal: TemplateRef<ElementRef>;
    @ViewChild('subscribeModal') public subscribeModal: TemplateRef<ElementRef>;
    @ViewChild(ButtonComponent) protected someExistedButton: ButtonComponent;
    public override $params: Params.IBonusButtonsCParams;
    public isAuth: boolean;
    public isDisableButtons: boolean;
    public isEmpty: boolean = false;

    private static sportsbookService: SportsbookService;
    private componentWillBeDestroyedNow: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusButtonsCParams,
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
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareCParams(this, ['isInsideModal']));
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

        /**
         * We must guarantee that each btn has wlcElement for correct "isEmpty" working
         * **/
        _forOwn(this.$params.btnsParams, (btn: IButtonCParams, key: string): void => {
            if (!btn.wlcElement) {
                btn.wlcElement = key;
            }
        });
    }

    /**
     * Check if component has no buttons (except 'Close' and 'Read more' buttons)
     */
    public ngAfterViewChecked(): void {
        const isEmpty: boolean = !this.someExistedButton ||
            [
                this.$params.btnsParams.closeBtnParams.wlcElement,
                this.$params.btnsParams.readMoreBtnParams.wlcElement,
            ].includes(this.someExistedButton.$params?.wlcElement);

        if (this.isEmpty !== isEmpty) {
            this.isEmpty = isEmpty;
            this.cdr.detectChanges();
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
    public async clickHandleHof(handler: Params.TClickHandler, ...args: unknown[]): Promise<void> {
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
     * Show read more button on card if there are no other buttons.
     *
     * @returns {boolean}
     */
    public get isShowReadMoreBtn(): boolean {
        return this.isEmpty && !this.$params.isInsideModal || this.useReadMoreBtnMode && !this.bonus.showOnly;
    }

    /**
     * Show close button inside modal if there are no other buttons.
     *
     * @returns {boolean}
     */
    public get isShowCloseBtn(): boolean {
        return this.isEmpty && this.$params.isInsideModal;
    }

    /**
     * Not shown in the unavailable bonuses cards.
     *
     * @returns {boolean}
     */
    public get isShowDepositBtn(): boolean {
        return this.bonus.canDeposit && !this.bonus.isUnavailableForActivation;
    }

    public get isShowPlayBtn(): boolean {
        return this.bonus.canPlay && !this.bonus.isUnavailableForActivation;
    }

    public get isShowTakeBtn(): boolean {
        return this.bonus.canInventory && !this.bonus.isUnavailableForActivation;
    }

    public get isShowOpenBtn(): boolean {
        return this.bonus.canOpen && !this.bonus.isUnavailableForActivation;
    }

    /**
     * Not shown in the inventoried bonus card, but shown inside modal of them.
     * Not shown in the unavailable bonus card, but shown inside modal of them.
     * @returns {boolean}
     */
    public get isShowUnsubscribeBtn(): boolean {
        return this.bonus.canUnsubscribe
            && (!this.bonus.inventoried || this.$params.isInsideModal)
            && (!this.bonus.isUnavailableForActivation || this.$params.isInsideModal);
    }

    /**
     * Get inventory bonus
     */
    public async getInventory(): Promise<void> {
        this.$params.btnsParams.takeBtnParams.pending$?.next(true);
        const bonus: Bonus = await this.bonusesService.takeInventory(this.bonus);
        this.$params.btnsParams.takeBtnParams.pending$?.next(false);

        if (bonus) {
            this.bonus = bonus;
            this.hideActiveModal('bonus-modal');
        }
    }

    /**
     * Subscribe for a bonus event handler
     */
    public async join(): Promise<void> {
        if (this.bonus.stackIsUnavailable) {
            await this.modalService.showModal({
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
                templateRef: this.subscribeModal,
                textAlign: 'center',
                onConfirm: async () => {
                    await this.subscribe();
                },
                dismissAll: true,
            });
        } else {
            await this.subscribe();
        }
    }

    /**
     * Leave from active bonus event handler
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
     * Subscribe for a bonus
     */
    public async subscribe(): Promise<void> {
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
