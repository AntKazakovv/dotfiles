import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    takeUntil,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _isObject from 'lodash-es/isObject';
import _concat from 'lodash-es/concat';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IInputCParams,
    IPushMessageParams,
    ITextBlockCParams,
    IValidatorSettings,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {UserInfo} from 'wlc-engine/modules/user';
import {TransferService} from 'wlc-engine/modules/transfer/system/services';
import {
    TransferByEnum,
    ITransferLimits,
    ITransferResponse,
    ITransferSendDataParams,
} from 'wlc-engine/modules/transfer/system/interfaces';
import {ITransferCodeFormCParams, TransferCodeFormComponent} from '../transfer-code-form/transfer-code-form.component';
import {TransferModel} from 'wlc-engine/modules/transfer/system/models';

import * as Params from './transfer.params';

@Component({
    selector: '[wlc-transfer]',
    templateUrl: './transfer.component.html',
    styleUrls: ['./styles/transfer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent extends AbstractComponent implements OnInit {

    public ready: boolean = false;
    public override $params: Params.ITransferCParams;
    public formConfig: IFormWrapperCParams;

    private mainForm: UntypedFormGroup;
    private userBalance: number;
    private transfer: TransferModel;
    private smsEnabled: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransferCParams,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
        configService: ConfigService,
        protected modalService: ModalService,
        protected transferService: TransferService,
        protected translateService: TranslateService,
        protected stateService: StateService,
    ) {
        super({
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.smsEnabled = this.configService.get<boolean>('appConfig.smsEnabled');
        this.userDataSetSubscribers();
        try {
            const transfer: TransferModel = await this.transferService.getTransferData();
            const bonusInfo: Bonus = await this.transferService.getBonusInfo();
            if (transfer && bonusInfo) {
                this.transfer = transfer;
                this.getInfoConfig(bonusInfo);
                this.getMainFormConfig();
                this.ready = true;
                this.cdr.markForCheck();
            }
        } catch (error) {
            const isGiftsAllowed = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .getValue()?.transfersAllowed;
            if (error.errors && isGiftsAllowed) {
                this.showMessage(_concat(error.errors), true);
            } else {
                this.showMessage(gettext('Something went wrong. Please contact with support service.'), true);
            }
            this.goToDashboard();
        }
    }

    /**
     * Get code
     *
     * @param {UntypedFormGroup} form Enter email, type and amount form data
     *
     * @return {Promise} boolean
     */
    public async sendTransferData(form: UntypedFormGroup): Promise<boolean> {
        const params: ITransferSendDataParams = {
            email: form.value.recipient || null,
            amount: form.value.amount || null,
            type: form.value.type || 'email',
        };
        if (_find(params, (item: number | string): boolean => !item)) {
            form.markAllAsTouched();
            return;
        }
        if (this.userBalance < +form.value.amount) {
            this.showMessage(gettext('Insufficient account balance'), true);
            return;
        }
        form.disable();
        try {
            const response: ITransferResponse = await this.transferService.sendData(params);
            if (response && !this.transfer.disableConfirmation) {
                this.openCodeForm();
            } else {
                this.resetMainForm();
                this.showMessage(
                    this.translateService.instant(gettext('A gift for a friend has been successfully sent.' +
                        ' The gift is available in a friend\'s bonus offers.')),
                );
            }
            return true;
        } catch (error) {
            if (Object.keys(error.errors)[0] === 'email') {
                this.showMessage(error.errors['email'], true);
                form.controls.email.setErrors({'email': true});
            } else {
                this.showMessage(_concat(error.errors), true);
            }
            return false;
        } finally {
            form.enable();
        }
    }

    public getForm(form: UntypedFormGroup): void {
        this.mainForm = form;
    }

    protected async sendCode(form: UntypedFormGroup): Promise<boolean> {
        const code: number = +form.value.code;
        if (!code) {
            form.markAllAsTouched();
            return;
        }
        form.disable();
        try {
            const response: ITransferResponse = await this.transferService.sendCode(code);
            if (response) {
                this.closeCodeModal();
                this.resetMainForm();
                this.showMessage(
                    this.translateService.instant(gettext('A gift for a friend has been successfully sent.' +
                    ' The gift is available in a friend\'s bonus offers.')),
                );
            }
            return true;
        } catch (error) {
            if (_find(error.errors, (item: string) => item === 'code_not_found')) {
                this.showMessage([gettext('The code you entered is incorrect')], true);
                form.enable();
                form.controls.code.setErrors({'wrong-sms-code': true});
            } else {
                this.closeCodeModal();
                this.resetMainForm();
                this.mainForm.enable();
                this.showMessage(_concat(error.errors), true);
            }
            return false;
        }
    }

    private openCodeForm(): void {
        this.modalService.showModal({
            id: 'transfer-code',
            modifier: 'transfer-code',
            modalTitle: gettext('Confirmation'),
            component: TransferCodeFormComponent,
            componentParams: <ITransferCodeFormCParams>{
                formConfig: Params.transferFormCodeConfig,
                onSubmit: this.sendCode.bind(this),
            },
            showFooter: false,
        });
    }

    private userDataSetSubscribers(): void {
        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(
                filter((userInfo: UserInfo) => !!userInfo),
                distinctUntilChanged((previous: UserInfo, current: UserInfo) =>
                    previous.realBalance === current.realBalance,
                ),
                takeUntil(this.$destroy),
            )
            .subscribe((userInfo: UserInfo): void => {
                this.userBalance = userInfo.realBalance;
            });
    }

    private getInfoConfig(bonusInfo: Bonus): void {
        Params.infoBlock.params.title
            =  this.translateService.instant(
                gettext('The following bonus will be available as a gift for your friend:'))
            + ` "${bonusInfo.name}". `
            + this.translateService.instant(gettext('The bonus has to be wagered with the following multiplier:'))
            + ` "${bonusInfo.results.balance.ReleaseWagering}".`;
    }

    private getMainFormConfig(): void {
        const formConfig: IFormWrapperCParams = _cloneDeep(Params.transferFormConfigTop);
        formConfig.components.push(
            ...this.getRecipientsConfig(),
            ...this.getAmountConfig(),
            ...(this.transfer.disableConfirmation ?
                [Params.submitButton] :
                this.getConfirmationConfig()
            ),
        );
        this.formConfig = formConfig;
    }

    private getRecipientsConfig(): IFormComponent[] {
        let recipientField = '';
        let recipientValidator = '';
        let recipientExampleValue = '';

        switch (this.transfer.transferBy) {
            case TransferByEnum.EMAIL:
                recipientField = 'e-mail';
                recipientValidator = 'email';
                recipientExampleValue = 'example@mail.com';
                break;
            case TransferByEnum.ID:
                recipientField = 'ID';
                recipientValidator = 'userId';
                recipientExampleValue = '';
                break;
            case TransferByEnum.EMAIL_OR_ID:
            default:
                recipientField = 'e-mail or ID';
                recipientValidator = 'emailOrUserId';
                recipientExampleValue = '';
        }

        return [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockSubtitle: ['1.', gettext(`Enter the recipient\'s ${recipientField}`)],
                    },
                },
            },
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: 'vertical',
                    common: {
                        placeholder: gettext(`Recipient\’s ${recipientField}`),
                    },
                    locked: true,
                    name: 'recipient',
                    validators: [
                        'required',
                        recipientValidator,
                    ],
                    exampleValue: recipientExampleValue,
                    wlcElement: 'block_recipient',
                },
            },
        ];
    }

    private getAmountConfig(): IFormComponent[] {
        const amountConfig: IFormComponent = _cloneDeep(FormElements.amount);
        amountConfig.params.common.placeholder = gettext('Amount');
        const limits: ITransferLimits = {
            min: this.transfer.minOnce,
            max: this.transfer.maxOnce,
        };

        _forEach(amountConfig.params.validators, (val: IValidatorSettings | string): void => {
            if (_isObject(val) && val.name === 'min') {
                val.options = limits.min;
            } else if (_isObject(val) && val.name === 'max') {
                val.options = limits.max;
            }
        });

        return [
            Params.transferDivider,
            Params.amountTitle,
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-field-container',
                    components: [
                        amountConfig,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-amount-limit__wrap',
                                components: [
                                    {
                                        name: 'core.wlc-amount-limit',
                                        params: {
                                            minValue: limits.min,
                                            maxValue: limits.max,
                                            showLimits: true,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ];
    }

    private getConfirmationConfig(): IFormComponent[] {
        return [
            Params.transferDivider,
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockSubtitle: ['3.', gettext('Confirmation')],
                        textBlockText: gettext('To confirm this gift for a friend, we will send a verification code ' +
                            `to your e-mail address${this.smsEnabled ? ' or phone number.' : '.'}`),
                    },
                },
            },
            ...(this.smsEnabled ? Params.transferRadioBtns : []),
            Params.transferButton,
        ];
    }

    private showMessage(text: string | string[], isError?: boolean): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: isError ? 'error' : 'success',
                title: isError ? gettext('Error') : gettext('Success'),
                message: text,
                wlcElement: isError ? 'notification_transfer-error' : 'notification_transfer-success',
                displayAsHTML: !isError,
            },
        });
    }

    private resetMainForm(): void {
        this.mainForm.controls.recipient.setValue('');
        this.mainForm.controls.amount.setValue('');
        this.mainForm.markAsUntouched();
    }

    private closeCodeModal(): void {
        if (this.modalService.getActiveModal('transfer-code')) {
            this.modalService.hideModal('transfer-code');
        }
    }

    public goToDashboard(): void {
        this.stateService.go('app.profile.dashboard');
    }
}
