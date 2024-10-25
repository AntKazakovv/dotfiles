import {
    Component,
    OnInit,
    OnChanges,
    ChangeDetectionStrategy,
    Inject,
    Input,
    SimpleChanges,
    OnDestroy,
    SimpleChange,
    Output,
    EventEmitter,
} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {
    BehaviorSubject,
    Observable,
    Subject,
    firstValueFrom,
    of,
} from 'rxjs';
import {
    catchError,
    distinctUntilChanged,
    takeUntil,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _cloneDeep from 'lodash-es/cloneDeep';
import _concat from 'lodash-es/concat';
import _has from 'lodash-es/has';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _isObject from 'lodash-es/isObject';
import _isArrayLikeObject from 'lodash-es/isArrayLikeObject';
import _keys from 'lodash-es/keys';
import _map from 'lodash-es/map';
import _max from 'lodash-es/max';
import _min from 'lodash-es/min';
import _merge from 'lodash-es/merge';
import _set from 'lodash-es/set';
import _sortBy from 'lodash-es/sortBy';

import {
    IFormComponent,
    IFormWrapperCParams,
    IIndexing,
    IInputCParams,
    ISelectCParams,
    IValidatorSettings,
    GlobalHelper,
    IExtProfilePaymentSystems,
    NotificationEvents,
    EventService,
    LogService,
    ModalService,
    IPushMessageParams,
    ITimerCParams,
    IExtProfile,
    IExtPaymentSystem,
    InjectionService,
    IModalParams,
    DateHelper,
    ValidatorType,
    ICheckboxCParams,
    IModalConfig,
} from 'wlc-engine/modules/core';
import {
    ColorThemeValues,
    ProhibitedPatterns,
} from 'wlc-engine/modules/core/constants';

import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

import {
    IAdditionalFieldConfig,
    IAdditionalFieldSettings,
    IPaymentMessage,
    PIQCashierResponse,
    TAdditionalParams,
    TPaymentsMethods,
} from 'wlc-engine/modules/finances/system/interfaces';
import {FinancesHelper} from '../../system/helpers/finances.helper';

import {ISelectedWallet} from 'wlc-engine/modules/multi-wallet';

import {
    IHostedFormData,
    IPaymentAdditionalParam,
    PaymentSystem,
} from 'wlc-engine/modules/finances/system/models';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';

import {Bonus} from 'wlc-engine/modules/bonuses';
import {ISelectOptions} from 'wlc-engine/modules/profile';
import {IAmountLimitCParams} from 'wlc-engine/standalone/core/components/amount-limit/amount-limit.params';
import {UserProfile} from 'wlc-engine/modules/user';
import {PaymentMessageComponent} from '../payment-message/payment-message.component';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractDepositWithdrawComponent,
} from 'wlc-engine/modules/finances/system/classes/abstract.deposit-withdraw.component';
import {IPaymentMessageCParams} from 'wlc-engine/modules/finances/components/payment-message/payment-message.params';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

import * as Params from './payment-form.params';

type TCryptoInfo = 'msg1' | 'msg2' | 'msg3';
type THostedStyles = 'current' | 'def' | 'alt';
type TModalType = 'markup' | 'info' | 'message';
type TFormData = IIndexing<string | number | boolean>;

