import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    trigger,
    style,
    animate,
    transition,
} from '@angular/animations';

import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    Observable,
    firstValueFrom,
} from 'rxjs';
import {
    first,
    takeUntil,
    distinctUntilChanged,
    filter,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _merge from 'lodash-es/merge';
import _uniq from 'lodash-es/uniq';
import _remove from 'lodash-es/remove';
import _each from 'lodash-es/each';
import _find from 'lodash-es/find';
import _indexOf from 'lodash-es/indexOf';

import {
    IMixedParams,
    EventService,
    IFormWrapperCParams,
    InjectionService,
    ActionService,
    AbstractComponent,
    GlobalHelper,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {
    IAlertMessage,
    TAlertList,
    TShowMode,
} from 'wlc-engine/modules/finances';

import {
    UserInfo,
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    ActionTypeEnum,
    Bonus,
    BonusesService,
    BonusItemComponentEvents,
    IBonusActionEvent,
    IBonusesListCParams,
    TBonusEvent,
} from 'wlc-engine/modules/bonuses';

import {
    ISelectedWallet,
    MultiWalletEvents,
} from 'wlc-engine/modules/multi-wallet';
import {WalletsParams} from 'wlc-engine/modules/multi-wallet/components/wallets/wallets.params';
import {IPaymentFormCParams} from 'wlc-engine/modules/finances/components/payment-form/payment-form.params';

import * as Params from './deposit-withdraw.params';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('stepChanged', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'translateY(10px)',
                }),
                animate('200ms 150ms ease-out', style({
                    opacity: 1,
                    transform: 'translateY(0)',

                })),
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({
                    opacity: 0,
                    transform: 'translateY(10px)',
                })),
            ]),
        ]),
    ],
})
export class DepositWithdrawComponent
    extends AbstractComponent
    implements OnInit, OnDestroy {
    public override $params: Params.IDepositWithdrawCParams;
    public currentSystem: PaymentSystem;
    public title: string = gettext('Deposit');
    public lastSucceedPaymentMethod: Promise<number | null>;
    public originalTheme: Params.Theme;
    public listConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
    };
    public cryptoListConfig: IPaymentListCParams = {
        paymentType: 'deposit',
        wlcElement: 'block_payment-list',
        theme: 'crypto-list',
        chosenMethodText: gettext('The selected cryptocurrency:'),
        noSelectedButton: null,
        buttonText: gettext('Show all cryptocurrencies'),
    };

    public parentSystem: PaymentSystem = null;
    /** Defines if crypto invoice payment chosen */
    public isCryptoInvoices: boolean = false;

    public steps: Array<Params.IPaymentStep> = [];

    public useBonuses: boolean = false;
    public showBonuses: boolean = false;
    public bonusesListParams: IFormWrapperCParams;
    public paymentFormParams: IPaymentFormCParams = {
        mode: this.$params?.mode,
    };
    public activeBonusesListParams: IFormWrapperCParams;
    public activeBonusesAlertParams: IAlertMessage;
    public availableSystems: number[] = [];
    public currentBonus: Bonus;
    public isWaitingResponse: boolean = false; // move to payment-form
    public hiddenPaymentInfo: boolean;
    public isLastMethodExisting: boolean;
    public isFetchingSystems: boolean = true;
    public walletsParams: IWrapperCParams;
    public selectedWallet: ISelectedWallet;
    public isMultiWallet: boolean = false;
    public ready: boolean = false;
    public useDepositPromoCode: boolean = false;
    public appliedPromoCode$: BehaviorSubject<Bonus> = new BehaviorSubject(null);
    public currentStep: Params.TMobileStep = 1;
    public amount: number;
    public verification: Params.IVerificationAlert = {};
    public userCountry: string;

    protected userService: UserService;
    protected bonusesService: BonusesService;
    protected alertInformation: TAlertList;
    protected useStepsTemplate: boolean;
    protected holdStep: boolean = false;
    protected isInitialized: boolean = false;
    protected depositBonuses: Bonus[];
    protected activeBonuses: Bonus[];
    protected bonusCurrency$: BehaviorSubject<string>;

    private static forceEnableAutoSelectPaySystem: boolean = false;
    private useScroll: boolean = false;
    private stepsOrder: Params.TStepTplName[] = [];
    private _isDeposit: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositWithdrawCParams,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected injectionService: InjectionService,
        protected actionService: ActionService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.originalTheme = this.$params.theme;
        if (this.$params.stepsParams || this.$params.type === 'modal') {
            const ignoreStepsBreakpoint: boolean = this.$params.type === 'modal';
            this.prepareStepsTemplate(ignoreStepsBreakpoint);
        }

        this._isDeposit = this.$params.mode === 'deposit';

        if (this.isDeposit && this.financesService.checkUserTags) {
            await firstValueFrom(this.financesService.isDepositBlocked$());
            this.initAfterTagsChecking();
            return;
        }

        this.init();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        if (!this.isDeposit) {
            this.userService.unsubscribeWSAvailableWithdraw();
        }

        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: null});
        }
    }

    public async onWalletChange(wallet: ISelectedWallet): Promise<void> {
        if (this.diffCurrencies(wallet)) {
            this.isFetchingSystems = true;
            this.bonusCurrency$?.next(wallet.walletCurrency);
            this.bonusesListParams = _assign({}, this.bonusesListParams);
            this.dropCurrentSystem();
            this.deleteStep(Params.PaymentSteps.cryptoInvoices);
            await this.financesService.fetchPaymentSystems(wallet.walletCurrency);

            if (this.currentSystem) {
                this.checkCurrentSystem();
            }

            setTimeout(() => {
                this.isFetchingSystems = false;
            }, 0);

            if (!this.isDeposit) {

                if (this.selectedWallet) {
                    this.userService.updateWSAvailableWithdraw(wallet.walletId.toString());
                } else {
                    this.userService.subscribeWSAvailableWithdraw(this.$destroy, wallet.walletId.toString());
                }
            }
        }

        this.selectedWallet = wallet;
    }

    public get isDeposit(): boolean {
        return this._isDeposit;
    }

    public get isDepositBlocked$(): Observable<boolean> {
        return this.financesService.isDepositBlocked$();
    }

    public get showDividerInPaymentSystems(): boolean {
        return !!this.parentSystem || !!this.currentSystem || !this.hiddenPaymentInfo;
    }

    public get paymentSystemName(): string {
        return this.isCryptoInvoices ? 'PayCryptos' : this.currentSystem?.name;
    }

    public get skipAutoSelectPaySystem(): boolean {
        return this.$params.theme === 'steps' && !DepositWithdrawComponent.forceEnableAutoSelectPaySystem;
    }

    public get themeMod(): Params.ThemeMod {
        return this.$params.themeMod;
    }

    public get activeBonusesExist(): boolean {
        return Bonus.existActiveBonus;
    }

    public get isExistBonusesListParams(): boolean {
        return !!this.bonusesListParams?.components;
    }

    public onPromoCodeChanged(bonus: Bonus): void {
        this.appliedPromoCode$.next(bonus);
        this.setCurrentBonus(bonus, false);
    }

    public stepBack(dropCurrentSystem: boolean = false): void {
        if (dropCurrentSystem) {
            this.currentSystem = null;
        }

        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    public stepForward(): void {
        this.currentStep++;
    }

    public saveAmount(amount: number): void {
        this.amount = amount;
    }

    public changeStep(step: Params.TMobileStep): void {
        this.currentStep = step;
        this.actionService.scrollTo('.wlc-app', {position: 'start'});
    }

    public getPromoCodeBonus(): Bonus {
        if (this.currentBonus && this.currentBonus.promoCode) {
            return this.currentBonus;
        }
    }

    public getPaymentFormPartialParams(showAdditional?: boolean): IPaymentFormCParams {
        let params: IPaymentFormCParams = _merge(this.paymentFormParams, {mode: this.$params.mode});

        if (showAdditional) {
            params = _merge(params, {type: 'partial-additional'});
        } else {
            params = _merge(params, {type: 'partial-amount'});
        }

        return params;
    }

    disableForceAutoSelection(): void {
        if (DepositWithdrawComponent.forceEnableAutoSelectPaySystem) {
            DepositWithdrawComponent.forceEnableAutoSelectPaySystem = false;
        }
    }

    protected prepareStepsTemplate(ignoreBp: boolean = false): void {
        if (ignoreBp) {
            this.updateStepsView(ignoreBp);
            this.updateStepsTplParams(ignoreBp);
        }
        else {
            const mq: MediaQueryList = this.window.matchMedia(this.$params.stepsParams.breakpoint);
            this.updateStepsView(mq.matches);
            this.updateStepsTplParams(mq.matches);

            GlobalHelper.mediaQueryObserver(mq)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {

                    if (event.matches) {
                        this.currentSystem = null;
                        this.currentStep = 1;
                    }

                    this.updateStepsView(event.matches);
                    this.updateStepsTplParams(event.matches);
                });
        }
    }

    protected updateStepsView(useSteps: boolean): void {
        this.useStepsTemplate = useSteps;
        this.$params.theme = this.useStepsTemplate ? 'steps' : this.originalTheme;
        this.clearModifiers();
    }

    protected updateStepsTplParams(isStepsView: boolean): void {
        let bonusesConfig: IBonusesListCParams = {};
        let paymentListConfig: IPaymentListCParams = {};
        let cryptoListConfig: IPaymentListCParams = this.$params.cryptoListParams;
        let paymentFormConfig: IPaymentFormCParams = {
            mode: this.$params.mode,
        };

        if (isStepsView) {
            bonusesConfig = this.$params.stepsParams.bonusesListParams;
            paymentListConfig = this.$params.stepsParams.paymentListParams;
            cryptoListConfig = this.$params.stepsParams.cryptoListParams;
            paymentFormConfig = this.$params.stepsParams.paymentFormParams;
        }

        this.cryptoListConfig = _merge(this.cryptoListConfig, cryptoListConfig);
        this.paymentFormParams = _merge(this.paymentFormParams, paymentFormConfig);
        this.listConfig = _merge(this.listConfig, paymentListConfig);
        this.bonusesListParams = this.getBonusesListConfig(bonusesConfig);
    }

    protected isProfileUpdated (type: string): boolean {
        return type !== MultiWalletEvents.CurrencyConversionChanged && type !== MultiWalletEvents.WalletChanged;
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
            (type: string): void => {

                if (this.isProfileUpdated(type)) {
                    this.onProfileUpdate();
                }
            },
            this.$destroy,
        );

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(
                filter((profile: UserProfile) => !!profile),
                takeUntil(this.$destroy))
            .subscribe((userProfile: UserProfile): void => {
                this.userCountry = userProfile.countryCode ?? '';

                if (this.$params.mode === 'withdraw') {
                    this.verification = {
                        showProfileLink: !userProfile.emailVerified,
                        showVerificationLink: userProfile.emailVerified
                            ? !!userProfile.verificationConditions.length
                            : userProfile.verificationConditions.length > 1,
                        conditions: userProfile.verificationConditions.join(', '),
                    };
                }
            });

        if (this.useBonuses) {
            this.eventService.subscribe([
                {name: BonusItemComponentEvents.deposit},
                {name: BonusItemComponentEvents.blank},
            ], (bonus?: Bonus): void => {
                this.setCurrentBonus(bonus, this.useDepositPromoCode);
            }, this.$destroy);
        }
    }

    /**
     * Set current bonus
     * @param {Bonus} [bonus] - selected bonus
     * @param {boolean} [checkPromoCode] - if true, overrides current bonus from $appliedPromoCode$
     */
    protected setCurrentBonus(bonus?: Bonus, checkPromoCode?: boolean): void {
        let currentBonus: Bonus = bonus;

        if (checkPromoCode) {
            const promoCodeBonus: Bonus = this.appliedPromoCode$.getValue();
            currentBonus = promoCodeBonus ? promoCodeBonus : bonus;
        }

        this.currentBonus = currentBonus;
        this.availableSystems = currentBonus?.paySystems || [];
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems(this.selectedWallet?.walletCurrency);
    }

    protected diffCurrencies(wallet: ISelectedWallet): boolean {
        return wallet.walletCurrency !== this.selectedWallet?.walletCurrency;
    }

    protected checkCurrentSystem(): void {
        if (!this.financesService.getSystemById(this.currentSystem.id)) {
            this.currentSystem = null;
        }
    }

    protected async onPaymentSystemChange(system: PaymentSystem): Promise<void> {
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: system});
        }

        if (!system) {
            this.dropCurrentSystem();
            return;
        }

        this.currentSystem = system;

        if (this.useStepsTemplate) {
            if (!this.holdStep) {
                this.changeStep(2);
            } else {
                this.holdStep = false;
            }
        }

        this.useScroll = !this.currentSystem.autoSelect &&
            this.configService.get<boolean>('$finances.paymentInfo.autoScroll');

        this.isCryptoInvoices = this.isDeposit
            && (this.currentSystem.cryptoInvoices || this.currentSystem.isParent);

        if (this.isCryptoInvoices) {

            if (this.currentSystem.isParent) {
                this.deleteStep(Params.PaymentSteps.paymentInfo);
                this.addStep(Params.PaymentSteps.cryptoInvoices);

                if (this.useScroll) {
                    this.actionService.scrollTo(`.${this.$params.class}__cryptoInvoiceSystems`,
                        {position: 'center'});
                }
            } else {
                this.addStep(Params.PaymentSteps.paymentInfo);
                if (this.useScroll) {
                    this.actionService.scrollTo(`.${this.$params.class}__paymentInfo`,
                        {position: 'center'});
                }
            }
        } else {
            this.deleteStep(Params.PaymentSteps.cryptoInvoices);
            this.addStep(Params.PaymentSteps.paymentInfo);
            if (this.useScroll) {
                this.actionService.scrollTo(`.${this.$params.class}__paymentInfo`,
                    {position: 'center'});
            }
        }

        this.isWaitingResponse = false;
    }

    protected dropCurrentSystem(): void {
        if (this.parentSystem && !this.currentSystem) {
            this.parentSystem = null;
            this.deleteStep(Params.PaymentSteps.cryptoInvoices);
            this.addStep(Params.PaymentSteps.paymentInfo);
        } else if (this.parentSystem && this.currentSystem?.cryptoInvoices) {
            this.deleteStep(Params.PaymentSteps.paymentInfo);
        }

        this.cdr.markForCheck();
    }

    protected async init(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        if (this.$params.stepsOrder && this.$params.theme !== 'second') {
            this.prepareStepsOrdering();
        }

        this.cryptoListConfig = Object.assign({}, this.cryptoListConfig, this.$params.cryptoListParams);
        this.hiddenPaymentInfo = this.configService.get<boolean>('$finances.paymentInfo.hiddenPaymentInfo');
        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.showBonuses = this.useBonuses && this.isDeposit;
        this.alertInformation = this.configService.get<TAlertList>(`$finances.alerts.${this.$params.mode}`);
        this.useDepositPromoCode = this.isDeposit && this.configService.get<boolean>('$finances.useDepositPromoCode');

        this.isLastMethodExisting = (this.isDeposit
                && this.configService.get<boolean>('$finances.lastSucceedDepositMethod.use'))
            || (!this.isDeposit && this.configService.get<boolean>('$finances.lastSucceedWithdrawMethod.use'));

        if (this.$params.theme === 'steps' && this.isLastMethodExisting) {
            DepositWithdrawComponent.forceEnableAutoSelectPaySystem = true;
        }

        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

        if (this.isMultiWallet) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
            Params.PaymentSteps.wallet.ready = new Promise((resolve: () => void): void => {
                Params.PaymentSteps.wallet.$resolve = resolve;
            });
            this.addStep(Params.PaymentSteps.wallet, true);

            if (this.userService.userInfo) {
                Params.PaymentSteps.wallet.$resolve();
            } else {
                this.userService.userInfo$.pipe(
                    first((v) => !!v?.idUser),
                    takeUntil(this.$destroy),
                ).subscribe((): void => {
                    Params.PaymentSteps.wallet.$resolve();
                });
            }

            this.walletsParams = {
                components: [
                    {
                        name: 'multi-wallet.wlc-wallets',
                        params: <WalletsParams>{
                            themeMod: 'finances',
                            isWithdrawal: !this.isDeposit,
                            onWalletChange: this.onWalletChange.bind(this),
                        },
                    },
                ],
            };
        }

        if (this.showBonuses) {
            Params.PaymentSteps.bonus.ready = new Promise((resolve: () => void): void => {
                Params.PaymentSteps.bonus.$resolve = resolve;
            });

            this.addStep(Params.PaymentSteps.bonus);

            this.eventService.subscribe({name: 'BONUSES_FETCH_FAILED'}, (): void => {
                Params.PaymentSteps.bonus.$resolve();
                this.deleteStep(Params.PaymentSteps.bonus);
            }, this.$destroy);

            this.bonusesService ??= await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');

            this.bonusesService.getActionSubscribe({
                observer: (actionEvent: IBonusActionEvent): void => {
                    this.processBonuses(actionEvent).finally((): void => {
                        if (this.ready) {
                            this.cdr.markForCheck();
                        } else {
                            Params.PaymentSteps.bonus.$resolve();
                        }
                    });
                },
                executeObserverOnStart: true,
                until: this.$destroy,
            });

            if (this.isMultiWallet) {
                this.bonusCurrency$ = new BehaviorSubject<string>(this.userService.userProfile.originalCurrency);
            }
        }

        if (!this.isMultiWallet) {
            Params.PaymentSteps.paymentSystem.ready = new Promise((resolve: () => void): void => {
                Params.PaymentSteps.paymentSystem.$resolve = resolve;
            });
        }

        this.addStep(Params.PaymentSteps.paymentSystem);
        if (!this.hiddenPaymentInfo) {
            this.addStep(Params.PaymentSteps.paymentInfo);
        }

        this.initSubscribers();

        if (this.isLastMethodExisting) {
            this.lastSucceedPaymentMethod = this.financesService.getLastSucceedPaymentMethod(this.isDeposit);
        }

        if (!this.isDeposit) {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';

            this.userService ??= await this.injectionService.getService<UserService>('user.user-service');

            if (!this.isMultiWallet) {
                this.userService.subscribeWSAvailableWithdraw(this.$destroy);
            }

        } else {
            this.eventService.emit({name: 'DEPOSIT_VISIT'});
        }

        if (!this.isMultiWallet) {
            this.financesService.fetchPaymentSystems()
                .finally(() => {
                    this.isFetchingSystems = false;
                    Params.PaymentSteps.paymentSystem.$resolve();
                });
        }

        Promise.all(Array.from(this.steps).map(async (step: Params.IPaymentStep) => await step.ready))
            .then(() => {
                this.ready = true;
                this.cdr.markForCheck();
            });

        this.isInitialized = true;
    }

    protected initAfterTagsChecking(): void {
        this.financesService.isDepositBlocked$().pipe(
            distinctUntilChanged(),
            takeUntil(this.$destroy),
        ).subscribe((isBlocked: boolean): void => {
            if (isBlocked) {
                this.ready = true;
                this.cdr.markForCheck();
            } else {
                this.init();
            }
        });
    }

    protected async processBonuses(actionEvent: IBonusActionEvent): Promise<void> {
        const {actionType, bonusId} = actionEvent;

        const isExistingActiveBonus: boolean = this.activeBonuses?.some((b: Bonus): boolean => b.id === bonusId);
        const isExistingDepositBonus: boolean = this.depositBonuses?.some((b: Bonus): boolean => b.id === bonusId);
        const isNewActiveBonus: boolean = actionType === ActionTypeEnum.Activate && !isExistingActiveBonus;
        const isInitialization: boolean = actionType === ActionTypeEnum.Empty;

        if (isInitialization || isNewActiveBonus || isExistingActiveBonus || isExistingDepositBonus) {
            this.userService ??= await this.injectionService.getService<UserService>('user.user-service');
            const userInfo: UserInfo = await firstValueFrom(this.userService.userInfo$.pipe(
                first((v: UserInfo) => !!v?.loyalty?.DepositsCount),
                takeUntil(this.$destroy),
            ));

            const depositCount: number = userInfo?.depositsCount ?? 0;
            const depEvents: TBonusEvent[] = depositCount > 0
                ? Bonus.depEvents.filter(
                    (event: TBonusEvent): boolean => event !== 'deposit first',
                ) : Bonus.depEvents;

            this.depositBonuses = await this.bonusesService.queryBonusesByFilter({
                queryFilters: {
                    event: depEvents.join(','),
                },
                localFilter: 'deposit',
                currency$: this.bonusCurrency$,
            });

            if (this.depositBonuses.length) {
                this.activeBonuses = await this.bonusesService.queryBonusesByFilter({
                    queryFilters: {
                        type: 'active',
                    },
                    localFilter: 'active',
                    currency$: this.bonusCurrency$,
                });

                if (this.activeBonuses.length) {
                    this.activeBonusesListParams = this.getActiveBonusesListConfig(this.activeBonuses);
                    this.activeBonusesAlertParams = this.getActiveBonusesAlertParams(this.activeBonuses);
                } else {
                    this.activeBonusesListParams = null;
                    this.activeBonusesAlertParams = null;
                }

                this.bonusesListParams = this.getBonusesListConfig({
                    ...(this.bonusesListParams?.components?.[0]?.params ?? {}),
                    bonuses: this.depositBonuses,
                    disableBonuses$: this.appliedPromoCode$,
                });
            } else {
                this.deleteStep(Params.PaymentSteps.bonus);
                this.showBonuses = false;
            }
        }
    }

    protected getBonusesListConfig(params?: IBonusesListCParams): IFormWrapperCParams {
        return {
            components: [
                {
                    name: 'bonuses.wlc-deposit-bonuses',
                    params: {
                        ...(params ?? {}),
                        disableBonuses$: this.appliedPromoCode$,
                    },
                },
            ],
        };
    }

    protected getActiveBonusesListConfig(activeBonuses: Bonus[]): IFormWrapperCParams {
        return {
            components: activeBonuses.map((activeBonus: Bonus) => {
                return {
                    name: 'bonuses.wlc-bonus-item',
                    params: {
                        theme: 'name-only',
                        bonus: activeBonus,
                    },
                };
            }),
        };
    }

    protected getActiveBonusesAlertParams(activeBonuses: Bonus[]): IAlertMessage | null {
        let alertParams: IAlertMessage = null;
        const isNonCancelable: boolean = activeBonuses.some((bonus: Bonus): boolean => bonus.disableCancel);

        if (isNonCancelable && this.showAlert('activeBonusNonCancelable')) {
            alertParams = this.alertInformation['activeBonusNonCancelable'];
        } else if (this.showAlert('activeBonusNotStackable')) {
            alertParams = this.alertInformation['activeBonusNotStackable'];
        }

        return alertParams;
    }

    private prepareStepsOrdering(): void {
        this.stepsOrder.push('wallets', ...(_uniq(this.$params.stepsOrder)));

        const availableSteps: Params.IPaymentStep[] = Object.values(Params.PaymentSteps);
        if (this.stepsOrder.length < availableSteps.length) {
            _each(availableSteps, ({template}): void => {
                if (_indexOf(this.stepsOrder, template) < 0) {
                    this.stepsOrder.push(template);
                }
            });
        }
    }

    private findStepByTpl(tpl: Params.TStepTplName): Params.IPaymentStep {
        return _find(this.steps, ({template}):boolean => template === tpl);
    }

    /**
     * @param step
     * @param prepend - insert step at the start of steps array (used for wallets)
     */
    private addStep(step: Params.IPaymentStep, prepend?: boolean): void {
        if (this.findStepByTpl(step.template)) {
            return;
        }

        if (prepend) {
            this.steps.unshift(step);
        } else {
            this.steps.push(step);
        }

        if (this.steps.length > 1 && !prepend) {
            this.sortSteps();
        }
    }

    private deleteStep(step: Params.IPaymentStep): void {
        _remove(this.steps, (current: Params.IPaymentStep): boolean => current.template === step.template);
    }

    private sortSteps(): void {
        const steps: Params.IPaymentStep[] = [];

        _each(this.stepsOrder, (stepTpl: Params.TStepTplName): void => {
            const step: Params.IPaymentStep = this.findStepByTpl(stepTpl);
            if (step) {
                steps.push(step);
            }
        });

        this.steps = steps;
    }

    protected showAlert(step: TShowMode): boolean {
        return !!this.alertInformation && !!this.alertInformation[step];
    }
}
