import {
    Component,
    OnInit,
    OnChanges,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewChild,
    TemplateRef,
    ElementRef,
    Output,
    EventEmitter,
    SimpleChanges,
    inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IButtonCParams,
    IInputCParams,
    IModalConfig,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';

import {
    Bonus,
    PromoCodeService,
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

export class DepositPromocodeComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.IDepositPromoCodeCParams;
    @Input() protected showTooltip: boolean;
    @Input() protected bonus: Bonus;

    @Output() public promoCodeAppliedEvent: EventEmitter<Bonus> = new EventEmitter();

    @ViewChild('modalForm') public modalForm: TemplateRef<ElementRef>;

    public override $params: Params.IDepositPromoCodeCParams;
    public promoCodeControl: UntypedFormControl = new UntypedFormControl();
    public bonusPending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public promoCodeInputHidden: boolean = true;

    public inputParams: IInputCParams;
    public submitBtnParams: IButtonCParams;

    protected _isBonusApplied: boolean = false;
    protected promoCodeService: PromoCodeService = inject(PromoCodeService);

    private isModal: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositPromoCodeCParams,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.type === 'modal') {
            this.isModal = true;
        }

        this.prepareParams();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes['bonus']) {
            this._isBonusApplied = !!changes['bonus'].currentValue;
        }
    }

    public get isBonusApplied(): boolean {
        return this._isBonusApplied;
    }

    public get bonusName(): string {
        return this.bonus?.name;
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

        if (!code || this.bonusPending$.getValue()) {
            return;
        }

        try {
            this.bonusPending$.next(true);

            const bonus: Bonus = await this.promoCodeService.getBonusByCode(code);

            if (bonus) {
                this.bonus = bonus;
                this.promoCodeControl.setValue(null);

                this.showBonusModal(true);
            }
        } catch (error) {
            this.promoCodeService.showPromoCodeError(error.errors ? error.errors : error);
        } finally {
            this.bonusPending$.next(false);
        }
    }

    public resetPromoCode(): void {
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
                title: gettext('The bonus does not qualify as a deposit one'),
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
        this.modalService.hideModal('bonus-modal');

        if (this.isModal) {
            this.modalService.hideModal('deposit-promocode');
        };

        this.promoCodeAppliedEvent.emit(this.bonus);
    }
}
