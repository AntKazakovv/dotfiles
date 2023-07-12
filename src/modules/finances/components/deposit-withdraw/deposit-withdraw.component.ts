import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _merge from 'lodash-es/merge';
import _map from 'lodash-es/map';

import {
    IMixedParams,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    InjectionService,
    ActionService,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';

import {
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    Bonus,
    BonusesService,
    BonusItemComponentEvents,
} from 'wlc-engine/modules/bonuses';

import {
    ISelectedWallet,
    WalletsService,
} from 'wlc-engine/modules/multi-wallet';
import {WalletsParams} from 'wlc-engine/modules/multi-wallet/components/wallets/wallets.params';

import * as Params from './deposit-withdraw.params';

@Component({
    selector: '[wlc-deposit-withdraw]',
    templateUrl: './deposit-withdraw.component.html',
    styleUrls: ['./styles/deposit-withdraw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositWithdrawComponent
    extends AbstractComponent
    implements OnInit, OnDestroy {
    public override $params: Params.IDepositWithdrawCParams;
    public currentSystem: PaymentSystem;
    public title: string = gettext('Deposit');
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

    public parentSystem: PaymentSystem = null;
    /** Defines if crypto invoice payment chosen */
    public isCryptoInvoices: boolean = false;

    public steps: Set<Params.IPaymentStep> = new Set();

    public useBonuses: boolean = false;
    public showBonuses: boolean = false;
    public bonusesListParams: IFormWrapperCParams;
    public availableSystems: number[] = [];
    public currentBonus: Bonus;
    public isWaitingResponse: boolean = false; // move to payment-form
    public hiddenPaymentInfo: boolean;
    public isLastMethodExisting: boolean;
    public isFetchingSystems: boolean = true;
    public walletsParams: WalletsParams;
    public selectedWallet: ISelectedWallet;
    public isMultiWallet: boolean = false;
    public ready: boolean = false;
    public bonusesExist: boolean = false;
    protected userService: UserService;

    private userProfile: UserProfile;
    private isDeposit: boolean;
    private useScroll: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDepositWithdrawCParams,
        configService: ConfigService,
        protected financesService: FinancesService,
        protected eventService: EventService,
        cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected httpClient: HttpClient,
        protected injectionService: InjectionService,
        protected actionService: ActionService,
        protected walletsService: WalletsService,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IDepositWithdrawCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.hiddenPaymentInfo = this.configService.get<boolean>('$finances.paymentInfo.hiddenPaymentInfo');
        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.isDeposit = this.$params.mode === 'deposit';
        this.showBonuses = this.useBonuses && this.isDeposit;

        this.isLastMethodExisting = (this.isDeposit
                && this.configService.get<boolean>('$finances.lastSucceedDepositMethod.use'))
            || (!this.isDeposit && this.configService.get<boolean>('$finances.lastSucceedWithdrawMethod.use'));

        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

        if (this.isMultiWallet) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');

            Params.PaymentSteps.wallet.ready = new Promise((resolve: () => void): void => {
                Params.PaymentSteps.wallet.$resolve = resolve;
            });
            const walletInit = (): void => {
                this.selectedWallet = this.userService.userProfile.extProfile.currentWallet;
                Bonus.depositCurrency = this.selectedWallet?.walletCurrency;
                Params.PaymentSteps.wallet.$resolve();
            };

            if (this.userService.userInfo) {
                walletInit();
            } else {
                this.userService.userInfo$.pipe(
                    first((v) => !!v?.idUser),
                    takeUntil(this.$destroy))
                    .subscribe((): void => {
                        walletInit();
                    });
            }

            this.steps.add(Params.PaymentSteps.wallet);
            this.walletsParams = {
                themeMod: 'finances',
                hideVirtualWallets: !this.isDeposit,
            };
        }

        if (this.showBonuses) {

            Params.PaymentSteps.bonus.ready = new Promise((resolve: () => void): void => {
                Params.PaymentSteps.bonus.$resolve = resolve;
            });

            this.steps.add(Params.PaymentSteps.bonus);

            this.eventService.subscribe({name: 'BONUSES_FETCH_FAILED'}, (): void => {
                Params.PaymentSteps.bonus.$resolve();
                this.steps.delete(Params.PaymentSteps.bonus);
            });

            const bonusesService = await this.injectionService
                .getService<BonusesService>('bonuses.bonuses-service');
            const bonusesSubscription = bonusesService.getSubscribe({
                type: 'any',
                useQuery: true,
                observer: {
                    next: (bonuses: Bonus[]): void => {
                        const depositBonuses = bonusesService.filterBonuses(bonuses, 'deposit');
                        this.bonusesExist = !!depositBonuses.length;

                        if (this.bonusesExist) {

                            this.bonusesListParams = {
                                components: [
                                    {
                                        name: 'bonuses.wlc-deposit-bonuses',
                                        params: {
                                            bonuses: depositBonuses,
                                        },
                                    },
                                ],
                            };
                        }
                        Params.PaymentSteps.bonus.$resolve();
                        bonusesSubscription.unsubscribe();
                    },
                },
            });
        }

        /** Готовим параметры (пока только для второй темы) */
        this.prepareParams();

        Params.PaymentSteps.paymentSystem.ready = new Promise((resolve: () => void): void => {
            Params.PaymentSteps.paymentSystem.$resolve = resolve;
        });

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

        if (this.isLastMethodExisting) {
            this.lastSucceedPaymentMethod = this.financesService.getLastSucceedPaymentMethod(this.isDeposit);
        }

        if (!this.isDeposit) {
            this.title = gettext('Withdrawal');
            this.listConfig.paymentType = 'withdraw';

            this.userService ??= await this.injectionService.getService<UserService>('user.user-service');

        }

        Promise.all(_map(Array.from(this.steps), async (step: Params.IPaymentStep) => await step.ready))
            .then(() => {
                this.ready = true;
                this.cdr.markForCheck();
            });

        if (this.isMultiWallet) {
            await Params.PaymentSteps.wallet.ready;
        }
        this.financesService.fetchPaymentSystems(this.selectedWallet?.walletCurrency)
            .finally(() => {
                this.isFetchingSystems = false;
                Params.PaymentSteps.paymentSystem.$resolve();
            });
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.useBonuses) {
            this.configService.set({name: 'chosenPaySystem', value: null});
            Bonus.depositCurrency = null;
        }
    }

    public async onWalletChange(wallet: ISelectedWallet): Promise<void> {
        this.isFetchingSystems = true;
        Bonus.depositCurrency = wallet.walletCurrency;
        this.bonusesListParams = _assign({}, this.bonusesListParams);

        this.selectedWallet = wallet;
        this.dropCurrentSystem();
        await this.financesService.fetchPaymentSystems(wallet.walletCurrency);

        if (this.currentSystem) {
            this.checkCurrentSystem();
        }

        setTimeout(() => {
            this.isFetchingSystems = false;
        }, 0);
    }

    public get showDividerInPaymentSystems(): boolean {
        return !!this.parentSystem || !!this.currentSystem || !this.hiddenPaymentInfo;
    }

    private prepareParams(): void {
        this.cryptoListConfig = _merge(this.cryptoListConfig, this.$params.cryptoListParams);
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
            }, this.$destroy);
        }
    }

    protected onProfileUpdate(): void {
        this.financesService.fetchPaymentSystems(this.selectedWallet?.walletCurrency);
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

        this.useScroll = !this.currentSystem.autoSelect &&
            this.configService.get<boolean>('$finances.paymentInfo.autoScroll');

        this.isCryptoInvoices = this.isDeposit
            && (this.currentSystem.cryptoInvoices || this.currentSystem.isParent);

        if (this.isCryptoInvoices) {

            if (this.currentSystem.isParent) {
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
        } else {
            this.steps.delete(Params.PaymentSteps.cryptoInvoices);
            this.steps.add(Params.PaymentSteps.paymentInfo);
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
            this.steps.delete(Params.PaymentSteps.cryptoInvoices);
            this.steps.add(Params.PaymentSteps.paymentInfo);
        } else if (this.parentSystem && this.currentSystem?.cryptoInvoices) {
            this.steps.delete(Params.PaymentSteps.paymentInfo);
        }

        this.cdr.markForCheck();
    }

    protected get userCountry(): string {
        return this.userProfile?.countryCode || '';
    }
}
