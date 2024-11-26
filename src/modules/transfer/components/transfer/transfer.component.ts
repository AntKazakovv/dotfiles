import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    map,
    takeUntil,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _isObject from 'lodash-es/isObject';
import _concat from 'lodash-es/concat';
import _isBoolean from 'lodash-es/isBoolean';

import {
    AbstractComponent,
    EventService,
    IFormWrapperCParams,
    IInputCParams,
    IMixedParams,
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
    public isTransfersUnavailable: boolean = false;

    private mainForm: UntypedFormGroup;
    private userBalance: number;
    private transfer: TransferModel;
    private smsEnabled: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransferCParams,
        private eventService: EventService,
        private modalService: ModalService,
        private transferService: TransferService,
        private translateService: TranslateService,
    ) {
        super(<IMixedParams<Params.ITransferCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.smsEnabled = this.configService.get<boolean>('appConfig.smsEnabled');
        this.userDataSetSubscribers();

        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(
                filter((userInfo: UserInfo) => _isBoolean(userInfo?.transfersAllowed)),
                map((userInfo: UserInfo) => userInfo.transfersAllowed),
                first(),
                takeUntil(this.$destroy),
            ).subscribe(async (transfersAllowed: boolean): Promise<void> => {
                if (transfersAllowed) {
                    try {
                        const transfer: TransferModel = await this.transferService.getTransferData();
                        const bonusInfo: Bonus = await this.transferService.getBonusInfo();
                        if (transfer && bonusInfo) {
                            this.transfer = transfer;
                            this.getInfoConfig(bonusInfo);
                            this.getMainFormConfig();
                        }
                    } catch (error) {
                        if (error.errors) {
                            this.showMessage(_concat(error.errors), true);
                        } else {
                            this.showMessage(this.$params.errorMessage, true);
                        }
                    }
                } else {
                    this.showMessage(this.$params.unavailableMessage, true);
                    this.isTransfersUnavailable = true;
                }

                this.ready = true;
                this.cdr.markForCheck();
            });
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
            this.showMessage(gettext('Your account balance is insufficient'), true);
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
                        ' The gift is available in the friend\'s bonus offers')),
                );
            }
            return true;
        } catch (error) {
            if (Object.keys(error.errors)[0] === 'email') {
                this.showMessage(error.errors['email'], true);
                form.controls.recipient.setErrors({'email': true});
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
                    ' The gift is available in the friend\'s bonus offers')),
                );
            }
            return true;
        } catch (error) {
            if (_find(error.errors, (item: string) => item === 'code_not_found')) {
                this.showMessage([gettext('The entered code is incorrect')], true);
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
                map((item: UserInfo): number => item?.realBalance),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((balance: number): void => {
                this.userBalance = balance;
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
        let recipientExampleValue = '';
        let recipientValidator: string[] = [];
        let recipientValidatorsAnyOf: string[] = [];
        let recipientTextBlock = '';
        let recipientPlaceholder = '';

        switch (this.transfer.transferBy) {
            case TransferByEnum.EMAIL:
                recipientValidator = ['email'];
                recipientExampleValue = 'example@mail.com';
                recipientTextBlock = gettext('Enter the recipient\'s e-mail');
                recipientPlaceholder = gettext('Recipient\'s e-mail');
                break;
            case TransferByEnum.ID:
                recipientValidator = ['userId'];
                recipientExampleValue = '';
                recipientTextBlock = gettext('Enter the recipient\'s ID');
                recipientPlaceholder = gettext('Recipient\'s ID');
                break;
            case TransferByEnum.EMAIL_OR_ID:
            default:
                recipientValidatorsAnyOf = ['email', 'userId'];
                recipientExampleValue = '';
                recipientTextBlock = gettext('Enter the recipient\'s e-mail or ID');
                recipientPlaceholder = gettext('Recipient\'s e-mail or ID');
        }

        return [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockSubtitle: ['1.', recipientTextBlock],
                    },
                },
            },
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: 'vertical',
                    common: {
                        placeholder: recipientPlaceholder,
                    },
                    locked: true,
                    name: 'recipient',
                    validators: [
                        'required',
                        ...recipientValidator,
                    ],
                    validatorsAnyOf: recipientValidatorsAnyOf,
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
        let confirmationText = '';

        if (!this.smsEnabled) {
            // eslint-disable-next-line max-len
            confirmationText = gettext('To confirm this gift for a friend, a verification code will be sent to your e-mail address');
        } else {
            // eslint-disable-next-line max-len
            confirmationText = gettext('To confirm this gift for a friend, a verification code will be sent to your e-mail address or phone number.');
        }

        return [
            Params.transferDivider,
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockSubtitle: ['3.', gettext('Confirmation')],
                        textBlockText: confirmationText,
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
}
