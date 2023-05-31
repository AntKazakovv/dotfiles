import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

import {DateTime} from 'luxon';
import {TranslateService} from '@ngx-translate/core';
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
import _isArray from 'lodash-es/isArray';
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject';
import _includes from 'lodash-es/includes';
import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _keys from 'lodash-es/keys';
import _concat from 'lodash-es/concat';
import _find from 'lodash-es/find';
import _max from 'lodash-es/max';
import _min from 'lodash-es/min';
import _merge from 'lodash-es/merge';

import {
    IIndexing,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
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
    ITimerCParams,
    IModalConfig,
    IModalParams,
    IFormComponent,
    ActionService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {
    IHostedFormData,
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {PaymentMessageComponent} from '../payment-message/payment-message.component';
import {
    IAdditionalFieldConfig,
    IAdditionalFieldSettings,
    IPaymentMessage,
    PIQCashierResponse,
    TAdditionalParams,
} from 'wlc-engine/modules/finances/system/interfaces/';
import {FinancesHelper} from '../../system/helpers/finances.helper';
import {DateHelper} from '../../../core';
import {ISelectOptions} from 'wlc-engine/modules/profile';
import {
    UserInfo,
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {
    AbstractDepositWithdrawComponent,
} from 'wlc-engine/modules/finances/system/classes/abstract.deposit-withdraw.component';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    Bonus,
    BonusItemComponentEvents,
} from 'wlc-engine/modules/bonuses';

import * as Params from './deposit-withdraw.params';

type TCryptoInfo = 'msg1' | 'msg2' | 'msg3';
type THostedStyles = 'current' | 'def' | 'alt';
type TFormData = IIndexing<string | number | boolean>;
type TModalType = 'markup' | 'info';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositWithdrawComponent
    extends AbstractDepositWithdrawComponent<Params.IDepositWithdrawCParams>
    implements OnInit, OnDestroy {
    public showModalCryptoPayment: boolean = true;
    public override $params: Params.IDepositWithdrawCParams;
    public cryptoCheck: boolean = false;
    public disableAmount: boolean = false;
    public title: string = gettext('Deposit');
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};
    public formData$: BehaviorSubject<TFormData> = new BehaviorSubject(null);
    public userTotalBonus: number;
    public userAvailableWithdraw: number;
    public lastSucceedPaymentMethod: Promise<number | null>;
    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };
    public cryptoListConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
        theme: 'crypto-list',
        chosenMethodText: gettext('The chosen cryptocurrency:'),
        noSelectedButton: null,
        buttonText: gettext('Show all cryptocurrencies'),
    };

    public invoiceSystems: PaymentSystem[] = [];
    public parentSystem: PaymentSystem = null;
    /** Defines if crypto invoice payment chosen */
    public isCryptoInvoices: boolean = false;
    public timerParams: ITimerCParams;

    public prestepFormConfig: IFormWrapperCParams;

    public formConfig: IFormWrapperCParams;
    public isShowHostedBlock: boolean = false;
    public steps: Set<Params.IPaymentStep> = new Set();

    public useBonuses: boolean = false;
    public bonusesListParams: IFormWrapperCParams;
    public availableSystems: number[] = [];
    public currentBonus: Bonus;
    public isWaitingResponse: boolean = false;
    public showErrorHosledLoad: boolean = false;
    public hiddenPaymentInfo: boolean;
    public isLastMethodExisting: boolean;
    protected formObject: UntypedFormGroup;
    protected inProgress: boolean = false;
    protected userService: UserService;

    private prestepAmount: number = 0;
    private isPrestepComplete: boolean = false;
    private usePrestep: boolean = false;

    private isLoadingHostedFields: boolean = false;
    private hostedFieldsStyles: Record<THostedStyles, string> = {
        current: '/static/css/hosted.fields.css',
        def: '/static/css/hosted.fields.css',
        alt: null,
    };
    private piqFieldsStyles: Record<THostedStyles, string> = {
        current: '/static/css/piq.cashier.css',
        def: '/static/css/piq.cashier.css',
        alt: null,
    };
    private depositInIframe: boolean;
    private isShowIframe: boolean;
    private userProfile: UserProfile;
    private cssVariables: string;
    private isDeposit: boolean;
    private useScroll: boolean = false;

    private additionalFieldsConfig: IIndexing<IAdditionalFieldConfig>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositWithdrawCParams,
        configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        modalService: ModalService,
        cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
        injectionService: InjectionService,
        logService: LogService,
        protected actionService: ActionService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, logService, modalService, configService, injectionService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.hiddenPaymentInfo = this.configService.get<boolean>('$finances.paymentInfo.hiddenPaymentInfo');
        this.depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');
        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.isDeposit = this.$params.mode === 'deposit';
        this.additionalFieldsConfig = this.configService.get('$finances.fieldsSettings.additional');
        this.isLastMethodExisting = (this.isDeposit
                && this.configService.get<boolean>('$finances.lastSucceedDepositMethod.use'))
            || (!this.isDeposit && this.configService.get<boolean>('$finances.lastSucceedWithdrawMethod.use'));
        if (this.useBonuses && this.isDeposit) {
            this.steps.add(Params.PaymentSteps.bonus);
            this.bonusesListParams = {
                components: [
                    {
                        name: 'bonuses.wlc-deposit-bonuses',
                        params: {},
                    },
                ],
            };
        }

        this.steps.add(Params.PaymentSteps.paymentSystem);
        if (!this.hiddenPaymentInfo) {
            this.steps.add(Params.PaymentSteps.paymentInfo);
        }

        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(takeUntil(this.$destroy))
            .subscribe((UserProfile) => {
                this.userProfile = UserProfile;
            });

        this.initSubscribers();
        this.updateFormConfig();
        this.initThemeToggleListener();
        if (this.isLastMethodExisting) {
            this.lastSucceedPaymentMethod = this.financesService.getLastSucceedPaymentMethod(this.isDeposit);
        }
        if (!this.isDeposit) {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';

            this.userService = await this.injectionService.getService<UserService>('user.user-service');
            this.userService.userInfo$
                .pipe(takeUntil(this.$destroy))
                .subscribe((userInfo: UserInfo): void => {
                    if (!userInfo) {
                        return;
                    }
                    this.userTotalBonus = userInfo.balance;
                    this.userAvailableWithdraw = userInfo.availableWithdraw;
                    this.cdr.markForCheck();
                });
        }

        this.timerParams = _merge(
            _cloneDeep(Params.timerParams),
            this.$params.timerParams,
        );

        await this.financesService.fetchPaymentSystems();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: null});
        }
    }

    public onCryptoInvoiceExpires(): void {
        this.cdr.detectChanges();

        if (this.modalService.getActiveModal('payment-message')) {
            this.modalService.hideModal('payment-message');
        }

        this.pushNotification({
            type: 'success',
            title: gettext('Deposit'),
            message: [
                gettext('The deposit period for the issued invoice has expired.'),
                gettext('If you have sent a payment, check the status of '
                    + 'the transaction on the transaction history page.'),
            ],
            wlcElement: 'notification_deposit-invoice-expired',
        });
    }

    public createNewInvoice(): void {
        this.currentSystem.message = {};
        this.onPaymentSystemChange(this.currentSystem);
    }

    /**
     * The function checks which notification for crypto v2 to show.
     *
     * @returns {boolean}
     */
    public showCryptoInfo(msg: TCryptoInfo): boolean {

        if (!this.isDeposit || !this.currentSystem) {
            return false;
        }

        switch (msg) {
            case 'msg1':
                return !this.isCryptoInvoices
                    && !this.cryptoCheck
                    && this.currentSystem?.isPayCryptosV2
                    && this.$params.showPaymentRules;
            case 'msg2':
                return !this.isCryptoInvoices
                    && !this.cryptoCheck
                    && this.currentSystem?.isPayCryptosV2
                    && !this.$params.showPaymentRules;
            case 'msg3':
                return this.isCryptoInvoices
                    && !(this.currentSystem?.message as IPaymentMessage)?.dateEnd;
        }
    }

    public formBeforeSubmit(form: UntypedFormGroup): boolean {
        const notificationTitle = this.isDeposit ? gettext('Deposit') : gettext('Withdraw');
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
        } else if (this.isDeposit
            && this.$params.showPaymentRules
            && this.emptyOnlyField(form, 'paymentRules')
        ) {
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

    /**
     * Check that in form empty only current field
     *
     * @param {FormGroup} form
     * @param {string} field
     * @returns {boolean} True if empty only current field
     */
    public emptyOnlyField(form: UntypedFormGroup, field: string): boolean {
        if (form.controls[field]?.value) {
            return false;
        }

        return !_find(form.controls, (control: UntypedFormControl, key: string): boolean => {
            if (key !== 'submit' && key !== field) {
                return !control.value;
            }
            return false;
        });
    }

    public async sendPrestepForm(form: UntypedFormGroup): Promise<boolean> {
        this.formObject = form;
        try {
            await this.financesService.makePrestep(
                this.currentSystem.id,
                form.value.amount,
                this.getAdditionalParams(),
            );
            this.isPrestepComplete = true;
            this.prestepAmount = form.value.amount;
            this.updateFormConfig();
            return true;
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Error'),
                message: FinancesHelper.errorToMessage(error),
            });
            return false;
        }
    }

    public async sendForm(form: UntypedFormGroup): Promise<boolean> {
        if (this.inProgress) {
            return false;
        }
        this.formObject = form;

        if (this.isDeposit) {
            this.eventService.emit({
                name: 'DEPOSIT',
                data: {
                    desc: 'deposit_start',
                },
            });

            return await this.deposit();
        } else {
            return await this.withdraw(this.formObject);
        }
    }

    public async deposit(saveProfile: boolean = true): Promise<boolean> {
        this.inProgress = true;
        this.modalService.showModal('data-is-processing');

        if (this.currentSystem.isHosted) {
            this.currentSystem.getHostedValue();

            if (this.currentSystem.hostedFields.invalid) {
                this.inProgress = false;

                if (this.modalService.getActiveModal('data-is-processing')) {
                    this.modalService.hideModal('data-is-processing');
                }

                return false;
            }

            return true;
        } else {
            const amount: number = this.isPrestepComplete ? this.prestepAmount : this.formObject.value.amount;
            return await this.depositAction(amount, this.getAdditionalParams(), saveProfile);
        }
    }

    public async withdraw(form: UntypedFormGroup, saveProfile: boolean = false): Promise<boolean> {
        this.modalService.showModal('data-is-processing');
        this.inProgress = true;

        try {
            const response = await this.financesService.withdraw(
                this.currentSystem.id,
                form.value.amount,
                this.getAdditionalParams() || {},
                this.cssVariables,
            );

            if (saveProfile) {
                await this.saveProfile();
            }

            if (response[0] === 'redirect') {
                this.window.location.replace(response[1]);
                return;
            } else if (response[0] === 'POST') {
                this.addFormToBodyAndSubmit(response);
                return;
            } else if (response[0] === PIQCashierResponse) {
                return;
            }

            const currencyIcon = `
                <span wlc-currency
                    [value]="${form.value.amount}"
                    [currency]="'${this.userProfile.currency}'"
                ><span>`;

            this.pushNotification({
                type: 'success',
                title: gettext('Withdraw'),
                message: [
                    this.translateService.instant('Withdraw request has been successfully sent!'),
                    this.translateService.instant('Withdraw sum') + ` ${currencyIcon}`,
                ],
                wlcElement: 'notification_withdraw-request-success',
                displayAsHTML: true,
            });

            return true;
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Error'),
                message: FinancesHelper.errorToMessage(error),
            });

            return false;
        } finally {

            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }
            this.inProgress = false;
            this.financesService.fetchPaymentSystems();
        }
    }

    public async saveProfile(): Promise<true | IIndexing<any>> {
        const extProfile: IExtProfile = _assign({}, this.userProfile.extProfile),
            alias: string = this.currentSystem?.alias,
            fields: IExtPaymentSystem = {additionalParams: this.checkSkipSaving()};

        if (_isEmpty(fields.additionalParams)) {
            return;
        }

        extProfile.paymentSystems = _assign({}, extProfile.paymentSystems, {[alias]: fields});

        try {
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }

            return await this.userService.updateProfile({extProfile}, {
                updatePartial: true,
                isAfterDepositWithdraw: true,
            });
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.isDeposit ? gettext('Deposit error') : gettext('Withdraw error'),
                    message: FinancesHelper.errorToMessage(error),
                },
            });
        }
    }

    public get minAmount(): number {
        if (this.isDeposit) {
            return _max([
                +this.currentSystem.depositMin,
                this.currentBonus?.minDeposit,
            ]);
        } else {
            return this.currentSystem.withdrawMin;
        }
    }

    public get maxAmount(): number {
        if (this.isDeposit) {
            return _min([
                +this.currentSystem.depositMax,
                this.currentBonus?.maxDeposit || null,
            ]);
        } else {
            return this.currentSystem.withdrawMax;
        }
    }

    public openInvoicePaymentMessage(): void {
        if (this.isInvoicePending) {
            this.modalService.showModal(this.getPaymentMessageModalConfig('info', true));
        } else {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: [
                    gettext('The deposit period for the issued invoice has expired.'),
                    gettext('If you have sent a payment, check the status of the '
                        + 'transaction on the transaction history page'),
                ],
                wlcElement: 'notification_deposit-open-invoice-msg-error',
            });
        }
    }

    public cancelInvoiceHandler(): void {
        this.financesService.cancelInvoiceHandler(this.currentSystem?.id);
    }

    public get isInvoicePending(): boolean {
        return this.isDeposit && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd
            && this.dateExpire > DateTime.now();
    }

    public get isInvoiceExpired(): boolean {
        return this.isDeposit && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd
            && this.dateExpire <= DateTime.now();
    }

    public get showPaymentMessage(): boolean {
        return this.currentSystem && this.cryptoCheck && !this.isCryptoInvoices;
    }

    public get dateExpire(): DateTime {
        return DateTime.fromISO((this.currentSystem?.message as IPaymentMessage)?.dateEnd);
    }

    private async depositAction(
        amount: number,
        params: TAdditionalParams,
        saveProfile: boolean = true,
    ): Promise<boolean> {
        this.isShowIframe = this.depositInIframe && this.currentSystem.appearance === 'iframe';

        const isPregeneration: boolean = this.currentSystem.isPregeneration;

        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                amount || this.currentSystem.depositMin,
                {...params, bonusId: this.currentBonus?.id || null},
                this.cssVariables,
            );

            if (saveProfile && !isPregeneration) {
                await this.saveProfile();
            }

            if (response.length) {
                if (response[0] === 'message' && isPregeneration && this.isWaitingResponse) {
                    this.currentSystem.message = response[1];
                    return;
                }

                if (response[0] === 'message' || response[0] === 'markup') {
                    this.showDepositResponse(response[1], response[0]);
                    return;
                } else if (response[0] === 'redirect') {
                    if (this.currentSystem.appearance === 'newtab') {
                        this.window.open(response[1], '_blank');
                    } else if (this.isShowIframe) {
                        this.addFormToBodyAndSubmit(response);
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

            this.addFormToBodyAndSubmit(response);
            return true;
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: FinancesHelper.errorToMessage(error),
            });

            return false;
        } finally {

            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }

            this.inProgress = false;

            if (this.isInvoicePending) {
                this.updateFormConfig();
            }

            if (!isPregeneration) {
                this.financesService.fetchPaymentSystems();
            }
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
        this.cdr.detectChanges();

        if (this.showModalCryptoPayment) {
            this.modalService.showModal(
                this.getPaymentMessageModalConfig(type === 'markup' ? 'markup' : 'info', !!params.dateEnd),
            );
        }

        if (type === 'message'
            && (typeof (params) !== 'string')
            && (!this.showModalCryptoPayment && params.translate === 'pay_to_address' && params.address)) {
            this.currentSystem.additionalParams = undefined;
            this.cdr.markForCheck();
        }
    }

    protected getPaymentMessageModalConfig(type: TModalType, isInvoice?: boolean): IModalConfig {
        return {
            id: 'payment-message',
            modalTitle: gettext('Payment'),
            modifier: type,
            component: PaymentMessageComponent,
            componentParams: {
                themeMod: 'modal',
                system: this.currentSystem,
                minAmount: this.minAmount,
                maxAmount: this.maxAmount,
            },
            dismissAll: true,
            backdrop: 'static',
            showFooter: !isInvoice,
        };
    }

    protected createForm(response: any): HTMLFormElement {
        const form: HTMLFormElement = this.document.createElement('form');

        if (response[0] === 'redirect') {
            form.method = 'GET';
            form.action = response[1];
        } else {
            form.method = response[0];
            form.action = (response[1] && response[1].URL) ? response[1].URL : '';

            for (const key in response[1]) {

                if (key === 'URL' || !response[1].hasOwnProperty(key)) {
                    continue;
                }

                if (_isArray(response[1][key])) {
                    for (const value of response[1][key]) {
                        form.appendChild(this.addField(key, value));
                    }
                } else {
                    form.appendChild(this.addField(key, response[1][key]));
                }
            }
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
            (system: PaymentSystem) => {
                this.onPaymentSystemChange(system);
            },
            this.$destroy,
        );

        this.eventService.subscribe(
            {name: 'PROFILE_UPDATE'},
            () => this.onProfileUpdate(),
            this.$destroy,
        );

        if (this.useBonuses) {
            this.eventService.subscribe([
                {name: BonusItemComponentEvents.deposit},
                {name: BonusItemComponentEvents.blank},
            ], (bonus?: Bonus): void => {
                this.currentBonus = bonus;
                this.availableSystems = bonus?.paySystems || [];
                this.updateFormConfig();

            }, this.$destroy);
        }
    }

    protected initThemeToggleListener(): void {

        if (!this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            return;
        }

        const altHostedFieldsStyles = this.configService.get<string>('$base.colorThemeSwitching.altHostedFieldsStyles');
        const altPiqCashierStyles = this.configService.get<string>('$base.colorThemeSwitching.altPiqCashierStyles');

        if (!altHostedFieldsStyles && !altPiqCashierStyles) {
            return;
        }

        if (altHostedFieldsStyles) {
            this.hostedFieldsStyles.alt = '/static/css/' + altHostedFieldsStyles;
        }

        if (altPiqCashierStyles) {
            this.piqFieldsStyles.alt = '/static/css/' + altPiqCashierStyles;
        }


        if (!!this.configService.get<string>(ColorThemeValues.configName)) {
            if (altHostedFieldsStyles) {
                this.hostedFieldsStyles.current = this.hostedFieldsStyles.alt;
            }
            if (altPiqCashierStyles) {
                this.piqFieldsStyles.current = this.piqFieldsStyles.alt;
            }
        }

        this.eventService.subscribe(
            {name: ColorThemeValues.changeEvent},
            (status: boolean) => {
                if (this.currentSystem?.isHosted && altHostedFieldsStyles) {
                    this.hostedFieldsStyles.current = status
                        ? this.hostedFieldsStyles.alt
                        : this.hostedFieldsStyles.def;
                }
                if (this.currentSystem?.isCashier && altPiqCashierStyles) {
                    this.piqFieldsStyles.current = status
                        ? this.piqFieldsStyles.alt
                        : this.piqFieldsStyles.def;
                }

                if (this.currentSystem?.isHosted || this.currentSystem?.isCashier) {
                    this.onPaymentSystemChange(this.currentSystem);
                }
            }, this.$destroy);
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems();
    }

    protected async onPaymentSystemChange(system: PaymentSystem): Promise<void> {
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: system});
        }

        this.isShowHostedBlock = false;
        this.showErrorHosledLoad = false;
        this.isPrestepComplete = false;

        if (!system) {
            this.dropCurrentSystem();
            return;
        }

        if (this.currentSystem?.clearHostedFields()) {
            this.isLoadingHostedFields = false;
            this.cdr.detectChanges();
        }

        this.usePrestep = system.isPrestep;
        this.currentSystem = system;

        this.timerParams.common.noDays = !DateHelper.dayExists(this.dateExpire);
        this.timerParams.common.noHours = !DateHelper.hoursExists(this.dateExpire);
        if (this.currentSystem.isPregeneration && !this.currentSystem.message) {
            this.isWaitingResponse = true;
            await this.depositAction(0, {bonusId: null});
        }

        this.cryptoCheck = this.currentSystem.cryptoCheck && this.isDeposit;
        this.disableAmount = this.currentSystem.disableAmount;
        this.additionalParams = this.listConfig.paymentType === 'deposit' ?
            system.additionalParamsDeposit : system.additionalParamsWithdraw;
        this.useScroll = !this.currentSystem.autoSelect &&
            this.configService.get<boolean>('$finances.paymentInfo.autoScroll');

        this.setAdditionalValues();
        this.checkUserProfileForPayment();
        this.updateFormConfig();

        this.isCryptoInvoices = this.isDeposit
            && (this.currentSystem.cryptoInvoices || this.currentSystem.isParent);

        if (this.isCryptoInvoices) {

            if (this.currentSystem.isParent) {
                this.parentSystem = this.currentSystem;
                this.invoiceSystems = this.currentSystem.children;
                this.steps.delete(Params.PaymentSteps.paymentInfo);
                this.steps.add(Params.PaymentSteps.cryptoInvoices);
                if (this.useScroll) {
                    this.actionService.scrollTo(`.${this.$params.class}__cryptoInvoiceSystems`,
                        {position: 'center'});
                }
            } else {
                this.steps.add(Params.PaymentSteps.paymentInfo);
                if (this.useScroll) {
                    this.actionService.scrollTo(`.${this.$params.class}__paymentInfo`,
                        {position: 'center'});
                }
            }

            const message: IPaymentMessage = this.currentSystem.message as IPaymentMessage;

            if (this.currentSystem.cryptoInvoices && message?.dateEnd) {
                this.formData$.next({
                    amount: message.userAmount,
                });
            }
        } else {
            this.steps.delete(Params.PaymentSteps.cryptoInvoices);
            this.steps.add(Params.PaymentSteps.paymentInfo);
            this.parentSystem = null;
            this.invoiceSystems = [];
            if (this.useScroll) {
                this.actionService.scrollTo(`.${this.$params.class}__paymentInfo`,
                    {position: 'center'});
            }
        }


        if (this.currentSystem.isHosted
            && (!this.isLoadingHostedFields || !this.currentSystem.hostedFields.loaded)
            && _isEmpty(this.requiredFields)) {
            await this.loadHostedFields();
        }

        if (this.currentSystem.isCashier) {
            this.loadPiqFields();
        }

        this.isWaitingResponse = false;
    }

    protected dropCurrentSystem(): void {
        if (this.parentSystem && !this.currentSystem) {
            this.parentSystem = null;
            this.steps.delete(Params.PaymentSteps.cryptoInvoices);
            this.steps.add(Params.PaymentSteps.paymentInfo);
        } else if (this.parentSystem && this.currentSystem?.cryptoInvoices) {
            this.steps.delete(Params.PaymentSteps.paymentInfo);
        }

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
    }

    protected requestStyles(filePath: string, errorCallback: () => Observable<string>) {
        return this.httpClient.get(filePath, {responseType: 'text'})
            .pipe(
                catchError((error: string): Observable<string> => {
                    this.logService.sendLog({code: '1.4.35', data: error});
                    return errorCallback();
                }),
                takeUntil(this.$destroy),
            );
    }

    protected async loadHostedFields(): Promise<void> {
        this.isLoadingHostedFields = true;
        this.isShowHostedBlock = true;

        if (!(await this.currentSystem.isReadyHostedController)) {
            this.isLoadingHostedFields = false;
            this.isShowHostedBlock = false;
            this.showErrorHosledLoad = true;
            return;
        };

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

        this.requestStyles(
            this.hostedFieldsStyles.current,
            () => this.hostedFieldsStyles.current === this.hostedFieldsStyles.alt
                ? this.requestStyles(this.hostedFieldsStyles.def, () => of(''))
                : of(''),
        ).subscribe((styles: string) => {
            this.currentSystem.setupHostedFields(
                formHasLoadedCallbackHandler,
                formCallbackHandler,
                styles,
            );
        });
    }

    protected loadPiqFields(): void {

        this.requestStyles(
            this.piqFieldsStyles.current,
            () => this.piqFieldsStyles.current === this.piqFieldsStyles.alt
                ? this.requestStyles(this.piqFieldsStyles.def, () => of(''))
                : of(''),
        ).subscribe((styles: string): void => {
            this.cssVariables = styles;
        });
    }

    protected pushNotification(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }

    protected updateFormConfig(): void {

        if (!this.usePrestep || !this.isPrestepComplete) {
            this.prestepFormConfig = null;
            this.formConfig = null;
        }

        const formComponents: IFormComponent[] = [];
        let lastAccount: IFormComponent;

        const isDepInvoice: boolean = this.isDeposit && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd;

        // amount
        const hideAmount: boolean = this.isDeposit && this.disableAmount && !this.currentSystem.cryptoInvoices;

        if (!hideAmount && !this.isPrestepComplete) {
            let amount = _cloneDeep(FormElements.amount);
            let showLimits = false;

            if (this.currentSystem && !this.isInvoicePending) {

                _forEach(amount.params.validators, (val: IValidatorSettings | string) => {
                    if (_isObject(val) && val.name === 'min') {
                        val.options = this.minAmount;
                    } else if (_isObject(val) && val.name === 'max') {
                        val.options = this.maxAmount;
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

            amount.params.locked = isDepInvoice;

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

        if (!isDepInvoice) {
            // additional
            if (!_isEmpty(this.additionalParams)) {

                let originParams: IIndexing<IPaymentAdditionalParam> = {};

                if (this.usePrestep) {
                    originParams = this.isPrestepComplete ?
                        this.currentSystem.poststepParams : this.currentSystem.prestepParams;
                } else {
                    originParams = this.additionalParams;
                }

                const additionalFields = _map(_keys(originParams), (key) => {
                    const field = originParams[key];
                    const fieldSettings: IAdditionalFieldSettings = this.checkAdditionalFieldSettings(key);

                    const validators = field.optional ? [] : ['required'];

                    if (field.type === 'input') {
                        return {
                            name: 'core.wlc-input',
                            alwaysNew: {saveValue: false},
                            params: <IInputCParams>{
                                name: key,
                                value: field.value || '',
                                theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                                common: {
                                    placeholder: field.name,
                                    tooltipText: fieldSettings.tooltip,
                                },
                                control: new UntypedFormControl(''),
                                validators: _concat(validators,
                                    ...(fieldSettings.validators || [])),
                                customMod: ['additional'],
                            },
                        };
                    } else if (field.type === 'select') {
                        return {
                            name: 'core.wlc-select',
                            params: <ISelectCParams>{
                                labelText: field.name,
                                name: key,
                                theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                                common: {
                                    placeholder: field.name,
                                },
                                items: _map(_keys(field.params || {}), (item) => {
                                    return {
                                        value: item,
                                        title: field.params[item],
                                    };
                                }),
                                control: new UntypedFormControl(''),
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
            if (this.isDeposit && this.$params.showPaymentRules && (!this.usePrestep || this.isPrestepComplete)) {
                formComponents.push(FormElements.rules);
            }

            // button
            let button;

            if (this.isDeposit) {
                if (this.usePrestep && !this.isPrestepComplete) {
                    button = FormElements.depositPrestepButton;
                } else {
                    button = FormElements.depositButton;
                }
            } else {
                button = FormElements.withdrawButton;
            }

            formComponents.push(button);
        }

        if (!this.usePrestep || this.isPrestepComplete) {
            this.formConfig = {
                class: `${this.$params.mode}-form`,
                components: formComponents,
            };
        } else {
            this.prestepFormConfig = {
                class: `${this.$params.mode}-form`,
                components: formComponents,
            };
        }

        this.cdr.markForCheck();
    }

    protected get userCountry(): string {
        return this.userProfile.countryCode || '';
    }

    protected checkAdditionalFieldSettings(field: string): IAdditionalFieldSettings {

        let settings: IAdditionalFieldSettings = {};

        if (!_isEmpty(this.additionalFieldsConfig[field])) {
            const fieldConfig: IAdditionalFieldConfig = this.additionalFieldsConfig[field];

            if (fieldConfig.settings?.length) {
                for (const sett of fieldConfig.settings) {

                    if (sett.countries?.length && !_includes(sett.countries, this.userProfile.countryCode)) {
                        continue;
                    }

                    if (sett.systems?.length && !_includes(sett.systems, this.currentSystem.alias)) {
                        continue;
                    }

                    settings = sett;
                    break;
                }
            }

            if (fieldConfig.default && _isEmpty(settings)) {
                settings = fieldConfig.default;
            }
        }

        return settings;
    }

    protected addFormToBodyAndSubmit(response): void {
        const formSubmit: HTMLFormElement = this.createForm(response);
        this.document.body.appendChild(formSubmit);

        if (!this.isShowIframe) {
            formSubmit.submit();
        }
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
                control: new UntypedFormControl(''),
                validators: ['required'],
                customMod: ['additional'],
            },
        };
    }
}