@Component({
    selector: '[wlc-payment-form]',
    templateUrl: './payment-form.component.html',
    styleUrls: ['./styles/payment-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PaymentFormComponent
    extends AbstractDepositWithdrawComponent<Params.IPaymentFormCParams> implements OnInit, OnChanges, OnDestroy {
    @Input() public inlineParams: Params.IPaymentFormCParams;
    @Input() public mode: TPaymentsMethods;
    @Input() public override currentSystem: PaymentSystem;
    @Input() public bonus: Bonus;
    @Input() public wallet: ISelectedWallet;
    @Input() public amount: number;
    @Output() public changeStep: EventEmitter<void> = new EventEmitter();
    @Output() public updateAmount: EventEmitter<number> = new EventEmitter();

    public override $params: Params.IPaymentFormCParams;
    public additionalParams: IIndexing<IPaymentAdditionalParam> = {};
    public formConfig: IFormWrapperCParams;
    public prestepFormConfig: IFormWrapperCParams;
    public disableAmount: boolean = false;
    public walletCurrency: string;
    public timerParams: ITimerCParams;
    public isWaitingResponse: boolean = false;
    public showModalCryptoPayment: boolean = true;
    public showErrorHostedLoad: boolean = false;
    public isShowHostedBlock: boolean = false;
    public invoiceSystems: PaymentSystem[] = [];
    public parentSystem: PaymentSystem = null;
    public formData$: BehaviorSubject<TFormData> = new BehaviorSubject(null);
    public userProfile$: Subject<UserProfile> = new Subject();
    public onChanges$: Subject<SimpleChanges> = new Subject();

    protected amount$: BehaviorSubject<number> = new BehaviorSubject(0);
    protected userTotalBalance: number = null;
    protected userAvailableWithdraw: number = null;
    protected amountControl: UntypedFormControl;
    protected clearAmountButton = _cloneDeep(FormElements.clearAmountButton);
    protected cryptoCheck: boolean = false;
    protected isCryptoInvoices: boolean = false;
    protected currentCurrency: string;
    // TODO позже надо посмотреть не лишнее ли поле
    protected currency: string;
    protected usePreselectedSummation: boolean = false;
    protected isLoadingHostedFields: boolean = false;
    protected formObject: UntypedFormGroup;
    protected inProgress: boolean = false;
    protected userService: UserService;

    protected lotteriesService: LotteriesService;
    protected useLotteryWidget: boolean = false;
    protected showLotteryWidget: boolean = false;
    protected lotteryWidget: IFormComponent;

    protected hostedFieldsStyles: Record<THostedStyles, string> = {
        current: '/static/css/hosted.fields.css',
        def: '/static/css/hosted.fields.css',
        alt: null,
    };
    protected piqFieldsStyles: Record<THostedStyles, string> = {
        current: '/static/css/piq.cashier.css',
        def: '/static/css/piq.cashier.css',
        alt: null,
    };
    protected isRomanianLicense: boolean = false;
    protected commissionsInfoConfig: IFormComponent = {
        name: 'finances.wlc-tax-info',
        params: {},
    };

    private additionalFieldsConfig: IIndexing<IAdditionalFieldConfig>;
    private isDeposit: boolean;
    private isMultiWallet: boolean = false;
    private isPrestepComplete: boolean = false;
    private usePrestep: boolean = false;
    private userProfile: UserProfile;
    private cssVariables: string;
    private prestepAmount: number = 0;
    private hideAmount: boolean = false;

    private formSubmit: HTMLFormElement;
    private newTabRef: Window;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentFormCParams,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,

        injectionService: InjectionService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        modalService: ModalService,
        logService: LogService,
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, logService, modalService, injectionService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (!this.mode) {
            this.mode = this.$params.mode;
        }

        this.isDeposit = this.mode === 'deposit';
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
        this.additionalFieldsConfig = this.configService.get('$finances.fieldsSettings.additional');
        this.usePreselectedSummation = this.configService.get<boolean>('$finances.preselectButtons.summationMode');
        this.isRomanianLicense = this.configService.get<string>('appConfig.license') === 'romania';
        this.useLotteryWidget = this.isDeposit && this.configService.get<boolean>('$finances.useLotteryWidget');

        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(takeUntil(this.$destroy))
            .subscribe((userProfile) => {
                if (userProfile) {
                    this.userProfile$.next(userProfile);
                    this.userProfile = userProfile;

                    if (!this.isMultiWallet) {
                        this.currentCurrency = this.userProfile.idUser
                            ? this.userProfile.currency
                            : this.configService.get<string>('$base.defaultCurrency') || 'EUR';
                    }

                    if (this.showCommissions) {
                        this.initCommissions();
                        this.updateFormConfig();
                    }

                    this.checkUserProfileForPayment();
                }
            });

        this.initSubscribers();

        if (this.useLotteryWidget) {
            this.prepareLotteryWidget();
        }

        if (!this.isDeposit) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');

            this.userService.userInfo$
                .pipe(takeUntil(this.$destroy))
                .subscribe((userInfo: UserInfo): void => {
                    if (!userInfo) {
                        return;
                    }
                    this.userTotalBalance = userInfo.getBalanceForSelectWallet(this.wallet);
                    this.userAvailableWithdraw = userInfo.getAvailableWithdrawForSelectWallet(this.wallet);
                    this.cdr.markForCheck();
                });
        }

        if (this.isMultiWallet && this.wallet) {
            this.currentCurrency = this.wallet.walletCurrency;
        }

        this.timerParams = _merge(
            _cloneDeep(Params.timerParams),
            this.$params.timerParams,
        );

        if (this.currentSystem) {
            this.updateAdditionalParams();
            this.onPaySystemChange();
        }

        this.initThemeToggleListener();
        this.updateCryptoFields();
        this.updateFormConfig();

        this.onChanges$.subscribe((data: SimpleChanges): void => {
            this.changesHandler(data);
        });
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        this.onChanges$.next(changes);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.onChanges$.complete();
    }

    public get usePregeneration(): boolean {
        return this.currentSystem?.isPregeneration
            && this.isDeposit
            && !this.isMultiWallet
            && !this.currentSystem.message;
    }

    public get isInvoicePending(): boolean {
        return this.isDeposit
            && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd
            && this.dateExpire > dayjs();
    }

    public get isInvoiceExpired(): boolean {
        return this.isDeposit && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd
            && this.dateExpire <= dayjs();
    }

    public get showPaymentMessage(): boolean {
        return this.currentSystem
            && this.cryptoCheck
            && !this.isCryptoInvoices
            && !this.requiredFieldsKeys.length
            && !this.isMultiWallet;
    }

    public get dateExpire(): Dayjs {
        return dayjs((this.currentSystem?.message as IPaymentMessage)?.dateEnd, 'YYYY-MM-DDTHH:mm:ss');
    }

    public get showCommissions(): boolean {
        return this.isRomanianLicense
            && this.userProfile?.selectedCurrency === 'RON'
            && this.userProfile.countryCode === 'rou';
    }

    public get minAmount(): number {
        if (this.isDeposit) {
            return _max([
                +this.currentSystem.depositMin,
                this.bonus?.minDeposit,
            ]);
        } else {
            return this.currentSystem.withdrawMin;
        }
    }

    public get maxAmount(): number {
        if (this.isDeposit) {
            return _min([
                +this.currentSystem.depositMax,
                this.bonus?.maxDeposit || null,
            ]);
        } else {
            return this.currentSystem.withdrawMax;
        }
    }

    public get paymentMessageParams(): Partial<IPaymentMessageCParams> {
        return this.$params.paymentMessageParams;
    }

    public get readyToShow(): boolean {
        return !this.requiredFieldsKeys.length && !this.isWaitingResponse && !this.showErrorHostedLoad;
    }

    public get isNotInvoice(): boolean {
        return !(this.currentSystem?.message as IPaymentMessage)?.dateEnd;
    }

    protected get showAdditionalFields(): boolean {
        return this.$params.type !== 'partial-amount'
            || this.currentSystem?.cryptoInvoices
            || this.currentSystem?.cryptoCheck;
    }

    protected get isNeedThirdStep(): boolean {
        const isNotCrypto: boolean = !this.currentSystem.cryptoCheck && !this.currentSystem.cryptoInvoices;

        return this.$params.type === 'partial-amount'
            && isNotCrypto
            && (this.currentSystem.isHosted || !_isEmpty(this.additionalParams));
    }

    public onCryptoInvoiceExpires(): void {
        this.cdr.detectChanges();

        this.eventService.emit({
            name: 'CLEAR_AMOUNT',
        });

        if (this.modalService.getActiveModal('payment-message')) {
            this.modalService.hideModal('payment-message');
        }

        this.pushNotification({
            type: 'success',
            title: gettext('Deposit'),
            message: [
                gettext('The deposit period for the issued invoice has expired.'),
                gettext('If you have sent a payment, check the status of '
                    + 'the transaction on the transaction history page'),
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

        if (!this.isDeposit
            || !this.currentSystem
            || this.currentSystem.id < 0
            || this.requiredFieldsKeys.length
        ) {
            return false;
        }

        switch (msg) {
            case 'msg1':
                return !this.isCryptoInvoices
                    && (!this.cryptoCheck || (this.cryptoCheck && this.isMultiWallet))
                    && this.currentSystem?.isPayCryptosV2;
            case 'msg2':
                return this.isCryptoInvoices
                    && !(this.currentSystem?.message as IPaymentMessage)?.dateEnd;
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

    public async sendForm(form: UntypedFormGroup): Promise<boolean> {
        if (this.inProgress) {
            return false;
        }

        if (this.isNeedThirdStep) {
            this.updateAmount.emit(form.controls.amount.value);
            this.changeStep.emit();
            return false;
        }

        this.formObject = form;

        if (this.currentSystem.appearance === 'newtab' && !this.$params.disableNewTabPreloader) {
            this.newTabRef = this.window.open('', '_blank');
            const generatePageFn: Function = this.configService.get<Function>('$finances.payLoaderPageGenerateFn');
            const casinoName: string = this.configService.get<string>('$base.site.name') ?? 'waiting...';
            const pageHTML: string = generatePageFn?.(casinoName) ?? 'waiting...';
            this.newTabRef.document.write(pageHTML);
            this.setCSSVariables(this.newTabRef, ['--mc-main', '--mc-bg', '--mc-bg700']);
            this.newTabRef.history.pushState({}, null, '/redirect');
        }

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

    public async deposit(): Promise<boolean> {
        this.inProgress = true;
        await this.modalService.showModal('data-is-processing');

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
            return await this.depositAction(amount, this.getAdditionalParams());
        }
    }

    @CustomHook('finances', 'paymentMessageWithdraw')
    public async withdraw(form: UntypedFormGroup): Promise<boolean> {
        this.modalService.showModal('data-is-processing');
        this.inProgress = true;
        let isWithdrawSuccess: boolean = true;

        try {
            const response = await this.financesService.withdraw(
                this.currentSystem.id,
                form.value.amount,
                this.getAdditionalParams() || {},
                this.cssVariables,
                this.wallet,
            );

            await this.saveProfile();

            if (response[0] === 'redirect') {
                this.checkAppearance(response);
                return;
            } else if (response[0] === 'POST') {
                this.addFormToBodyAndSubmit(response);
                return;
            } else if (response[0] === 'message') {
                this.currentSystem.message = response[1];
                this.modalService.showModal(
                    this.getPaymentMessageModalConfig('message'),
                );
                return;
            } else if (response[0] === PIQCashierResponse) {
                return;
            }

            const currencyIcon = `
                <span wlc-currency
                    [value]="${form.value.amount}"
                    [currency]="'${this.currentCurrency ?? this.userProfile.selectedCurrency}'"
                ><span>`;

            this.pushNotification({
                type: 'success',
                title: gettext('Withdraw'),
                message: [
                    this.translateService.instant('Withdraw request has been successfully sent!'),
                    this.translateService.instant('Withdrawal amount') + ` ${currencyIcon}`,
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
            isWithdrawSuccess = false;

            if (this.newTabRef) {
                this.newTabRef.close();
                this.newTabRef = null;
            }

            return false;
        } finally {

            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }
            this.inProgress = false;
            if (isWithdrawSuccess) {
                this.financesService.fetchPaymentSystems(this.wallet?.walletCurrency);
            }
        }
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

    @CustomHook('finances', 'paymentFormSetAmountSubscriber')
    public setAmountSubscriber(form: UntypedFormGroup): void {
        this.amountControl = <UntypedFormControl>form.controls['amount'];
        if (this.amountControl) {
            this.amountControl.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    takeUntil(this.$destroy),
                ).subscribe(val => {
                    if (val === '') {
                        this.eventService.emit({name: 'AMOUNT_IS_EMPTY'});
                        this.clearAmountButton.params.isAmountEmpty = true;
                    } else {
                        this.eventService.emit({name: 'AMOUNT_NOT_EMPTY'});
                        this.clearAmountButton.params.isAmountEmpty = false;
                    }
                    this.amount$.next(val);
                });
        }
    }

    public formBeforeSubmit(): boolean {
        const notificationTitle = this.isDeposit ? gettext('Deposit') : gettext('Withdraw');
        if (!this.currentSystem) {
            this.pushNotification({
                type: 'error',
                title: notificationTitle,
                message: gettext('You must select a payment method'),
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

    public createNewInvoice(): void {
        this.currentSystem.message = {};
        this.onPaySystemChange();
    }

    public cancelInvoiceHandler(): void {
        this.financesService.cancelInvoiceHandler(this.currentSystem?.id);
    }

    public getInputParamsLockedAmount(): IInputCParams {
        const amount: IInputCParams = _merge(
            _cloneDeep(FormElements.amount.params),
            {
                control: new UntypedFormControl((this.currentSystem.message as IPaymentMessage).userAmount),
                validators: null,
            },
        );
        amount.control.disable();
        return amount;
    }

    protected async initCommissions(): Promise<void> {
        const params = {
            mode: this.mode,
            amount$: this.amount$,
        };

        _set(this.commissionsInfoConfig, 'params', params);
    }

    protected initSubscribers(): void {
        this.eventService.subscribe(
            {name: 'SELECT_AMOUNT'},
            (data: any): void => {
                if (!this.amountControl.touched) {
                    this.amountControl.markAsTouched();
                }

                const sum = this.usePreselectedSummation
                    ? GlobalHelper.sumNumbers(this.amountControl.value, data.amount)
                    : data.amount;

                this.formData$.next({amount: `${sum}`});
            }, this.$destroy);

        this.eventService.subscribe(
            {name: 'INCREASE_AMOUNT'},
            (data: any): void => {
                if (!this.amountControl.touched) {
                    this.amountControl.markAsTouched();
                }

                this.formData$.next({amount: `${data.amount}`});
            }, this.$destroy);

        this.eventService.subscribe(
            {name: 'CLEAR_AMOUNT'},
            (): void => {
                this.formData$.next({amount: ''});
            }, this.$destroy);

        this.eventService.subscribe({name: 'INVOICE_CANCELLED'},
            (): void => {
                if (this.currentSystem) {
                    this.currentSystem = this.financesService.getSystemById(this.currentSystem.id);
                    this.onPaySystemChange();
                }
            }, this.$destroy);
    }

    protected changesHandler(changes: SimpleChanges): void {
        const psChanges: SimpleChange = changes['currentSystem'];
        const bonusChanges: SimpleChange = changes['bonus'];
        const walletChanges: SimpleChange = changes['wallet'];
        const userCurrency: SimpleChange = changes['userCurrency'];

        if (psChanges) {
            this.onPaySystemChange();
        }

        if (bonusChanges) {
            this.onBonusChange();
        }

        if (walletChanges) {
            this.onWalletChange(walletChanges);
        }

        if (userCurrency) {
            this.updateFormConfig();
        }
    }

    protected async onPaySystemChange(): Promise<Promise<void>> {
        if (!this.currentSystem) {
            this.dropPaymentSystem();
            return;
        }

        this.formSubmit = null;
        this.showErrorHostedLoad = false;
        this.isShowHostedBlock = false;
        this.isPrestepComplete = false;

        this.usePrestep = this.currentSystem.isPrestep;
        this.disableAmount = this.currentSystem.disableAmount;

        if (this.currentSystem.customParams?.without_cents && this.amountControl.value) {
            this.formData$.next({
                amount: this.amountControl.value.replace(ProhibitedPatterns.integers, ''),
            });
        }

        if (this.currentSystem.clearHostedFields()) {
            this.isLoadingHostedFields = false;
            this.cdr.detectChanges();
        }

        if (this.usePregeneration) {
            this.isWaitingResponse = true;
            await this.depositAction(0, {bonusId: null});
        }

        if (this.isCryptoInvoices) {

            if (this.currentSystem.isParent) {
                this.parentSystem = this.currentSystem;
                this.invoiceSystems = this.currentSystem.children;
            }

            const message: IPaymentMessage = this.currentSystem.message as IPaymentMessage;

            if (this.currentSystem.cryptoInvoices && message?.dateEnd) {
                this.formData$.next({
                    amount: message.userAmount,
                });
            }
        } else {
            this.parentSystem = null;
        }

        if (this.currentSystem.isHosted
            && (!this.isLoadingHostedFields || !this.currentSystem.hostedFields.loaded)
            && _isEmpty(this.requiredFields)
            && this.$params.type !== 'partial-amount') {
            await this.loadHostedFields();
        }

        if (this.currentSystem.isCashier) {
            this.loadPiqFields();
        }

        this.updateCryptoFields();

        this.timerParams.common.noDays = !DateHelper.dayExists(this.dateExpire);
        this.timerParams.common.noHours = !DateHelper.hoursExists(this.dateExpire);

        this.updateAdditionalParams();
        this.setAdditionalValues();
        this.checkUserProfileForPayment();
        this.updateFormConfig();
    }

    protected onBonusChange(): void {
        this.updateFormConfig();
    }

    protected onWalletChange(changes: SimpleChange): void {
        const wallet = changes.currentValue;

        if (wallet) {
            this.currentCurrency = wallet.walletCurrency;
            this.userTotalBalance = Number(wallet.balance);
            this.userAvailableWithdraw = Number(wallet.availableWithdraw);
            this.updateFormConfig();

            this.lotteriesService?.updateUserCurrency(this.currentCurrency);
        }
    }

    protected updateCryptoFields(): void {

        if (this.currentSystem) {
            this.cryptoCheck = this.currentSystem.cryptoCheck && this.isDeposit;
            this.isCryptoInvoices = this.isDeposit
                && (this.currentSystem.cryptoInvoices || this.currentSystem.isParent);
        }
    }

    protected getAdditionalParams(): IIndexing<string> {
        return _keys(this.formObject.value).reduce((acc: IIndexing<string>, name: string) => {
            if (this.additionalParams[name] || name === 'payer') {
                acc[name] = this.formObject.value[name];
            }
            return acc;
        }, {});
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

    protected pushNotification(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }

    protected updateAdditionalParams(): void {
        if (this.currentSystem) {
            this.additionalParams = this.isDeposit
                ? this.currentSystem.additionalParamsDeposit
                : this.currentSystem.additionalParamsWithdraw;
        }
    }

    protected async prepareLotteryWidget(): Promise<void> {
        this.lotteriesService =
            await this.injectionService.getService<LotteriesService>('lotteries.lotteries-service');
        this.lotteriesService.fetchLottery();
        this.lotteryWidget = this.$params.lotteryWidgetParams;

        _merge(this.lotteryWidget.params.components[0].params, {
            lottery$: this.lotteriesService.lottery$,
            amount$: this.amount$,
            showTicketsCounter: !this.hideAmount,
        });

        this.lotteriesService.lottery$
            .pipe(takeUntil(this.$destroy))
            .subscribe((lottery: Lottery) => {
                this.showLotteryWidget = lottery && lottery.isActive && lottery.checkUserLevel;
                this.updateFormConfig();
            });
    }

    protected updateFormConfig(): void {
        this.hideAmount = this.isDeposit && this.disableAmount && !this.currentSystem?.cryptoInvoices;
        const isDepInvoice: boolean = this.isDeposit && !!(this.currentSystem?.message as IPaymentMessage)?.dateEnd;
        const formComponents: IFormComponent[] = [];
        const preselectedAmountsData: number[] = this.getPreselectedAmounts();
        let lastAccount: IFormComponent;

        if (!this.usePrestep || !this.isPrestepComplete) {
            this.prestepFormConfig = null;
            this.formConfig = null;
        }

        if (!this.hideAmount && !this.isPrestepComplete) {

            if (this.currentSystem?.isPayCryptos && !this.isInvoicePending && !this.currentSystem.isPayCryptosV2) {

                if (this.currentSystem.isLastAccountsObj) {
                    lastAccount = this.getLastAccountSelect(this.currentSystem.lastAccountsObj);
                } else if (this.currentSystem.lastAccounts.length) {
                    lastAccount = this.getLastAccountSelect(this.currentSystem.lastAccounts);
                }
            }

            if (preselectedAmountsData.length && this.$params.type !== 'partial-additional') {
                const preselected: IFormComponent = this.preparePreselectedAmounts(
                    preselectedAmountsData,
                    this.usePreselectedSummation);
                formComponents.push(preselected);
            }

            const amountFieldWrap: IFormComponent = this.prepareAmountFieldConfig(isDepInvoice,
                !!preselectedAmountsData.length);

            if (this.configService.get<boolean>('$finances.useDefaultAmount') && this.isDeposit) {
                this.initDefaultAmount();
            }

            formComponents.push(amountFieldWrap);

            if (this.showCommissions) {
                formComponents.push(this.commissionsInfoConfig);
            }
        }

        if (!isDepInvoice) {
            if (!_isEmpty(this.additionalParams)) {

                let originParams: IIndexing<IPaymentAdditionalParam> = {};

                if (this.usePrestep) {
                    originParams = this.isPrestepComplete ?
                        this.currentSystem.poststepParams : this.currentSystem.prestepParams;
                } else {
                    originParams = this.additionalParams;
                }

                if (this.showAdditionalFields) {
                    const additionalFields: IFormComponent[] = this.prepareAdditionalFields(originParams);
                    const additionalFieldsWrap: IFormComponent = this.$params.additionalFieldsWrapperParams;
                    _set(additionalFieldsWrap, 'params.components', additionalFields);
                    formComponents.push(additionalFieldsWrap);
                }

            }

            if (lastAccount) {
                formComponents.push(lastAccount);
            }

            if (
                !this.isDeposit
                && this.currentSystem?.checkNameBeforeWithdraw
                && this.userProfile.fullName.split(' ').every(Boolean)
            ) {
                formComponents.push({
                    name: 'core.wlc-checkbox',
                    params: <ICheckboxCParams>{
                        name: 'paymentConfirmationUserName',
                        validators: ['requiredTrue'],
                        text: gettext('Recipient data in the profile: <b>{{name}}</b><br>The funds withdrawal ' +
                            'can only be made to an account registered in the name and last name specified in ' +
                            'the profile. Otherwise the request will be declined'),
                        textContext: {name: this.userProfile.fullName},
                    },
                });
            }
        }

        if (this.useLotteryWidget && this.showLotteryWidget) {
            _set(this.lotteryWidget, 'params.components[0].params.showTicketsCounter', !this.hideAmount);

            formComponents.push(this.lotteryWidget);
        }

        if (!this.showPaymentMessage || _isEmpty(this.currentSystem?.message)) {
            const button: IFormComponent = this.prepareMainButton();
            formComponents.push(button);
        }

        if (!this.usePrestep || this.isPrestepComplete) {
            this.formConfig = {
                class: `${this.mode}-form`,
                components: formComponents,
            };
        } else {
            this.prestepFormConfig = {
                class: `${this.mode}-form`,
                components: formComponents,
            };
        }

        this.cdr.markForCheck();
    }

    protected prepareMainButton(): IFormComponent {
        let button: IFormComponent;

        if (this.isDeposit) {
            if (this.usePrestep && !this.isPrestepComplete) {
                button = FormElements.depositPrestepButton;
            } else {
                button = FormElements.depositButton;
            }
        } else {
            button = FormElements.withdrawButton;
        }

        button = _cloneDeep(button);

        if (this.$params.type === 'partial-additional') {
            _set(button, 'params.common.text', gettext('Save'));
        }

        return button;
    }

    protected prepareAdditionalFields(originParams: IIndexing<IPaymentAdditionalParam>): IFormComponent[] {
        return _map(_keys(originParams), (key) => {
            const field: IPaymentAdditionalParam = originParams[key];
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
                        value: this.additionalParams[key].value,
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

    protected preparePreselectedAmounts(data: number[], usePreselectedSummation: boolean): IFormComponent {
        const component: IFormComponent = _cloneDeep(FormElements.preselectedAmounts);
        component.params.amounts = data;
        component.params.summationMode = usePreselectedSummation;
        component.params.currency = this.wallet?.walletCurrency || this.userProfile.selectedCurrency;

        return component;
    }

    protected prepareAmountFieldConfig(isLocked: boolean, showClearBtn: boolean): IFormComponent {
        let amount: IFormComponent;
        let showLimits: boolean = false;

        if (this.$params.amountWithButtons) {
            amount = _cloneDeep(FormElements.amountWithButtons);
            _set(amount, 'params.amount.currency', this.currentCurrency);
        } else {
            amount = _cloneDeep(FormElements.amount);
            _set(amount, 'params.currency', this.currentCurrency);
        }

        if (this.amount) {
            _set(amount, 'params.value', this.amount);
        }

        const customValidators: ValidatorType[] =
            this.configService.get<ValidatorType[]>(`$finances.fieldsSettings.amount.customValidators[${this.mode}]`);

        if (customValidators) {
            amount.params.validators.push(...customValidators);
        }

        if (this.currentSystem && !this.isInvoicePending) {
            this.setAmountValidators(amount);
            showLimits = true;
        }

        amount.params.locked = isLocked;

        const limitParams: IAmountLimitCParams = this.setLimitParams(amount, showLimits);
        const amountWrapper: IFormComponent = _cloneDeep(this.$params.amountWrapperParams);
        const limitsWrapper: IFormComponent = _cloneDeep(this.$params.limitsWrapperParams);
        _set(limitsWrapper, 'params.components[0].params', limitParams);

        amountWrapper.params.components = [
            amount,
        ];

        if (limitParams.showLimits) {
            amountWrapper.params.components.push(limitsWrapper);
        }

        if (!this.$params.hideClearAmountButton && showClearBtn) {
            amountWrapper.params.components.push(this.clearAmountButton);
        }

        return amountWrapper;
    }

    protected setLimitParams(amount: IFormComponent, showLimits: boolean): IAmountLimitCParams {
        const limitParams: IAmountLimitCParams = {
            minValue: amount.params.validators
                .find((val) => val['name'] && val['name'] === 'min')['options'],
            maxValue: amount.params.validators
                .find((val) => val['name'] && val['name'] === 'max')['options'],
            showLimits,
        };

        if (this.isMultiWallet) {
            limitParams.currency = this.wallet?.walletCurrency;
        }

        return limitParams;
    }

    protected setAmountValidators(amount: IFormComponent): void {
        _forEach(amount.params.validators, (val: IValidatorSettings | string) => {
            if (_isObject(val) && val.name === 'min') {
                val.options = this.minAmount;
            } else if (_isObject(val) && val.name === 'max') {
                val.options = this.maxAmount;
            }
        });

        if (this.currentSystem.customParams?.without_cents) {
            amount.params.prohibitedPattern = ProhibitedPatterns.integers;
        }
    }

    protected getPreselectedAmounts(): number[] {
        let amounts: number[] = [];
        if (this.currentSystem) {
            amounts = this.isDeposit
                ? this.currentSystem.getPreselectedDepositAmounts(this.currentCurrency)
                : this.currentSystem.getPreselectedWithdrawAmounts(this.currentCurrency);
        }
        return !_isEmpty(amounts) ? amounts : [];
    }

    protected async setAdditionalValues(): Promise<void> {

        if (_isEmpty(this.currentSystem.additionalParams)) {
            return;
        }

        const userProfile: UserProfile = await firstValueFrom(this.userProfile$);
        const savedAdditional: IExtProfilePaymentSystems = userProfile.extProfile?.paymentSystems;

        if (savedAdditional?.[this.currentSystem.alias]) {
            delete savedAdditional[this.currentSystem.alias].additionalParams.bonusId;
            for (const key in savedAdditional[this.currentSystem.alias].additionalParams) {
                if (_has(this.additionalParams, key)) {
                    this.additionalParams[key].value = savedAdditional[this.currentSystem.alias].additionalParams[key];
                }
            }
        }
    }

    protected requestStyles(filePath: string, errorCallback: () => Observable<string>): Observable<string> {
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
            this.showErrorHostedLoad = true;
            return;
        };

        this.currentSystem.resetHostedFields();

        const formCallbackHandler = (formData: IHostedFormData): void => {
            if (!formData.errors || _isEmpty(formData.errors)) {
                this.currentSystem.validateHostedFields();
                this.depositAction(this.formObject.value.amount, formData as IIndexing<string>);
            } else {
                this.currentSystem.invalidateHostedFields();
                this.inProgress = false;
                this.cdr.markForCheck();
            }
        };

        const formHasLoadedCallbackHandler = (): void => {
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

    protected showDepositResponse(params: IPaymentMessage | string, type: TModalType): void {
        this.currentSystem.message = params;
        this.cdr.detectChanges();

        let modalType: TModalType = 'info';
        let isInvoice: boolean = true;

        if (type === 'message' || 'markup') {
            modalType = type;
        }

        if (typeof params !== 'string') {
            isInvoice = !!params.dateEnd;
        }

        this.modalService.showModal(
            this.getPaymentMessageModalConfig(modalType, isInvoice),
        );

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
            modalTitle: gettext('Deposit'),
            modifier: type,
            component: PaymentMessageComponent,
            componentParams: {
                themeMod: 'modal',
                system: this.currentSystem,
                minAmount: this.minAmount,
                maxAmount: this.maxAmount,
                currency: this.currentCurrency,
                mode: this.mode,
            },
            dismissAll: true,
            backdrop: 'static',
            showFooter: !isInvoice,
        };
    }

    protected addFormToBodyAndSubmit(response): void {
        if (this.newTabRef) {
            const url: URL = this.createURL(response);
            this.newTabRef.location = url.href;
            this.newTabRef = null;
        } else {
            this.formSubmit = this.createForm(response);
            this.document.body.appendChild(this.formSubmit);
        }
    }

    protected createURL(response: any): URL {
        let url: URL = new URL(response[1]?.URL);

        for (const key in response[1]) {

            if (key === 'URL' || !response[1].hasOwnProperty(key)) {
                continue;
            }

            if (_isArray(response[1][key])) {
                for (const value of response[1][key]) {
                    url.searchParams.append(key, value);
                }
            } else {
                url.searchParams.append(key, response[1][key]);
            }
        }

        return url;
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

        if (this.currentSystem.appearance === 'iframe') {

            if (response[0] === 'GET') {
                const responseUrl = response[1].URL;
                let responseParams = '';

                Object.keys(response[1]).map((key) => {

                    if (key !== 'URL') {

                        if (!responseParams) {
                            responseParams = `${key}=${response[1][key]}`;
                        } else {
                            responseParams = responseParams + `&${key}=${response[1][key]}`;
                        }
                    }
                });

                form.action = `${responseUrl}?${responseParams}`;
            }
            form.target = 'deposit_frame';
            this.showIFrame(form);
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

    protected showIFrame(form: HTMLFormElement): void {
        const isGetRequest: boolean = form.method === 'get';

        const options: IModalParams = {
            id: 'iframe-deposit',
            modifier: 'iframe-deposit',
            componentName: 'finances.wlc-iframe-deposit',
            componentParams: {
                ...(isGetRequest && {src: form.action}),
            },
            size: 'lg',
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
            modalTitle: this.isDeposit ? gettext('Deposit') : gettext('Withdraw'),
            onModalShown: isGetRequest ? () => {} : () => form.submit(),
        };

        this.modalService.showModal(options);
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

    protected dropPaymentSystem(): void {
        this.parentSystem = null;
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
                    this.onPaySystemChange();
                }
            }, this.$destroy);
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

    private async depositAction(
        amount: number,
        params: TAdditionalParams,
    ): Promise<boolean> {

        const isPregeneration: boolean = this.currentSystem.isPregeneration;
        let isDepositSuccess: boolean = true;

        try {
            const response = await this.financesService.deposit(
                this.currentSystem.id,
                amount || this.currentSystem.depositMin,
                {
                    ...params,
                    bonusId: this.bonus?.id,
                    bonusCode: this.bonus?.promoCode,
                },
                this.cssVariables,
                this.wallet,
            );

            if (!isPregeneration) {
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
                    this.checkAppearance(response);
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
            isDepositSuccess = false;

            if (this.newTabRef) {
                this.newTabRef.close();
                this.newTabRef = null;
            }

            return false;
        } finally {
            if (this.formSubmit && isDepositSuccess && this.currentSystem.appearance !== 'iframe') {
                if (this.newTabRef) {
                    this.newTabRef.location = this.formSubmit.action;
                    this.newTabRef = null;
                } else {
                    setTimeout(() => {
                        this.formSubmit.submit();
                    }, 100);
                }
            }

            if (this.modalService.getActiveModal('data-is-processing')) {
                this.modalService.hideModal('data-is-processing');
            }
            this.inProgress = false;
            this.isWaitingResponse = false;

            if (this.isInvoicePending) {
                this.updateFormConfig();
            }

            if (!isPregeneration && isDepositSuccess) {
                this.financesService.fetchPaymentSystems(this.wallet?.walletCurrency);
            }
        }
    }

    private checkAppearance(response: any): void {
        switch (this.currentSystem.appearance) {
            case 'newtab':
                if (this.newTabRef) {
                    this.newTabRef.location = response[1];
                    this.newTabRef = null;
                } else {
                    setTimeout(() => {
                        this.window.open(response[1], '_blank');
                    }, 100);
                }
                break;
            case 'iframe':
                this.addFormToBodyAndSubmit(response);
                break;
            default:
                this.window.location.href = response[1];
                break;
        }
    }

    private initDefaultAmount(): void {
        const preselectedAmountsData: number[] = this.getPreselectedAmounts();

        if (preselectedAmountsData.length) {

            if (preselectedAmountsData.length >= 2) {
                this.formData$.next({amount: `${_sortBy(preselectedAmountsData)[1]}`});
            } else {
                this.formData$.next({amount: `${preselectedAmountsData[0]}`});
            }
        }
    }

    private setCSSVariables(targetWindow: Window, CSSVariables: string[]): void {
        const computedStyles: CSSStyleDeclaration = getComputedStyle(this.window.document.documentElement);
        CSSVariables.forEach((variable: string): void => {
            targetWindow.document.documentElement.style.setProperty(
                variable,
                computedStyles.getPropertyValue(variable),
            );
        });
    }
}
