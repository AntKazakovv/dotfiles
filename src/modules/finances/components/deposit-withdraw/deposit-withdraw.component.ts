import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
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
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject';
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
    IPaymentMessage,
    PIQCashierResponse,
    TAdditionalParams,
} from 'wlc-engine/modules/finances/system/interfaces/';
import {FinancesHelper} from '../../system/helpers/finances.helper';
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
    public $params: Params.IDepositWithdrawCParams;
    public cryptoCheck: boolean = false;
    public disableAmount: boolean = false;
    public title: string = gettext('Deposit');
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};
    public formData$: BehaviorSubject<TFormData> = new BehaviorSubject(null);
    public userTotalBonus: number;
    public userAvailableWithdraw: number;
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

    public formConfig: IFormWrapperCParams;
    public isShowHostedBlock: boolean = false;
    public steps: Set<Params.IPaymentStep> = new Set();

    public useBonuses: boolean = false;
    public bonusesListParams: IFormWrapperCParams;
    public availableSystems: number[] = [];
    public currentBonus: Bonus;

    protected formObject: FormGroup;
    protected inProgress: boolean = false;
    protected userService: UserService;

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

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositWithdrawCParams,
        protected configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
        protected injectionService: InjectionService,
        protected logService: LogService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, logService, modalService, configService, injectionService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');
        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.isDeposit = this.$params.mode === 'deposit';

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
        this.steps.add(Params.PaymentSteps.paymentInfo);

        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(takeUntil(this.$destroy))
            .subscribe((UserProfile) => {
                this.userProfile = UserProfile;
            });

        this.initSubscribers();
        this.updateFormConfig();
        this.initThemeToggleListener();

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

        this.timerParams = _merge(
            _cloneDeep(Params.timerParams),
            this.$params.timerParams,
        );

        await this.financesService.fetchPaymentSystems();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: null});
        }
    }

    public onCryptoInvoiceExpires(): void {
        this.financesService.fetchPaymentSystems();

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
            case 'msg1': return !this.isCryptoInvoices
                && !this.cryptoCheck
                && this.currentSystem?.isPayCryptosV2
                && this.$params.showPaymentRules;
            case 'msg2': return !this.isCryptoInvoices
                && !this.cryptoCheck
                && this.currentSystem?.isPayCryptosV2
                && !this.$params.showPaymentRules;
            case 'msg3': return this.isCryptoInvoices
                && !(this.currentSystem?.message as IPaymentMessage)?.dateEnd;
        }
    }

    public formBeforeSubmit(form: FormGroup): boolean {
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
    public emptyOnlyField(form: FormGroup, field: string): boolean {
        if (form.controls[field]?.value) {
            return false;
        }

        return !_find(form.controls, (control: FormControl, key: string): boolean => {
            if (key !== 'submit' && key !== field) {
                return !control.value;
            }
            return false;
        });
    }

    public sendForm(form: FormGroup): void {
        if (this.inProgress) {
            return;
        }
        this.formObject = form;

        if (this.isDeposit) {
            this.deposit();
        } else {
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
                    gettext('Withdraw request has been successfully sent!'),
                    this.translateService.instant(gettext('Withdraw sum')) + ` ${currencyIcon}`,
                ],
                wlcElement: 'notification_withdraw-request-success',
                displayAsHTML: true,
            });

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
                    title: this.isDeposit ? gettext('Deposit error') : gettext('Withdraw error'),
                    message: FinancesHelper.errorToMessage(error),
                },
            });
        }
    }

    public get minAmount(): number {
        if (this.$params.mode === 'withdraw') {
            return this.currentSystem.withdrawMin;
        } else {
            return _max([
                +this.currentSystem.depositMin,
                this.currentBonus?.minDeposit,
            ]);
        }
    }

    public get maxAmount(): number {
        if (this.$params.mode === 'withdraw') {
            return this.currentSystem.withdrawMax;
        } else {
            return _min([
                +this.currentSystem.depositMax,
                this.currentBonus?.maxDeposit || null,
            ]);
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
        return this.cryptoCheck
            && this.isCryptoInvoices
            && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd
            && this.dateExpire >= DateTime.now();
    }

    public get showPaymentMessage(): boolean {
        return this.currentSystem && this.cryptoCheck && !this.isCryptoInvoices;
    }

    public get dateExpire(): DateTime {
        return DateTime.fromISO((this.currentSystem?.message as IPaymentMessage)?.dateEnd);
    }

    private async depositAction(amount: number, params: TAdditionalParams, saveProfile: boolean = true): Promise<void> {
        this.isShowIframe = this.depositInIframe && this.currentSystem.appearance === 'iframe';
        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                amount || this.currentSystem.depositMin,
                {...params, bonusId: this.currentBonus?.id || null},
                this.cssVariables,
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

            this.addFormToBodyAndSubmit(response);
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

            if (this.isInvoicePending) {
                this.updateFormConfig();
            };

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

    protected onPaymentSystemChange(system: PaymentSystem): void {
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: system});
        }

        this.isShowHostedBlock = false;

        if (!system) {
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
            return;
        }

        if (this.currentSystem?.isHosted) {
            this.currentSystem.resetHostedFields();
            this.currentSystem.dropHostedFields();
            this.isLoadingHostedFields = false;
            this.cdr.detectChanges();
        }

        this.currentSystem = system;
        this.cryptoCheck = this.currentSystem.cryptoCheck && this.isDeposit;
        this.disableAmount = this.currentSystem.disableAmount;
        this.additionalParams = this.listConfig.paymentType === 'deposit' ?
            system.additionalParamsDeposit : system.additionalParamsWithdraw;

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
            } else {
                this.steps.add(Params.PaymentSteps.paymentInfo);
            }

            const message: IPaymentMessage = this.currentSystem.message as IPaymentMessage;

            if (this.isCryptoInvoices && this.currentSystem.cryptoInvoices && message?.dateEnd) {
                this.formData$.next({
                    amount: message.userAmount,
                });
            }
        } else {
            this.steps.delete(Params.PaymentSteps.cryptoInvoices);
            this.steps.add(Params.PaymentSteps.paymentInfo);
            this.parentSystem = null;
            this.invoiceSystems = [];
        }


        if (this.currentSystem.isHosted
            && (!this.isLoadingHostedFields || !this.currentSystem.hostedFields.loaded)
            && _isEmpty(this.requiredFields)) {
            this.loadHostedFields();
        }

        if (this.currentSystem.isCashier) {
            this.loadPiqFields();
        }
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
        ).subscribe((styles: string): void  => {
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
        const formComponents: IFormComponent[] = [];
        let lastAccount: IFormComponent;

        // amount
        const hideAmount: boolean = this.isDeposit && this.disableAmount && !this.currentSystem.cryptoInvoices;

        if (!hideAmount) {
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

            amount.params.locked = this.isInvoicePending;

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
                        alwaysNew: {saveValue: false},
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
        if (this.isDeposit && this.$params.showPaymentRules && !this.isInvoicePending) {
            formComponents.push(FormElements.rules);
        }

        // button
        if (!this.isInvoicePending) {
            const button = this.isDeposit ? FormElements.depositButton : FormElements.withdrawButton;
            formComponents.push(button);
        }

        this.formConfig = {
            class: `${this.$params.mode}-form`,
            components: formComponents,
        };

        this.cdr.markForCheck();
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
                control: new FormControl(''),
                validators: ['required'],
                customMod: ['additional'],
            },
        };
    }
}
