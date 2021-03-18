import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {StateService} from '@uirouter/core';

import {
    AbstractComponent,
    IIndexing,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
    ValidationService,
    ISelectCParams,
    IInputCParams,
    ICheckboxCParams,
    IFormWrapperCParams,
    IExtProfilePaymentSystems,
    IValidatorSettings,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {FormElements} from 'wlc-engine/modules/finances/system/config';
import {
    AddProfileInfoComponent,
    IAddProfileInfoCParams,
} from './add-profile-info';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {CryptoDataComponent} from '../crypto-data/crypto-data.component';
import {ICryptoMessage} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {FinancesHelper} from '../../system/helpers/finances.helper';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './deposit-withdraw.params';

import {
    assign as _assign,
    camelCase as _camelCase,
    cloneDeep as _cloneDeep,
    each as _each,
    extend as _extend,
    forEach as _forEach,
    has as _has,
    isEmpty as _isEmpty,
    isEqual as _isEqual,
    isObject as _isObject,
    isString as _isString,
    transform as _transform,
} from 'lodash-es';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositWithdrawComponent extends AbstractComponent implements OnInit {

    public showModalCryptoPayment: boolean = true;
    public $params: Params.IDepositWithdrawCParams;
    public cryptoCheck: boolean = false;
    public disableAmount: boolean = false;
    public currentSystem: PaymentSystem;
    public formType: string = '';
    public depositForm = Params.depositForm;
    public depositFormCrypto = Params.depositFormCrypto;
    public withdrawForm = Params.withdrawForm;
    public title: string = gettext('Deposit');
    public requiredFields: Object = {};
    public requiredFieldsKeys: string[] = [];
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};

    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };

    public formConfig: IFormWrapperCParams;
    protected formObject: FormGroup;

    protected profileForm: IFormWrapperCParams;
    protected inProgress: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IDepositWithdrawCParams,
        protected configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected validationService: ValidationService,
        protected stateService: StateService,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }


    public get showPayCryptosV2Text(): boolean {
        if (this.currentSystem?.isPayCryptosV2 && !this.cryptoCheck && this.$params.mode === 'deposit') {
            return  true;
        }
        return false;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initSubscribers();
        this.updateFormConfig();

        if (this.$params.mode === 'withdraw') {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';
        }
    }

    public formBeforeSubmit(): boolean {
        const notificationTitle = this.$params.mode === 'deposit' ? gettext('Deposit') : gettext('Withdraw');
        if (!this.currentSystem) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must select payment method'),
                wlcElement: 'notification_deposit-method-error',
            });
            return false;
        } else if (this.requiredFieldsKeys.length) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must fill required profile fields'),
                wlcElement: 'notification_deposit-fields-error',
            });
            return false;
        } else {
            return true;
        }
    }

    public sendForm(form: FormGroup): void {
        if (this.inProgress) {
            return;
        }
        this.formObject = form;

        if (this.$params.mode === 'deposit') {
            this.deposit(this.formObject);
        } else if (this.$params.mode === 'withdraw') {
            this.withdraw(this.formObject);
        }
    }

    public async deposit(form: FormGroup, saveProfile: boolean = false): Promise<void> {

        this.inProgress = true;
        this.modalService.showModal('dataIsProcessing');

        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                this.currentSystem.disableAmount ? this.currentSystem.depositMin : form.value.amount,
                this.getAdditionalParams(),
            );

            if (saveProfile) {
                await this.saveProfile();
            }

            if (response.length) {

                if (response[0] === 'message' || response[0] === 'markup') {
                    this.showDepositResponse(response[1], response[0]);
                    return;
                } else if (response[0] === 'redirect') {
                    if (this.currentSystem?.appearance === 'newtab') {
                        window.open(response[1], '_blank');
                    } else {
                        window.location.replace(response[1]);
                    }
                    return;
                } else if (response[0] === 'markup_redirect') {
                    this.pushNotification({
                        type: 'warning',
                        title: gettext('Deposit'),
                        message: gettext('You will be redirected in a moment!'),
                        wlcElement: 'notification_deposit-redirection-warning',
                    });

                    await this.createRedirectForm(response[1]?.html);
                    return;
                }
            }

            const formSubmit: HTMLFormElement = this.createForm(response);
            document.body.appendChild(formSubmit);
            formSubmit.submit();
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            this.modalService.closeModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async withdraw(form: FormGroup, saveProfile: boolean = false): Promise<void> {

        this.modalService.showModal('dataIsProcessing');
        this.inProgress = true;

        try {
            const response = await this.financesService.withdraw(
                this.currentSystem.id,
                form.value.amount,
                this.getAdditionalParams() || {},
            );

            if (saveProfile) {
                await this.saveProfile();
            }

            if (response[0] === 'redirect') {
                window.location.replace(response[1]);
                return;
            }

            this.pushNotification({
                type: 'success',
                title: gettext('Withdraw'),
                message: [
                    gettext('Withdraw request has been successfully sent!'),
                    gettext('Withdraw sum') + ' ' + new CurrencyPipe('en-US', 'EUR').transform(form.value.amount),
                ],
                wlcElement: 'notification_withdraw-request-success',
            });

            this.resetPaymentSystem();

        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Error'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            this.modalService.closeModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async saveProfile(): Promise<boolean> {
        const deferred = new Deferred<boolean>(),
            profile: UserProfile = this.userService.userProfile,
            paymentSystems: IExtProfilePaymentSystems = profile.extProfile.paymentSystems || {},
            alias: string = this.currentSystem?.alias;

        paymentSystems[alias] = paymentSystems[alias] || {};
        paymentSystems[alias].additionalParams = this.checkSkipSaving();

        /* if (_has(this.action.additional, 'currentPassword')) {
            (profile as any).currentPassword = this.action.additional.currentPassword;
            delete this.action.additional.currentPassword;
        } */

        profile.extProfile.paymentSystems = paymentSystems;

        try {
            this.userService.updateProfile(profile);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.$params.mode === 'deposit' ? gettext('Deposit error') : gettext('Withdraw error'),
                    message: FinancesHelper.errorToMessage(error),
                },
            });
        }

        return deferred.promise;
    }

    public checkUserProfileForPayment(): boolean {
        if (!this.currentSystem) {
            return;
        }

        this.profileForm = undefined;

        const checkedRequiredFields = this.currentSystem.checkRequiredFields();

        if (!_isEqual(this.requiredFields, checkedRequiredFields)) {
            this.requiredFields = checkedRequiredFields;
        }

        this.requiredFieldsKeys = Object.keys(this.requiredFields);

        if (this.requiredFieldsKeys.length) {
            const fields = _transform(this.requiredFields, (result, item) => {
                const template = _camelCase(item['template']) === 'mobilePhone' ? 'mobilePhoneWithCode' : _camelCase(item['template']);

                if (FormElements[template]) {
                    result.push(FormElements[template]);
                } else {
                    console.error(`Field '${template}' does not exist!`, item);
                }
            }, []);
            fields.push(FormElements.password);
            fields.push(FormElements.submit);

            this.profileForm = {
                components: fields,
                validators: ['required'],
            };
        }

        this.cdr.markForCheck();
    }

    public editProfile(): void {

        this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            component: AddProfileInfoComponent,
            componentParams: <IAddProfileInfoCParams>{
                formConfig: this.profileForm,
                themeMod: this.requiredFieldsKeys.length > 5 ? 'overflow' : '',
            },
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
        });
    }

    protected getAdditionalParams(): IIndexing<string> {
        return Object.keys(this.additionalParams).reduce((acc: IIndexing<string>, name: string) => {
            if (this.formObject.value[name]) {
                acc[name] = this.formObject.value[name];
            } else {
                console.error(`${name} field is lost`);
            }
            return acc;
        }, {});
    }

    protected resetPaymentSystem(): void {
        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
        });
    }

    protected setAdditionalValues(): void {

        if (!Object.keys(this.currentSystem.additionalParams).length) {
            return;
        }

        const savedAdditional: IExtProfilePaymentSystems = this.userService.userProfile.extProfile?.paymentSystems;

        if (savedAdditional?.[this.currentSystem.alias]) {
            delete savedAdditional[this.currentSystem.alias].additionalParams.bonusId;
            for(const key in savedAdditional[this.currentSystem.alias].additionalParams) {
                if (_has(this.additionalParams, key)) {
                    this.additionalParams[key].value = savedAdditional[this.currentSystem.alias].additionalParams[key];
                }
            }
        }
    }

    protected checkSkipSaving(): IIndexing<string> {
        const additionalParams: IIndexing<string> = {};

        for (const key in this.additionalParams) {
            if (!this.currentSystem?.additionalParams[key]?.skipsaving) {
                additionalParams[key] = this.formObject.value[key];
            }
        }

        return additionalParams;
    }

    /**
     * Creates iframe with given html with form and inserts it into the body
     *
     * @param html {String} HTML with redirecting form.
     */
    protected async createRedirectForm(html: string): Promise<void> {
        return await new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            try {
                const incomingDoc = new DOMParser().parseFromString(html, 'text/html');
                const form = incomingDoc.querySelector('form');
                form.setAttribute('target', '_parent');

                setTimeout(() => {
                    iframe.contentWindow.document.write(new XMLSerializer().serializeToString(incomingDoc));
                    resolve();
                }, 0);
            } catch (err) {
                document.body.removeChild(iframe);
                reject(err);
            }
        });
    }

    protected showDepositResponse(params: ICryptoMessage, type: string): void {
        this.currentSystem.message = params;

        const messageData: IModalConfig = {
            id: 'payment-message',
            modalTitle: gettext('Payment'),
            modifier: 'info',
            component: CryptoDataComponent,
            componentParams: {
                themeMod: 'modal',
                system: this.currentSystem,
            },
            dismissAll: true,
            backdrop: 'static',
        };

        if (this.showModalCryptoPayment) {
            this.modalService.showModal(messageData);
        }

        if (type === 'message') {
            if ((typeof(params) !== 'string')
            && (!this.showModalCryptoPayment && params.translate === 'pay_to_address' && params.address)) {
                this.currentSystem.additionalParams = undefined;
                this.cdr.markForCheck();
            } else {
                this.resetPaymentSystem();
            }
        }
    }

    protected createForm(response: any): HTMLFormElement {
        const form: HTMLFormElement = document.createElement('form');
        form.method = response[0];
        form.action = (response[1] && response[1].URL) ? response[1].URL : '';

        if (this.currentSystem.appearance === 'iframe') {
            form.target = 'deposit_frame';
        } else if (this.currentSystem.appearance === 'newtab') {
            form.target = '_blank';
        }

        for (const key in response[1]) {
            if (key === 'URL' || !response[1].hasOwnProperty(key)) {
                continue;
            }

            form.appendChild(this.addField(key, response[1][key]));
        }

        form.style.display = 'none';
        return form;
    }

    protected addField(name: string, value: any): HTMLInputElement {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.value = value;
        return input;
    }

    protected initSubscribers(): void {

        this.eventService.subscribe(
            {
                name: 'select_system',
                from: 'finances',
            },
            (system: PaymentSystem) => this.onPaymentSystemChange(system),
            this.$destroy,
        );

        this.eventService.subscribe(
            {name: 'PROFILE_UPDATE'},
            () => this.onProfileUpdate(),
            this.$destroy,
        );
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems().then(() => {
            this.checkUserProfileForPayment();
        });
    }

    protected onPaymentSystemChange(system: PaymentSystem): void {
        if (!system) {
            this.currentSystem = undefined;
            this.requiredFields = {};
            this.requiredFieldsKeys.length = 0;
            this.cryptoCheck = false;
            this.disableAmount = false;
            this.additionalParams = {};
            this.updateFormConfig();
            this.cdr.markForCheck();
            return;
        }

        this.currentSystem = system;
        this.setAdditionalValues();

        this.cryptoCheck = this.currentSystem.cryptoCheck && this.$params.mode === 'deposit';
        this.disableAmount = this.currentSystem.disableAmount;

        this.additionalParams = this.listConfig.paymentType === 'deposit' ?
            system.additionalParamsDeposit : system.additionalParamsWithdraw;

        this.checkUserProfileForPayment();

        this.updateFormConfig();
    }

    protected pushNotification(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }

    protected updateFormConfig(): void {

        const {mode} = this.$params;
        const formComponents: IFormComponent[] = [];

        // amount
        if (!(mode === 'deposit' && this.disableAmount)) {
            let amount = FormElements.amount;
            let showLimits = false;

            if (this.currentSystem) {
                const {depositMin, depositMax, withdrawMin, withdrawMax} = this.currentSystem;

                _forEach(amount.params.validators, (val: IValidatorSettings | string) => {
                    if (_isObject(val) && val.name === 'min') {
                        val.options = mode === 'deposit' ? depositMin : withdrawMin;
                    } else if (_isObject(val) && val.name === 'max') {
                        val.options = mode === 'deposit' ? depositMax : withdrawMax;
                    }
                });

                showLimits = true;
            }

            const fieldWrap = {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-field-container',
                    components: [
                        amount,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'wlc-amount-limit__wrap',
                                components: [
                                    {
                                        name: 'core.wlc-amount-limit',
                                        params: {
                                            minValue: amount.params.validators.find((val) => val['name'] && val['name'] === 'min')['options'],
                                            maxValue: amount.params.validators.find((val) => val['name'] && val['name'] === 'max')['options'],
                                            showLimits,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            };

            formComponents.push(fieldWrap);
        }

        // additional
        if (!_isEmpty(this.additionalParams)) {
            const additionalFields = Object.keys(this.additionalParams).map((key) => {
                const field = this.additionalParams[key];
                if (field.type === 'input') {
                    return {
                        name: 'core.wlc-input',
                        params: <IInputCParams>{
                            name: key,
                            theme: 'vertical',
                            common: {
                                placeholder: field.name,
                            },
                            control: new FormControl(''),
                            validators: ['required'],
                            customMod: ['additional'],
                        },
                    };
                } else if (field.type === 'select') {
                    return {
                        name: 'core.wlc-select',
                        params: <ISelectCParams>{
                            labelText: field.name,
                            name: key,
                            theme: 'vertical',
                            common: {
                                placeholder: field.name,
                            },
                            items: Object.keys(field.params || {}).map((item) => {
                                return {
                                    value: item,
                                    title: field.params[item],
                                };
                            }),
                            control: new FormControl(''),
                            validators: ['required'],
                            customMod: ['additional'],
                        },
                    };
                }
            });

            const additionalFieldsWrap = {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-additional-fields',
                    components: [...additionalFields],
                },
            };

            formComponents.push(additionalFieldsWrap);
        }

        // rules
        if (mode === 'deposit') {
            formComponents.push(FormElements.rules);
        }

        // button
        const button = mode === 'deposit' ? FormElements.depositButton : FormElements.withdrawButton;
        formComponents.push(button);

        this.formConfig = {
            class: `${mode}-form`,
            components: formComponents,
        };

        this.cdr.markForCheck();
    }

}
