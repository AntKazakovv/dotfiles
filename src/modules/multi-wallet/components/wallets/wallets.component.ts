import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';

import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';
import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

import {
    first,
    takeUntil,
} from 'rxjs/operators';
import {
    filter,
    interval,
} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    GlobalHelper,
    ICurrency,
    IIndexing,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';

import {
    IWallet,
    IWalletObj,
    ISelectedWallet,
    IWalletsSettings,
    ICurrencyFilter,
    MultiWalletEvents,
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet/system/helpers/wallet.helper';
import {ISettingsParams} from 'wlc-engine/modules/multi-wallet/components/settings/settings.params';
import {IFiltersParams} from 'wlc-engine/modules/multi-wallet/components/filters/filters.params';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';

import * as Params from './wallets.params';

@Component({
    selector: '[wlc-wallets]',
    templateUrl: './wallets.component.html',
    styleUrls: ['./styles/wallets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.WalletsParams;
    @Output() public changeWalletEmit: EventEmitter<ISelectedWallet> = new EventEmitter();
    @Output() public currentWalletEmit: EventEmitter<ISelectedWallet> = new EventEmitter();

    public override $params: Params.WalletsParams;

    public isShowWalletSelector: boolean = false;
    public isOpened: boolean = false;
    public isShowNotFound: boolean = false;
    public walletList: IWallet[];
    public currentWallet: IWallet;
    public isFinance: boolean;
    public settingsParams: ISettingsParams = {
        currencies: [],
        walletSettings: null,
    };
    public filtersParams: IFiltersParams = {
        currencies: [],
    };
    public walletListRead: boolean = false;
    public balance: string = '';
    public walletCurrency: string = '';
    private searchQuery: string = '';
    private userService: UserService;

    private changeConversionCoefficientReady: Promise<void>;
    private $coefficientResolve: () => void;

    private createWalletListReady: Promise<void>;
    private $createWalletListResolve: () => void;

    private ratesService: RatesCurrencyService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.WalletsParams,
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
        private eventService: EventService,
        private injectionService: InjectionService,
        private modalService: ModalService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.isFinance = this.$params.themeMod === 'finances';
        if (this.$params.themeMod) {
            this.addModifiers(this.$params.themeMod);
        }
        this.userService = await this.injectionService.getService<UserService>('user.user-service');
        this.ratesService =
            await this.injectionService.getService<RatesCurrencyService>('rates.rates-currency-service');

        await this.initWalletSelector();

        this.eventService.subscribe(
            {name: 'CLOSE_MODAL'},
            (modalId: string): void => {
                if (modalId === 'wallet-filters') {
                    this.userService.updateProfile(
                        {extProfile: {unusedCurrencies: WalletHelper.currencies}},
                        {updatePartial: true},
                    );
                }
            },
            this.$destroy,
        );
    }

    public get displayedBalance(): string {
        return this.isConvert() ? (_toNumber(this.currentWallet.balance) * WalletHelper.coefficientСonversion)
            .toFixed(2) : <string>this.currentWallet.balance;
    }

    public get displayedCurrency(): string {
        return this.isConvert()
            ? this.settingsParams.walletSettings?.currency : this.currentWallet.currency;
    }

    public async onChangingWallet(item: IWallet): Promise<void> {
        this.currentWallet = WalletHelper.createCurrentWallet(
            this.userService.userInfo.wallets,
            item.currency,
        );
        this.isOpened = false;

        if (this.settingsParams.walletSettings.conversionInFiat) {
            await this.updateConversionCoefficient();
        }

        this.walletCurrency = this.displayedCurrency;
        this.balance = this.displayedBalance;

        this.changeWalletEmit.emit({
            walletCurrency: this.currentWallet.currency,
            walletId: this.currentWallet.walletId ?? null,
        });
        this.cdr.markForCheck();

        if (this.isFinance) return;

        const userProfile: UserProfile = this.userService.userProfile;
        UserInfo.currency = item.currency;
        this.userService.userInfo$.next(this.userService.userInfo);

        userProfile.extProfile.currentWallet = {
            walletCurrency: this.currentWallet.currency,
            walletId: this.currentWallet.walletId,
        };

        this.userService.userProfile$.next(userProfile);
        await this.userService.updateProfile({extProfile: userProfile.extProfile}, {updatePartial: true});
        this.eventService.emit({name: MultiWalletEvents.WalletChanged});
    }

    public onOpen(): void {
        this.walletListRead = false;
        this.cdr.markForCheck();
        this.searchQuery = '';
        this.isShowNotFound = false;
        this.isOpened = !this.isOpened;
        if (this.isOpened) {
            this.filterWallets();
        }
    }

    public getCurrencyIconUrl(currency: string): string {
        const path: string = `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
        return GlobalHelper.proxyUrl(path);
    }

    public async setSearchQuery($event: string): Promise<void> {
        this.searchQuery = $event;
        await this.filterWallets();
        this.isShowNotFound = $event && !this.walletList.length;
        this.cdr.markForCheck();
    }

    public clickOutside(): void {
        this.isOpened = false;
    }

    public showSettingsModal(): void {
        this.modalService.showModal({
            id: 'wallet-settings',
            modalTitle: this.$params.settingsText,
            modifier: 'info',
            componentName: 'multi-wallet.wlc-settings',
            componentParams: this.settingsParams,
            showConfirmBtn: true,
            confirmBtnText: gettext('Ok'),
            rejectBtnVisibility: false,
            textAlign: 'center',
            dismissAll: true,
            onConfirm: async (): Promise<void> => this.changeSettings(),
        });
    }

    public async showFiltersModal(): Promise<void> {
        await this.createWalletListReady;
        this.modalService.showModal({
            id: 'wallet-filters',
            modalTitle: this.$params.filterText,
            modifier: 'info',
            componentName: 'multi-wallet.wlc-filters',
            componentParams: this.filtersParams,
            confirmBtnText: gettext('Ok'),
            rejectBtnVisibility: false,
            textAlign: 'center',
            showConfirmBtn: false,
            dismissAll: true,
        });
    }

    public async changeSettings(): Promise<void> {
        this.changeConversionCoefficientReady = new Promise((resolve: () => void): void => {
            this.$coefficientResolve = resolve;
        });

        await this.updateConversionCoefficient(WalletHelper.walletSettings);
        this.settingsParams.walletSettings = WalletHelper.walletSettings;
        this.$coefficientResolve();
        this.isShowNotFound = this.searchQuery && !this.walletList.length;
        this.cdr.markForCheck();
    }

    private async initWalletSelector(): Promise<void> {
        this.userService.userInfo$.pipe(
            first((v) => !!v?.idUser),
            takeUntil(this.$destroy))
            .subscribe(async (userInfo: UserInfo): Promise<void> => {

                this.currentWallet =
                    WalletHelper.createCurrentWallet(
                        userInfo.wallets,
                        this.userService.userProfile.selectedCurrency,
                    );

                if (this.userService.userProfile.extProfile.conversionCurrency) {
                    this.settingsParams.walletSettings = this.userService.userProfile.extProfile.conversionCurrency;
                } else {
                    this.settingsParams.walletSettings = {
                        hideWalletsWithZeroBalance: false,
                        conversionInFiat: false,
                        currency: null,
                    };
                }

                WalletHelper.conversionCurrency = this.settingsParams.walletSettings.currency;
                WalletHelper.currencies = this.userService.userProfile.unusedCurrencies;
                await this.updateConversionCoefficient();

                if (!this.currentWallet?.walletId && this.$params.hideWalletsWithZeroBalance) {
                    await this.filterWallets();
                    this.currentWallet = this.walletList[0];
                }
                UserInfo.currency = this.userService.userProfile.selectedCurrency;

                this.isShowWalletSelector = true;
                this.walletCurrency = this.displayedCurrency;
                this.currentWalletEmit.emit({
                    walletCurrency: this.currentWallet.currency,
                    walletId: this.currentWallet.walletId ?? null,
                });
                this.cdr.markForCheck();

                const hour: number = 1000 * 60 * 60;

                interval(hour)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((): void => {
                        this.updateConversionCoefficient();
                    });
            });

        this.userService.userInfo$.pipe(
            filter(v => !!v?.idUser),
            takeUntil(this.$destroy))
            .subscribe((userInfo: UserInfo) => {
                this.currentWallet.balance = userInfo.getWalletBalance(this.currentWallet.currency)
                    .toFixed(2);
                this.walletCurrency = this.displayedCurrency;
                this.balance = this.displayedBalance;
                this.cdr.detectChanges();
            });
    }

    private async createWalletsArray(): Promise<void> {
        this.createWalletListReady = new Promise((resolve: () => void): void => {
            this.$createWalletListResolve = resolve;
        });
        this.settingsParams.currencies = [];
        this.filtersParams.currencies = [];
        this.walletList = [];
        const wallets: IWalletObj = _assign({}, this.userService.userInfo.wallets);
        const currencies: IIndexing<ICurrency> = this.configService.get('appConfig.siteconfig.currencies');

        for (const index in currencies) {
            const currency: string = currencies[index].Name;

            let wallet: IWallet = _assign({}, wallets[currency]);

            if (wallet.balance) {

                if (this.changeConversionCoefficientReady) {
                    await this.changeConversionCoefficientReady;
                }

                if (this.isConvert(currency)) {

                    const coefficient: number = await this.ratesService.getRate({
                        currencyFrom: currency,
                        currencyTo: this.settingsParams.walletSettings.currency,
                    });
                    wallet.balance = (coefficient * _toNumber(wallet.balance)).toFixed(2);
                }

            } else if (!this.$params.hideWalletsWithZeroBalance) {
                wallets[currency] = {
                    currency: currency,
                    balance: '0.00',
                };
                wallet = wallets[currency];
            } else return;

            const currentCurrencyUnused: ICurrencyFilter = WalletHelper.currencies
                ?.find((item: ICurrencyFilter) => item.code === currency);

            if (wallet && !currentCurrencyUnused) {
                this.walletList.push(wallet);
            }

            if (currency !== this.currentWallet.currency) {
                if (currentCurrencyUnused) {
                    this.filtersParams.currencies.push(currentCurrencyUnused);
                } else {
                    this.filtersParams.currencies.push({
                        name: wallet.currency,
                        code: wallet.currency,
                        isUsed: true,
                    } as ICurrencyFilter);
                }
            }

            if (!currencies[index].IsCryptoCurrency) {
                this.settingsParams.currencies.push(currency);
            }
        }
        this.$createWalletListResolve();
    }

    private async filterWallets(): Promise<void> {
        await this.createWalletsArray();
        const searchCondition = (currency: IWallet): boolean =>
            currency.currency.toLowerCase().includes(this.searchQuery.toLowerCase());
        const zeroBalanceCondition: boolean =
            (this.settingsParams.walletSettings?.hideWalletsWithZeroBalance && !this.searchQuery.length)
            || this.$params.hideWalletsWithZeroBalance;

        this.walletList = zeroBalanceCondition
            ? this.sortWallets(
                _filter(this.walletList, (currency: IWallet) => searchCondition(currency)
                    && (currency.currency === this.currentWallet.currency || currency.balance !== '0.00'),
                ),
            ) : this.sortWallets(_filter(this.walletList, (currency: IWallet) => searchCondition(currency)));
        this.walletListRead = true;
        this.cdr.markForCheck();
    }

    private sortWallets(wallets: IWallet[]): IWallet[] {
        return _orderBy(
            wallets,
            ['isReal', 'walletId', 'currency'], ['desc', 'asc'],
        ).sort((currency: IWallet) => currency.currency === this.currentWallet.currency ? -1 : 1);
    }

    private async updateConversionCoefficient(
        settings: IWalletsSettings = this.settingsParams.walletSettings,
    ): Promise<void> {
        WalletHelper.rates = {};

        if (settings.conversionInFiat) {
            WalletHelper.conversionCurrency = settings.currency;
            WalletHelper.coefficientСonversion = await this.ratesService.getRate({
                currencyFrom: this.currentWallet.currency,
                currencyTo: settings.currency,
            });

            WalletHelper.coefficientOriginalCurrencyСonversion = WalletHelper.coefficientСonversion;

            if (this.currentWallet.currency !== this.userService.userProfile.originalCurrency) {
                WalletHelper.coefficientOriginalCurrencyСonversion = await this.ratesService.getRate({
                    currencyFrom: this.userService.userProfile.originalCurrency,
                    currencyTo: settings.currency,
                });
            }

        } else {
            WalletHelper.coefficientСonversion = 1;
            WalletHelper.coefficientOriginalCurrencyСonversion = 1;
            WalletHelper.coefficientСonversionEUR = 1;
            WalletHelper.conversionCurrency = null;
        }

        await this.userService.updateProfile(
            {extProfile: {conversionCurrency: settings}},
            {updatePartial: true},
        );

        this.userService.userInfo$.next(this.userService.userInfo);

        this.eventService.emit({name: MultiWalletEvents.CurrencyConversionChanged});
    }

    private isConvert(currency: string = this.currentWallet.currency): boolean {
        return !this.isFinance && this.settingsParams.walletSettings?.conversionInFiat
            && currency !== this.settingsParams.walletSettings?.currency;
    }
}
