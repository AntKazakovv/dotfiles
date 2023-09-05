import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    map,
    takeUntil,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _isObject from 'lodash-es/isObject';
import _concat from 'lodash-es/concat';

import {
    AbstractComponent,
    EventService,
    ConfigService,
    IFormWrapperCParams,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    IValidatorSettings,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    UserInfo,
} from 'wlc-engine/modules/user';
import {TransferService} from 'wlc-engine/modules/transfer/system/services';
import {
    ITransferSendDataParams,
    ITransferParams,
    ITransferResponse,
    ITransferLimits,
} from 'wlc-engine/modules/transfer/system/interfaces';
import {
    ITransferCodeFormCParams,
    TransferCodeFormComponent,
} from '../transfer-code-form/transfer-code-form.component';
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
    private transferParams: ITransferParams;;
    private smsEnabled: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransferCParams,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
        configService: ConfigService,
        protected modalService: ModalService,
        protected transferService: TransferService,
        protected translateService: TranslateService,
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
            const result: ITransferParams = await this.transferService.getParams();
            const bonusInfo: Bonus = await this.transferService.getBonusInfo();
            if (result && bonusInfo) {
                this.transferParams = result;
                this.getInfoConfig(bonusInfo);
                this.getMainFormConfig();
                this.ready = true;
                this.cdr.markForCheck();
            }
        } catch (error) {
            this.showMessage(_concat(error.errors), true);
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
            email: form.value.email || null,
            amount: form.value.amount || null,
            type: form.value.type || null,
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
            if (response) {
                this.openCodeForm();
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
                this.showMessage([gettext('Verification code is not correct')], true);
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
            =  this.translateService.instant(gettext('The bonus'))
            + ` "${bonusInfo.name}"`
            + this.translateService.instant(gettext(' will be available to your friend as a gift. '
            + 'The bonus has to be wagered with a multiplier')) + ` "${bonusInfo.multiplier}".`;
    }

    private getMainFormConfig(): void {
        const formConfig: IFormWrapperCParams = _cloneDeep(Params.transferFormConfigTop);
        formConfig.components.push(
            this.getAmountConfig(),
            Params.transferDivider,
            ...Params.transferLastStepText,
            this.getRadioBtnsConfig(),
            Params.transferButton,
        );
        this.formConfig = formConfig;
    }

    private getAmountConfig(): IFormComponent {
        const amountConfig: IFormComponent = _cloneDeep(FormElements.amount);
        amountConfig.params.common.placeholder = gettext('Transfer amount');
        const limits: ITransferLimits = {
            min: +this.transferParams.MinOnce || 1,
            max: +this.transferParams.MaxOnce || 10000,
        };

        _forEach(amountConfig.params.validators, (val: IValidatorSettings | string): void => {
            if (_isObject(val) && val.name === 'min') {
                val.options = limits.min;
            } else if (_isObject(val) && val.name === 'max') {
                val.options = limits.max;
            }
        });

        return {
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
        };
    }

    private getRadioBtnsConfig(): IFormComponent {
        const radioConfig: IFormComponent = _cloneDeep(Params.transferRadioBtns);
        radioConfig.params.items[1].disabled = !this.smsEnabled;
        return radioConfig;
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
        this.mainForm.controls.email.setValue('');
        this.mainForm.controls.amount.setValue('');
        this.mainForm.markAsUntouched();
    }

    private closeCodeModal(): void {
        if (this.modalService.getActiveModal('transfer-code')) {
            this.modalService.hideModal('transfer-code');
        }
    }
}
