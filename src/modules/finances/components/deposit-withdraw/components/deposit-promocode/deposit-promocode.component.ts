import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewChild,
    TemplateRef,
    ElementRef,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    ConfigService,
    IButtonCParams,
    IInputCParams,
    IModalConfig,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';

import {
    Bonus,
    BonusesService,
    IBonusModalCParams,
} from 'wlc-engine/modules/bonuses';
import {IAlertCParams} from 'wlc-engine/modules/core/components/alert/alert.params';

import * as Params from './deposit-promocode.params';

@Component({
    selector: '[wlc-deposit-promocode]',
    templateUrl: './deposit-promocode.component.html',
    styleUrls: ['./styles/deposit-promocode.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DepositPromocodeComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IDepositPromoCodeCParams;
    @Input() protected showTooltip: boolean;
    @Output() public promoCodeAppliedEvent: EventEmitter<Bonus> = new EventEmitter();

    @ViewChild('modalForm') public modalForm: TemplateRef<ElementRef>;

    public override $params: Params.IDepositPromoCodeCParams;
    public promoCodeControl: UntypedFormControl = new UntypedFormControl();
    public isBonusApplied: boolean = false;
    public bonusPending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public promoCodeInputHidden: boolean = true;

    public inputParams: IInputCParams;
    public submitBtnParams: IButtonCParams;

    protected bonus: Bonus;
    protected bonusesService: BonusesService;

    private isModal: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositPromoCodeCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.type === 'modal') {
            this.isModal = true;
        }

        this.prepareParams();
    }

    public clickHandler(): void {
        if (this.isModal) {
            this.showPromoCodeModal();
        } else {
            this.showPromoCodeInline();
        }
    }

    public async processPromoCode(): Promise<void> {
        const code: string = this.promoCodeControl.value;
        this.bonusesService ??= await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');

        if (!code || this.bonusPending$.getValue()) {
            this.bonusesService.showPromoCodeError(gettext('Enter promo code'));
            return;
        }

        try {
            this.bonusPending$.next(true);

            const bonuses: Bonus[] = await this.bonusesService.getBonusesByCode(code);

            if (bonuses.length) {
                this.bonus = bonuses[0];
                this.bonus.data.PromoCode = code;
                this.promoCodeControl.setValue(null);

                this.showBonusModal(true);
            } else {
                this.bonusesService.showPromoCodeError(gettext('No voucher found'));
            }
        } catch (error) {
            this.bonusesService.showPromoCodeError(error.errors ? error.errors : error);
        } finally {
            this.bonusPending$.next(false);
        }
    }

    public resetPromoCode(): void {
        this.isBonusApplied = false;
        this.bonus = null;
        this.promoCodeAppliedEvent.emit(null);
        this.cdr.markForCheck();
    }

    public showBonusModal(showConfirm?: boolean): void {
        if (!this.bonus) {
            return;
        }

        const bonusParams: IBonusModalCParams = {
            bonus: this.bonus,
            bonusItemTheme: 'modal',
            hideBonusButtons: true,
            alerts: this.getBonusAlerts(),
        };

        this.modalService.showModal({
            id: 'bonus-modal',
            componentName: 'bonuses.wlc-bonus-modal',
            componentParams: bonusParams,
            size: 'lg',
            showFooter: true,
            showConfirmBtn: showConfirm,
            confirmBtnText: gettext('Apply'),
            onConfirm: () => {
                this.applyPromoCode();
            },
        });
    }

    private getBonusAlerts(): IAlertCParams[] {
        const alerts: IAlertCParams[] = [];

        if (!this.bonus.isDeposit) {
            alerts.push({
                title: gettext('The bonus is not a deposit one'),
            });
        }

        let defaultAlert: string = gettext('Upon activation of this promo code bonus, '
            + 'the selection of another deposit bonus will be reset');
        if (this.isBonusApplied) {
            defaultAlert = gettext('This promo code bonus prohibits the selection of another deposit bonus');
        }

        alerts.push({
            title: defaultAlert,
        });

        return alerts;
    }

    private prepareParams(): void {
        if (this.isModal) {
            this.assignInputAndButtonParams(this.$params.modalFormParams);
        } else {
            this.assignInputAndButtonParams(this.$params.inlineFormParams);
        }

        _set(this.inputParams, 'control', this.promoCodeControl);
        _set(this.submitBtnParams, 'pending$', this.bonusPending$);
    }

    private assignInputAndButtonParams(params): void {
        this.inputParams = params.inputParams;
        this.submitBtnParams = params.submitBtnParams;
    }

    private showPromoCodeModal(): void {
        const modalConfig: IModalConfig = {
            id: 'deposit-promocode',
            modifier: 'deposit-promocode',
            modalTitle: gettext('Promo code'),
            size: 'md',
            showFooter: false,
            templateRef: this.modalForm,
        };

        this.modalService.showModal(modalConfig);
    }

    private showPromoCodeInline(): void {
        this.promoCodeInputHidden = false;
    }

    private applyPromoCode(): void {
        this.modalService.closeAllModals();
        this.promoCodeAppliedEvent.emit(this.bonus);
        this.isBonusApplied = true;
        this.cdr.markForCheck();
    }
}
