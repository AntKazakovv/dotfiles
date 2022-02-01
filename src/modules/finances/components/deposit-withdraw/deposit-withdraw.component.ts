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
import {
    BehaviorSubject,
    of,
    Observable,
} from 'rxjs';
import {
    catchError,
    takeUntil,
} from 'rxjs/operators';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _has from 'lodash-es/has';
import _isEmpty from 'lodash-es/isEmpty';
import _isObject from 'lodash-es/isObject';
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject';
import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _keys from 'lodash-es/keys';
import _concat from 'lodash-es/concat';

import {
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
    LogService,
    InjectionService,
    ColorThemeValues,
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
} from 'wlc-engine/modules/finances/system/services';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';
import {IModalParams} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {PaymentMessageComponent} from '../payment-message/payment-message.component';
import {
    IPaymentMessage,
    PIQCashierResponse,
} from 'wlc-engine/modules/finances/system/interfaces/';
import {FinancesHelper} from '../../system/helpers/finances.helper';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {ISelectOptions} from 'wlc-engine/modules/profile';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user/system/models';
import {
    AbstractDepositWithdrawComponent,
} from 'wlc-engine/modules/finances/system/classes/abstract.deposit-withdraw.component';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './deposit-withdraw.params';

type cryptoInfo = 'msg1' | 'msg2';
type THostedStyles = 'current' | 'def' | 'alt';
type TFormData = IIndexing<string | number | boolean>;
@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositWithdrawComponent extends AbstractDepositWithdrawComponent implements OnInit {

    public showModalCryptoPayment: boolean = true;
    public $params: Params.IDepositWithdrawCParams;
    public cryptoCheck: boolean = false;
    public disableAmount: boolean = false;
    public formType: string = '';
    public depositForm = Params.depositForm;
    public depositFormCrypto = Params.depositFormCrypto;
    public withdrawForm = Params.withdrawForm;
    public title: string = gettext('Deposit');
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};
    public formData$: BehaviorSubject<TFormData> = new BehaviorSubject(null);
    public userTotalBonus: number;
    public userAvailableWithdraw: number;

    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };

    public formConfig: IFormWrapperCParams;
    public isShowHostedBlock: boolean = false;

    protected formObject: FormGroup;
    protected inProgress: boolean = false;

    private isLoadingHostedFields: boolean = false;
    private hostedFieldsStyles: Record<THostedStyles, string> = {
        current: '/static/css/hosted.fields.css',
        def: '/static/css/hosted.fields.css',
        alt: null,
    };
    private depositInIframe: boolean;
    private isShowIframe: boolean;
    private userProfile: UserProfile;
    private userService: UserService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositWithdrawCParams,
        protected configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected validationService: ValidationService,
        protected stateService: StateService,
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
        protected injectionService: InjectionService,
        protected piqCashierService: PIQCashierService,
        protected logService: LogService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, logService, modalService, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(takeUntil(this.$destroy))
            .subscribe((UserProfile) => {
                this.userProfile = UserProfile;
            });

        this.initSubscribers();
        this.initThemeToggleListener();
        this.updateFormConfig();

        if (this.$params.mode === 'withdraw') {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';

            this.userService = await this.injectionService.getService<UserService>('user.user-service');
            this.userService.userInfo$
                .pipe(takeUntil(this.$destroy))
                .subscribe((userInfo: UserInfo): void => {
                    if(!userInfo) {
                        return;
                    }
                    this.userTotalBonus = userInfo.balance;
                    this.userAvailableWithdraw = userInfo.availableWithdraw;
                    this.cdr.markForCheck();
                });
        }
    }

    /**
     * The function checks which notification for crypto v2 to show.
     *
     * @returns {boolean}
     */
    public showCryptoInfo(msg: cryptoInfo): boolean {

        if (this.$params.mode !== 'deposit' || !this.currentSystem?.isPayCryptosV2) {
            return false;
        }

        if (this.cryptoCheck) {
            return false;
        }

        switch (msg) {
            case 'msg1': return this.$params.showPaymentRules;
            case 'msg2': return !this.$params.showPaymentRules;
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
        } else if (this.$params.mode === 'deposit' && this.$params.showPaymentRules && !form.value.paymentRules) {
            form.controls.paymentRules.markAsTouched();
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
                this.window.location.replace(response[1]);
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
                            currency: this.userProfile.currency,
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
            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async saveProfile(): Promise<true | IIndexing<any>> {
        const extProfile: IExtProfile = this.userProfile.extProfile,
            alias: string = this.currentSystem?.alias,
            additionalParams: IExtPaymentSystem = {additionalParams: this.checkSkipSaving()};
        extProfile.paymentSystems = _assign({}, extProfile.paymentSystems, {[alias]: additionalParams});

        try {
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }

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

    private async depositAction(amount: number, params: IIndexing<string>, saveProfile: boolean = true): Promise<void> {
        this.isShowIframe = this.depositInIframe && this.currentSystem.appearance === 'iframe';
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
                    if (this.currentSystem.appearance === 'newtab') {
                        this.window.open(response[1], '_blank');
                    } else {
                        this.window.location.replace(response[1]);
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

            if (!this.isShowIframe) {
                formSubmit.submit();
            }
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: FinancesHelper.errorToMessage(error),
            });
        } finally {
            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    protected showIFrame(form: HTMLFormElement): void {
        const options: IModalParams = {
            id: 'iframe-deposit',
            modifier: 'iframe-deposit',
            componentName: 'finances.wlc-iframe-deposit',
            componentParams: {},
            size: 'lg',
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
            modalTitle: gettext('Deposit'),
            onModalShown: () => form.submit(),
        };
        this.modalService.showModal(options);
    }

    protected getAdditionalParams(): IIndexing<string> {
        return _keys(this.formObject.value).reduce((acc: IIndexing<string>, name: string) => {
            if (this.additionalParams[name] || name === 'payer') {
                acc[name] = this.formObject.value[name];
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

        if (_isEmpty(this.currentSystem.additionalParams)) {
            return;
        }

        const savedAdditional: IExtProfilePaymentSystems = this.userProfile.extProfile?.paymentSystems;

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
                if (this.currentSystem?.additionalParams[key]?.optional && !this.formObject.value[key]) {
                    continue;
                }
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

        for (const key in response[1]) {
            if (key === 'URL' || !response[1].hasOwnProperty(key)) {
                continue;
            }

            form.appendChild(this.addField(key, response[1][key]));
        }

        form.style.display = 'none';

        if (this.isShowIframe) {
            form.target = 'deposit_frame';
            this.showIFrame(form);
        } else if (this.currentSystem.appearance === 'newtab') {
            form.target = '_blank';
        }

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
    }

    protected initThemeToggleListener(): void {
        if (!this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            return;
        }

        const altHostedFieldsStyles = this.configService.get<string>('$base.colorThemeSwitching.altHostedFieldsStyles');

        if (altHostedFieldsStyles) {
            this.hostedFieldsStyles.alt = '/static/css/' + altHostedFieldsStyles;
        } else {
            return;
        }

        if (!!this.configService.get<string>(ColorThemeValues.configName)) {
            this.hostedFieldsStyles.current = this.hostedFieldsStyles.alt;
        }

        this.eventService.subscribe(
            {name: ColorThemeValues.changeEvent},
            (status: boolean) => {
                if (this.currentSystem?.isHosted) {
                    this.hostedFieldsStyles.current = status
                        ? this.hostedFieldsStyles.alt
                        : this.hostedFieldsStyles.def;

                    this.onPaymentSystemChange(this.currentSystem);
                }
            }, this.$destroy);
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems().then(() => {
            this.onPaymentSystemChange(this.currentSystem);
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
        this.formData$.next({
            resetForm: true,
        });

        if (this.currentSystem.isHosted
            && (!this.isLoadingHostedFields || !this.currentSystem.hostedFields.loaded)
            && _isEmpty(this.requiredFields)) {
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

        const requestStyles = (filePath: string, errorCallback: () => Observable<string>): Observable<string> => {
            return this.httpClient.get(filePath, {responseType: 'text'})
                .pipe(
                    takeUntil(this.$destroy),
                    catchError((error) => {
                        this.logService.sendLog({code: '1.4.35', data: error});
                        return errorCallback();
                    }),
                );
        };

        requestStyles(
            this.hostedFieldsStyles.current,
            () => this.hostedFieldsStyles.current === this.hostedFieldsStyles.alt
                ? requestStyles(this.hostedFieldsStyles.def, () => of(''))
                : of(''),
        ).subscribe((styles: string) => {
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
        let lastAccount: IFormComponent;

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

                if (this.currentSystem.isPayCryptos && !this.currentSystem.isPayCryptosV2) {
                    if (this.currentSystem.isLastAccountsObj) {
                        lastAccount = this.getLastAccountSelect(this.currentSystem.lastAccountsObj);
                    } else if (this.currentSystem.lastAccounts.length) {
                        lastAccount = this.getLastAccountSelect(this.currentSystem.lastAccounts);
                    }
                }
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
                                            minValue: amount.params.validators
                                                .find((val) => val['name'] && val['name'] === 'min')['options'],
                                            maxValue: amount.params.validators
                                                .find((val) => val['name'] && val['name'] === 'max')['options'],
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
            const additionalFields = _map(_keys(this.additionalParams), (key) => {
                const field = this.additionalParams[key];

                const validators = field.optional ? [] : ['required'];

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
                            validators: _concat(validators,
                                ...FinancesHelper.getSpecialValidators(key)),
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
                            items: _map(_keys(field.params || {}), (item) => {
                                return {
                                    value: item,
                                    title: field.params[item],
                                };
                            }),
                            control: new FormControl(''),
                            validators: validators,
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

        if (lastAccount) {
            formComponents.push(lastAccount);
        }

        // rules
        if (mode === 'deposit' && this.$params.showPaymentRules) {
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

    private getLastAccountSelect(lastAccounts: IIndexing<string> | string[]): IFormComponent {
        const items: ISelectOptions[] = _map(_keys(lastAccounts), (item) => {
            return {
                value: lastAccounts[item],
                title: _isArrayLikeObject(lastAccounts) ? lastAccounts[item] : item,
            };
        });

        return {
            name: 'core.wlc-select',
            alwaysNew: {saveValue: false},
            params: <ISelectCParams>{
                labelText: gettext('Last account'),
                name: 'payer',
                theme: 'vertical',
                common: {
                    placeholder: gettext('Last account'),
                },
                items: items,
                value: items[0].value,
                control: new FormControl(''),
                validators: ['required'],
                customMod: ['additional'],
            },
        };
    }
}
