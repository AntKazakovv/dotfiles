import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import _filter from 'lodash-es/filter';
import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _find from 'lodash-es/find';
import _sortBy from 'lodash-es/sortBy';
import _orderBy from 'lodash-es/orderBy';

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
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';
import {ICurrency} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

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
import {TUpdateProfileRes} from 'wlc-engine/modules/user/system/services/user/user.service';

import * as Params from './wallets.params';

@Component({
    selector: '[wlc-wallets]',
    templateUrl: './wallets.component.html',
    styleUrls: ['./styles/wallets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.WalletsParams;

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
    public hideSettings: boolean;

    protected readonly walletHelper = WalletHelper;

    private searchQuery: string = '';
    private userService: UserService;
    private currencyService: CurrencyService;
    private changeConversionCoefficientReady: Promise<void>;
    private $coefficientResolve: () => void;

    private createWalletListReady: Promise<void>;
    private $createWalletListResolve: () => void;

    private ratesService: RatesCurrencyService;
    private currencies: ICurrency<string>[];

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
        this.hideSettings = this.configService.get<boolean>('$base.multiWallet.hideSettings');
        this.isFinance = this.$params.themeMod === 'finances';

        if (this.$params.themeMod) {
            this.addModifiers(this.$params.themeMod);
        }

        if (this.hideSettings) {
            this.addModifiers('hide-settings');
        }
        this.userService = await this.injectionService.getService<UserService>('user.user-service');
        this.ratesService =
            await this.injectionService.getService<RatesCurrencyService>('rates.rates-currency-service');

        UserInfo.currency = this.userService.userProfile.selectedCurrency;
        this.currencyService =
            await this.injectionService.getService<CurrencyService>('currency.currency-service');

        if (this.userService.userInfo) {
            this.initSelector();
        } else {
            this.userService.userInfo$.pipe(
                first((v) => !!v?.idUser),
                takeUntil(this.$destroy))
                .subscribe((): void => {
                    this.initSelector();
                });
        }

        this.userService.userInfo$.pipe(
            filter(v => !!v?.idUser),
            takeUntil(this.$destroy))
            .subscribe((userInfo: UserInfo) => {

                if (this.currentWallet) {
                    this.currentWallet.balance = userInfo.getWalletBalance(this.currentWallet.currency)
                        .toFixed(2);
                    this.walletCurrency = this.displayedCurrency;
                    this.balance = this.displayedBalance;
                }
                this.cdr.detectChanges();
            });
        this.eventService.subscribe({name: 'LOGOUT'}, (): void => {
            WalletHelper.conversionReset();
        });
        this.eventService.subscribe([
            {name: MultiWalletEvents.CreateWallet},
        ], async (wallet: ISelectedWallet): Promise<void> => {

            if (wallet.walletCurrency === this.currentWallet.currency) {
                this.walletChangeCallback(wallet);
                this.currentWallet.walletId = wallet.walletId;
            }

        }, this.$destroy);
    }

    public get displayedBalance(): string {
        return this.isConvert() ? (_toNumber(this.currentWallet.balance) * WalletHelper.coefficientConversion)
            .toFixed(2) : <string>this.currentWallet.balance;
    }

    public get displayedCurrency(): string {
        return this.isConvert()
            ? this.settingsParams.walletSettings?.currency : this.currentWallet.currency;
    }

    public get showSettings(): boolean {
        return !this.isFinance && this.walletListRead && !this.hideSettings;
    }

    public get wlcCurrency(): string {
        return this.settingsParams?.walletSettings.conversionInFiat && !this.isFinance ? this.walletCurrency : null;
    }

    public async onChangingWallet(item: IWallet): Promise<void> {
        this.currentWallet = WalletHelper.createCurrentWallet(
            this.userService.userInfo.wallets,
            item.currency,
            item.displayName,
        );
        this.isOpened = false;

        if (this.settingsParams.walletSettings.conversionInFiat && !this.isFinance) {
            await this.updateConversionCoefficient();
        }

        this.walletCurrency = this.displayedCurrency;
        this.balance = this.displayedBalance;
        this.walletChangeCallback({
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
            this.createWalletList();
        }
    }

    public async setSearchQuery($event: string): Promise<void> {
        this.searchQuery = $event;
        await this.createWalletList();
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
            confirmBtnText: gettext('Save'),
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
            confirmBtnText: gettext('OK'),
            rejectBtnVisibility: false,
            textAlign: 'center',
            showConfirmBtn: false,
            dismissAll: true,
            onModalHide: () => this.userService.updateProfile(
                {extProfile: {unusedCurrencies: WalletHelper.currencies}},
                {updatePartial: true},
            ),
        });
    }

    public async changeSettings(): Promise<void> {
        this.changeConversionCoefficientReady = new Promise((resolve: () => void): void => {
            this.$coefficientResolve = resolve;
        });

        await this.updateConversionCoefficient(WalletHelper.walletSettings);
        this.settingsParams.walletSettings = _assign({}, WalletHelper.walletSettings);
        this.$coefficientResolve();
        this.isShowNotFound = this.searchQuery && !this.walletList.length;
        this.cdr.markForCheck();
    }

    private walletChangeCallback(wallet: ISelectedWallet): void {
        if (this.$params?.onWalletChange) {
            this.$params?.onWalletChange(wallet);
        }
    }

    private async initCurrentWallet(): Promise<void> {
        await this.createWalletsArray();

        this.currentWallet = _find(
            this.walletList,
            (wallet: IWallet) => wallet.currency === this.userService.userProfile.selectedCurrency);

        const saveWallet = (): Promise<TUpdateProfileRes> => {
            return this.userService.updateProfile(
                {
                    extProfile: {
                        currentWallet: {
                            walletCurrency: this.currentWallet.currency,
                            walletId: this.currentWallet.walletId,
                        },
                    },
                },
                {updatePartial: true},
            );
        };

        if (!this.currentWallet) {

            this.currentWallet = this.walletList[0];

            if (!this.isFinance) {
                await saveWallet();
            }
        }
        UserInfo.currency = this.currentWallet.currency;

        if (this.$params.onWalletChange) {
            this.$params.onWalletChange({
                walletId: this.currentWallet.walletId,
                walletCurrency: this.currentWallet.currency,
            });
        }

        if (!this.isFinance) {
            this.userService.userProfile$.pipe(
                first((v) => !!v?.idUser),
                takeUntil(this.$destroy))
                .subscribe((profile: UserProfile): void => {
                    if (!profile.extProfile.currentWallet) {
                        saveWallet();
                    }
                });
        }
    }

    private async initSelector(): Promise<void> {

        if (!this.isFinance) {
            WalletHelper.currencies = this.userService.userProfile.unusedCurrencies;
        }

        this.currencies = this.currencyService.currencies;

        await this.initCurrentWallet();

        if (this.userService.userProfile.extProfile.conversionCurrency) {
            this.settingsParams.walletSettings = this.userService.userProfile.extProfile.conversionCurrency;
        } else {
            this.settingsParams.walletSettings = {
                hideWalletsWithZeroBalance: false,
                conversionInFiat: false,
                currency: null,
            };
        }

        if (!this.isFinance) {
            await this.updateConversionCoefficient();
        }

        this.walletCurrency = this.displayedCurrency;

        this.isShowWalletSelector = true;
        this.cdr.markForCheck();
        WalletHelper.$resolveMultiWallet();

        const hour: number = 1000 * 60 * 60;

        interval(hour)
            .pipe(takeUntil(this.$destroy))
            .subscribe((): void => {
                this.updateConversionCoefficient();
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

        for (const index in this.currencies) {
            const currency: string = this.currencies[index].Name;
            const displayName: string = this.currencies[index].DisplayName;

            let wallet: IWallet = _assign({}, wallets[currency]);

            if (this.$params.isWithdrawal
                ? wallet.balance && wallet.balance !== '0.00'
                : this.currencies[index].registration
            ) {
                if (wallet.balance) {

                    if (this.isConvert(currency) && this.isOpened) {

                        if (this.changeConversionCoefficientReady) {
                            await this.changeConversionCoefficientReady;
                        }

                        const coefficient: number = await this.ratesService.getRate({
                            currencyFrom: currency,
                            currencyTo: this.settingsParams.walletSettings.currency,
                        });
                        wallet.balance = (coefficient * _toNumber(wallet.balance));
                    }
                    wallet.displayName = displayName || currency;

                } else {
                    wallet = {
                        displayName: displayName || currency,
                        currency: currency,
                        balance: '0.00',
                    };
                }

                const currentCurrencyUnused: ICurrencyFilter = WalletHelper.currencies
                    ?.find((item: ICurrencyFilter) => item.code === currency);

                if (!currentCurrencyUnused || this.$params.isWithdrawal) {
                    wallet.balance = _toNumber(wallet.balance).toFixed(2);
                    this.walletList.push(wallet);
                }

                if (currency !== this.currentWallet?.currency ?? this.userService.userProfile.selectedCurrency) {

                    if (currentCurrencyUnused) {
                        this.filtersParams.currencies.push(currentCurrencyUnused);
                    } else {
                        this.filtersParams.currencies.push({
                            name: wallet.displayName,
                            code: wallet.currency,
                            isUsed: true,
                        } as ICurrencyFilter);
                    }
                }

                if (!this.currencies[index].IsCryptoCurrency) {
                    this.settingsParams.currencies.push({displayName, name: currency});
                }
            }
        }

        if (!this.walletList.length) {
            let currencies: ICurrency<string>[] = this.currencies;
            const currentCurrency: ICurrency<string> = currencies?.find((currency: ICurrency<string>): boolean =>
                (this.currentWallet
                    ? currency.Name === this.currentWallet.currency
                    : currency.Name === this.userService.userProfile.selectedCurrency
                ) && currency.registration);
            let walletsArray: IWallet[] = Object.values(wallets);

            if (currentCurrency) {
                this.walletList.push(WalletHelper.createCurrentWallet(
                    wallets,
                    this.currentWallet?.currency ?? this.userService.userProfile.selectedCurrency,
                    this.currentWallet?.displayName || this.userService.userProfile.selectedCurrency,
                ));

            } else if (walletsArray.length) {
                walletsArray = _sortBy(walletsArray, ['DisplayName', 'Name']);
                this.walletList.push(walletsArray[0]);

            } else {
                let currencies: ICurrency<string>[] = _sortBy(this.currencies, ['DisplayName', 'Name']);
                this.walletList.push(WalletHelper.createCurrentWallet(
                    wallets,
                    currencies[0].Name,
                    currencies[0].DisplayName,
                ));
            }
        } else {
            this.sortWallets();
        }

        this.$createWalletListResolve();
    }

    private sortWallets(): void {
        this.walletList = _orderBy(
            this.walletList,
            [
                (wallet: IWallet): boolean =>
                    wallet.currency === (this.currentWallet?.currency || this.userService.userProfile.selectedCurrency),
                (wallet: IWallet): boolean => wallet.balance !== '0.00',
                'displayName',
            ],
            ['desc', 'desc', 'asc'],
        );
    }

    private async createWalletList(): Promise<void> {
        await this.createWalletsArray();
        const searchCondition = (currency: IWallet): boolean =>
            currency.displayName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            currency.currency.toLowerCase().includes(this.searchQuery.toLowerCase());

        const zeroBalanceCondition: boolean = this.settingsParams.walletSettings?.hideWalletsWithZeroBalance
            && !this.searchQuery.length && !this.isFinance;

        this.walletList = _filter(this.walletList, (currency: IWallet) => searchCondition(currency)
            && (zeroBalanceCondition
                ? (currency.currency === this.currentWallet.currency || currency.balance !== '0.00')
                : true),
        );
        this.walletListRead = true;
        this.cdr.markForCheck();
    }

    private async updateConversionCoefficient(
        settings: IWalletsSettings = this.settingsParams.walletSettings,
    ): Promise<void> {
        WalletHelper.rates = {};

        if (!settings.currency?.length) {
            settings.conversionInFiat = false;
        }

        if (settings.conversionInFiat) {
            WalletHelper.conversionCurrency = settings.currency;
            WalletHelper.coefficientConversion = await this.ratesService.getRate({
                currencyFrom: this.currentWallet.currency,
                currencyTo: settings.currency,
            });

            WalletHelper.coefficientOriginalCurrencyConversion = WalletHelper.coefficientConversion;

            if (this.currentWallet.currency !== this.userService.userProfile.originalCurrency) {
                WalletHelper.coefficientOriginalCurrencyConversion = await this.ratesService.getRate({
                    currencyFrom: this.userService.userProfile.originalCurrency,
                    currencyTo: settings.currency,
                });
            }

            if (this.currentWallet.currency === 'EUR') {
                WalletHelper.coefficientConversionEUR = WalletHelper.coefficientConversion;
            } else if (this.userService.userProfile.originalCurrency === 'EUR') {
                WalletHelper.coefficientConversionEUR = WalletHelper.coefficientOriginalCurrencyConversion;
            } else {
                WalletHelper.coefficientConversionEUR = await this.ratesService.getRate({
                    currencyFrom: 'EUR',
                    currencyTo: settings.currency,
                });
            }

        } else {
            WalletHelper.conversionReset();
        }

        if (this.settingsParams.walletSettings.conversionInFiat !== settings.conversionInFiat
            || this.settingsParams.walletSettings.currency !== settings.currency
            || this.settingsParams.walletSettings.hideWalletsWithZeroBalance !== settings.hideWalletsWithZeroBalance) {
            await this.userService.updateProfile(
                {extProfile: {conversionCurrency: settings}},
                {updatePartial: true},
            );
        }

        this.userService.userInfo$.next(this.userService.userInfo);

        this.eventService.emit({name: MultiWalletEvents.CurrencyConversionChanged});
    }

    private isConvert(currency: string = this.currentWallet.currency): boolean {
        return !this.isFinance && this.settingsParams.walletSettings?.conversionInFiat
            && currency !== this.settingsParams.walletSettings?.currency;
    }
}
