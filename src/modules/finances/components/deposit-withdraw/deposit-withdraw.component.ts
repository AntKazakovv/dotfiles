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
} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

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
    IFormWrapperCParams,
    IExtProfile,
    IExtProfilePaymentSystems,
    IExtPaymentSystem,
    IValidatorSettings,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {CurrencyModel} from 'wlc-engine/modules/core/system/models/currency.model';
import {
    IHostedFormData,
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    FinancesService,
    PIQCashierService,
    PIQCashierServiceEvents,
} from 'wlc-engine/modules/finances/system/services';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {
    IAddProfileInfoCParams,
} from 'wlc-engine/modules/user/components/add-profile-info';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';
import {PaymentMessageComponent} from '../payment-message/payment-message.component';
import {
    IPaymentMessage,
    PIQCashierResponse,
} from 'wlc-engine/modules/finances/system/interfaces/';
import {FinancesHelper} from '../../system/helpers/finances.helper';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './deposit-withdraw.params';

import _camelCase from 'lodash-es/camelCase';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _has from 'lodash-es/has';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _isObject from 'lodash-es/isObject';
import _startsWith from 'lodash-es/startsWith';
import _transform from 'lodash-es/transform';
import _assign from 'lodash-es/assign';

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
    public formData$: BehaviorSubject<IIndexing<string | number>> = new BehaviorSubject(null);

    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };

    public formConfig: IFormWrapperCParams;
    public isShowHostedBlock: boolean = false;

    protected formObject: FormGroup;
    protected profileForm: IFormWrapperCParams;
    protected inProgress: boolean = false;
    private isLoadingHostedFields: boolean = false;

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
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
        protected piqCashierService: PIQCashierService,
        @Inject(DOCUMENT) protected document: HTMLDocument,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }


    public get showPayCryptosV2Text(): boolean {
        return this.currentSystem?.isPayCryptosV2 && !this.cryptoCheck && this.$params.mode === 'deposit';

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

    public formBeforeSubmit(form: FormGroup): boolean {
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
        } else if (this.$params.mode === 'deposit' && !form.value.paymentRules) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must agree to the payment system terms'),
                wlcElement: 'notification_deposit-terms-error',
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
            this.deposit();
        } else if (this.$params.mode === 'withdraw') {
            this.withdraw(this.formObject);
        }
    }

    public deposit(saveProfile: boolean = true): void {
        this.inProgress = true;
        this.modalService.showModal('data-is-processing');

        if (this.currentSystem.isHosted) {
            this.currentSystem.getHostedValue();
        } else {
            this.depositAction(this.formObject.value.amount, this.getAdditionalParams(), saveProfile);
        }
    }

    public async withdraw(form: FormGroup, saveProfile: boolean = false): Promise<void> {
        this.modalService.showModal('data-is-processing');
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
            } else if (response[0] === PIQCashierResponse) {
                return;
            }

            this.pushNotification({
                type: 'success',
                title: gettext('Withdraw'),
                message: [
                    gettext('Withdraw request has been successfully sent!'),
                    this.translateService.instant(gettext('Withdraw sum')) + ' ' + new CurrencyModel(
                        {
                            component: 'DepositWithdrawComponent',
                            method: 'withdraw',
                        },
                        form.value.amount,
                        {
                            currency: this.userService.userProfile.currency,
                            language: this.translateService.currentLang,
                        },
                    ),
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
            this.modalService.hideModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async saveProfile(): Promise<true | IIndexing<any>> {
        const extProfile: IExtProfile = this.userService.userProfile.extProfile,
            alias: string = this.currentSystem?.alias,
            additionalParams: IExtPaymentSystem = {additionalParams: this.checkSkipSaving()};
        extProfile.paymentSystems = _assign({}, extProfile.paymentSystems, {[alias]: additionalParams});

        try {
            return await this.userService.updateProfile({extProfile}, true, true);
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
                const template = _camelCase(item['template']);

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
            componentName: 'user.wlc-add-profile-info',
            componentParams: <IAddProfileInfoCParams>{
                formConfig: this.profileForm,
                themeMod: this.requiredFieldsKeys.length > 5 ? 'overflow' : '',
            },
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
        });
    }

    private async depositAction(amount: number, params: IIndexing<string>, saveProfile: boolean = true): Promise<void> {
        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                this.currentSystem.disableAmount ? this.currentSystem.depositMin : amount,
                params,
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
                } else if (response[0] === PIQCashierResponse) {
                    return;
                }
            }

            const formSubmit: HTMLFormElement = this.createForm(response);
            this.document.body.appendChild(formSubmit);
            formSubmit.submit();
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            this.modalService.hideModal('data-is-processing');
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
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
            for (const key in savedAdditional[this.currentSystem.alias].additionalParams) {
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
            const iframe = this.document.createElement('iframe');
            iframe.style.display = 'none';
            this.document.body.appendChild(iframe);

            try {
                const incomingDoc = new DOMParser().parseFromString(html, 'text/html');
                const form = incomingDoc.querySelector('form');
                form.setAttribute('target', '_parent');

                setTimeout(() => {
                    iframe.contentWindow.document.write(new XMLSerializer().serializeToString(incomingDoc));
                    resolve();
                }, 0);
            } catch (err) {
                this.document.body.removeChild(iframe);
                reject(err);
            }
        });
    }

    protected showDepositResponse(params: IPaymentMessage, type: string): void {
        this.currentSystem.message = params;

        if (this.showModalCryptoPayment) {
            const messageData: IModalConfig = {
                id: 'payment-message',
                modalTitle: gettext('Payment'),
                modifier: 'info',
                component: PaymentMessageComponent,
                componentParams: {
                    themeMod: 'modal',
                    system: this.currentSystem,
                },
                dismissAll: true,
                backdrop: 'static',
            };
            this.modalService.showModal(messageData);
        }

        if (type === 'message') {
            if ((typeof (params) !== 'string')
                && (!this.showModalCryptoPayment && params.translate === 'pay_to_address' && params.address)) {
                this.currentSystem.additionalParams = undefined;
                this.cdr.markForCheck();
            } else {
                this.resetPaymentSystem();
            }
        }
    }

    protected createForm(response: any): HTMLFormElement {
        const form: HTMLFormElement = this.document.createElement('form');
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
        const input: HTMLInputElement = this.document.createElement('input');
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

        this.eventService.subscribe(
            {
                name: PIQCashierServiceEvents.closed,
                from: 'piq-cashier',
            },
            () => {
                this.inProgress = false;
                this.financesService.fetchPaymentSystems();
            },
            this.$destroy,
        );
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems().then(() => {
            this.checkUserProfileForPayment();
        });
    }

    protected onPaymentSystemChange(system: PaymentSystem): void {
        this.isShowHostedBlock = false;

        if (!system) {
            this.currentSystem = undefined;
            this.requiredFields = {};
            this.requiredFieldsKeys.length = 0;
            this.cryptoCheck = false;
            this.disableAmount = false;
            this.additionalParams = {};
            this.updateFormConfig();
            this.formData$.next({
                amount: null,
            });
            this.cdr.markForCheck();
            return;
        }

        if (this.currentSystem?.isHosted) {
            this.currentSystem.resetHostedFields();
            this.currentSystem.dropHostedFields();
            this.isLoadingHostedFields = false;
            this.cdr.detectChanges();
        }

        this.currentSystem = system;
        this.cryptoCheck = this.currentSystem.cryptoCheck && this.$params.mode === 'deposit';
        this.disableAmount = this.currentSystem.disableAmount;
        this.additionalParams = this.listConfig.paymentType === 'deposit' ?
            system.additionalParamsDeposit : system.additionalParamsWithdraw;

        this.setAdditionalValues();
        this.checkUserProfileForPayment();
        this.updateFormConfig();

        if (this.currentSystem.isHosted && (!this.isLoadingHostedFields || !this.currentSystem.hostedFields.loaded)) {
            this.loadHostedFields();
        }
    }

    protected loadHostedFields(): void {
        this.isLoadingHostedFields = true;
        this.isShowHostedBlock = true;
        this.currentSystem.resetHostedFields();

        const formCallbackHandler = (formData: IHostedFormData) => {
            if (!formData.errors || _isEmpty(formData.errors)) {
                this.currentSystem.validateHostedFields();
                this.depositAction(this.formObject.value.amount, formData as IIndexing<string>);
            } else {
                this.currentSystem.invalidateHostedFields();
                this.inProgress = false;
                this.cdr.markForCheck();
            }
        };

        const formHasLoadedCallbackHandler = () => {
            this.currentSystem.loadedHostedFields();
            this.isLoadingHostedFields = false;
            this.cdr.markForCheck();
        };

        this.httpClient.get('/static/css/hosted.fields.css', {responseType: 'text'}).subscribe((styles: any) => {
            this.currentSystem.setupHostedFields(
                formHasLoadedCallbackHandler,
                formCallbackHandler,
                styles,
            );
        });
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
            let amount = _cloneDeep(FormElements.amount);
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
                        alwaysNew: {saveValue: true},
                        params: <IInputCParams>{
                            name: key,
                            value: field.value || '',
                            theme: 'vertical',
                            common: {
                                placeholder: field.name,
                            },
                            control: new FormControl(''),
                            validators: [
                                'required',
                                ...FinancesHelper.getSpecialValidators(key, this.currentSystem.alias),
                            ],
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
