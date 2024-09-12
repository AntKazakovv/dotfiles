import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    inject,
} from '@angular/core';

import _assign from 'lodash-es/assign';
import _sortBy from 'lodash-es/sortBy';
import _orderBy from 'lodash-es/orderBy';

import {
    first,
    map,
    takeUntil,
} from 'rxjs/operators';
import {
    filter,
    from,
    interval,
    Observable,
    of,
} from 'rxjs';

import {
    AbstractComponent,
    EventService,
    IIndexing,
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
    ISelectedWallet,
    ICurrencyFilter,
    MultiWalletEvents,
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';
import {IFiltersParams} from 'wlc-engine/modules/multi-wallet/components/filters/filters.params';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';
import {TUpdateProfileRes} from 'wlc-engine/modules/user/system/services/user/user.service';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

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
    public filtersParams: IFiltersParams = {
        currencies: [],
    };
    public walletListRead: boolean = false;
    public hideSettings: boolean;

    protected readonly walletsService: WalletsService = inject(WalletsService);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly modalService: ModalService = inject(ModalService);
    protected readonly userService: UserService = inject(UserService);
    protected readonly ratesService: RatesCurrencyService = inject(RatesCurrencyService);
    protected readonly currencyService: CurrencyService = inject(CurrencyService);

    protected currencies: ICurrency<string>[];
    protected changeConversionCoefficientReady: Promise<void>;
    protected $coefficientResolve: () => void;
    protected createWalletListReady: Promise<void>;
    protected $createWalletListResolve: () => void;
    protected showDepositBtn: boolean;

    private searchQuery: string = '';

    constructor(
        @Inject('injectParams') protected injectParams: Params.WalletsParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.hideSettings = this.configService.get<boolean>('$base.multiWallet.hideSettings');
        this.isFinance = this.$params.themeMod === 'finances';
        this.showDepositBtn = this.$params.showDepositBtn && !this.isFinance;

        if (this.$params.themeMod) {
            this.addModifiers(this.$params.themeMod);
        }

        if (this.hideSettings) {
            this.addModifiers('hide-settings');
        }
        UserInfo.currency = this.userService.userProfile.selectedCurrency;

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
                }
                this.cdr.detectChanges();
            });
        this.eventService.subscribe({name: 'LOGOUT'}, (): void => {
            this.walletsService.conversionReset();
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

    protected getWalletBalance(item: IWallet): Observable<string | number> {
        return (typeof item.balance === 'string' || typeof item.balance === 'number')
            ? of(item.balance)
            : item.balance;
    }

    public get displayedBalance(): string {
        return this.isNeedConversion()
            ? (Number(this.currentWallet.balance) * this.walletsService.coefficientConversion).toFixed(2)
            : <string>this.currentWallet.balance;
    }

    public get displayedCurrency(): string {
        return this.isNeedConversion() ? this.walletsService.walletSettings?.currency : null;
    }

    protected get showSettings(): boolean {
        return !this.isFinance && !this.hideSettings;
    }

    protected get filterIconPath(): string {
        return this.$params.filterIcon;
    }

    public getCurrencyIconUrl(currency: string): string {
        return this.walletsService.getCurrencyIconUrl(currency);
    }

    protected get isConvert(): boolean {
        return !this.isFinance && this.walletsService.walletSettings?.conversionInFiat;
    }

    protected isConvertBalanceWallet(wallet: IWallet): boolean {
        return this.isConvert && wallet.balance !== '0.00';
    }

    protected async onChangingWallet(item: IWallet): Promise<void> {
        this.currentWallet = this.walletsService.createCurrentWallet(
            this.userService.userInfo.wallets,
            item.currency,
            item.displayName,
        );
        this.isOpened = false;

        if (this.isConvert) {
            await this.updateConversionCoefficient();
        }

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

    protected onOpen(): void {
        this.walletListRead = false;
        this.cdr.markForCheck();
        this.searchQuery = '';
        this.isShowNotFound = false;
        this.isOpened = !this.isOpened;
        if (this.isOpened) {
            this.createWalletList();
        }
    }

    protected async setSearchQuery($event: string): Promise<void> {
        this.searchQuery = $event;
        await this.createWalletList();
        this.isShowNotFound = $event && !this.walletList.length;
        this.cdr.markForCheck();
    }

    protected clickOutside(): void {
        this.isOpened = false;
    }

    protected showSettingsModal(): void {
        this.modalService.showModal({
            id: 'wallet-settings',
            modalTitle: this.$params.settingsText,
            modifier: 'info',
            componentName: 'multi-wallet.wlc-settings',
            showConfirmBtn: true,
            confirmBtnText: gettext('Save'),
            rejectBtnVisibility: false,
            textAlign: 'center',
            dismissAll: true,
            onConfirm: async (): Promise<void> => this.changeSettings(),
        });
    }

    protected async showFiltersModal(): Promise<void> {
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
                {extProfile: {unusedCurrencies: this.walletsService.currencies}},
                {updatePartial: true},
            ),
        });
    }

    protected async changeSettings(): Promise<void> {
        this.changeConversionCoefficientReady = new Promise((resolve: () => void): void => {
            this.$coefficientResolve = resolve;
        });
        await this.updateConversionCoefficient();
        this.$coefficientResolve();
        this.isShowNotFound = this.searchQuery && !this.walletList.length;
        this.cdr.markForCheck();
    }

    protected async conversionOfWalletBalances(wallet: IWallet, currency: string): Promise<void> {
        if (this.isConvertBalanceWallet(wallet)) {
            //TODO заменить на BehaviorSubject
            if (this.changeConversionCoefficientReady) {
                await this.changeConversionCoefficientReady;
            }

            const balance: number = Number(wallet.balance);
            wallet.balance = from(this.ratesService.getRate({
                currencyFrom: currency,
                currencyTo: this.walletsService.walletSettings.currency,
            })).pipe(
                map((value: number) => Number(balance) * value),
            );
        }
    }

    private walletChangeCallback(wallet: ISelectedWallet): void {
        if (this.$params?.onWalletChange) {
            this.$params?.onWalletChange(wallet);
        }
    }

    private async initCurrentWallet(): Promise<void> {
        await this.createWalletsArray();

        this.currentWallet = this.walletList
            .find((wallet: IWallet) => wallet.currency === this.userService.userProfile.selectedCurrency);

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
            await this.userService.profileReady;
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
            this.walletsService.currencies = this.userService.userProfile.unusedCurrencies;
        }

        this.currencies = this.currencyService.regCurrencies;
        await this.initCurrentWallet();

        if (this.userService.userProfile.extProfile.conversionCurrency) {
            this.walletsService.walletSettings = this.userService.userProfile.extProfile.conversionCurrency;
        } else {
            this.walletsService.walletSettings = {
                hideWalletsWithZeroBalance: false,
                conversionInFiat: false,
                currency: null,
            };
        }

        if (!this.isFinance) {
            await this.updateConversionCoefficient();
        }

        this.isShowWalletSelector = true;
        this.cdr.markForCheck();
        this.walletsService.$resolveMultiWallet();

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
        this.filtersParams.currencies = [];
        this.walletList = [];
        const wallets: IIndexing<IWallet> = _assign({}, this.userService.userInfo.wallets);

        if (this.$params.isWithdrawal) {
            this.createWithdrawalWallets();
        } else {
            await this.createHeaderAndDepositWallets(wallets);
        }

        if (!this.walletList.length) {
            const currentCurrency: ICurrency<string> = this.currencies?.find((currency: ICurrency<string>): boolean =>
                currency.Name === this.userService.userProfile.selectedCurrency);
            let walletsArray: IWallet[] = Object.values(wallets);

            if (currentCurrency) {
                this.walletList.push(this.walletsService.createCurrentWallet(
                    wallets,
                    this.currentWallet?.currency || this.userService.userProfile.selectedCurrency,
                    this.currentWallet?.displayName || this.userService.userProfile.selectedCurrency,
                ));

            } else if (walletsArray.length) {
                walletsArray = _sortBy(walletsArray, ['DisplayName', 'Name']);
                this.walletList.push(walletsArray[0]);
            } else {
                let currencies: ICurrency<string>[] = _sortBy(this.currencies, ['DisplayName', 'Name']);
                this.walletList.push(this.walletsService.createCurrentWallet(
                    wallets,
                    currencies[0].Name,
                    currencies[0].DisplayName,
                ));
            }
        }
    }

    private createWithdrawalWallets(): void {
        this.walletList = Object.values(this.userService.userInfo.wallets)
            .filter((wallet: IWallet) => wallet.balance !== '0.00')
            .map((wallet: IWallet): IWallet => ({
                ...wallet,
                displayName: this.currencyService.getDisplayName(wallet.currency)}),
            );
    }

    private async createHeaderAndDepositWallets(wallets: IIndexing<IWallet>): Promise<void> {
        for (const index in this.currencies) {
            const currency: string = this.currencies[index].Name;
            const displayName: string = this.currencies[index].DisplayName;
            let wallet: IWallet = _assign({}, wallets[currency]);

            if (wallet.balance) {
                await this.conversionOfWalletBalances(wallet, currency);
                wallet.displayName = displayName || currency;

            } else {
                wallet = {
                    displayName: displayName || currency,
                    currency: currency,
                    balance: '0.00',
                };
            }

            this.filteredWallets(currency, wallet);
        }
    }

    private filteredWallets(currency: string, wallet: IWallet): void {
        const currentCurrencyUnused: ICurrencyFilter = this.walletsService.currencies
            ?.find((item: ICurrencyFilter) => item.name === currency);

        if (!currentCurrencyUnused) {
            this.walletList.push(wallet);
        }

        if (this.isFinance) {
            return;
        }

        if (currency !== this.userService.userProfile.selectedCurrency) {

            if (currentCurrencyUnused) {
                this.filtersParams.currencies.push(currentCurrencyUnused);
            } else {
                this.filtersParams.currencies.push({
                    displayName: wallet.displayName,
                    name: wallet.currency,
                    isUsed: true,
                } as ICurrencyFilter);
            }
        }
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
        this.sortWallets();
        await this.$createWalletListResolve();
        const searchCondition = (currency: IWallet): boolean =>
            currency.displayName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            currency.currency.toLowerCase().includes(this.searchQuery.toLowerCase());

        const zeroBalanceCondition: boolean = this.walletsService.walletSettings?.hideWalletsWithZeroBalance
            && !this.searchQuery.length && !this.isFinance;

        this.walletList = this.walletList.filter((currency: IWallet) => searchCondition(currency)
            && (zeroBalanceCondition
                ? (currency.currency === this.currentWallet.currency || currency.balance !== '0.00')
                : true)
            // TODO: refactor it after release https://tracker.egamings.com/issues/623167 (create exists wallets list)
            && (this.$params.type === 'loyalty' ? !!currency.walletId : true),
        );
        this.walletListRead = true;
        this.cdr.markForCheck();
    }

    private async updateConversionCoefficient(): Promise<void> {
        this.walletsService.rates = {};

        if (!this.walletsService.walletSettings.currency?.length) {
            this.walletsService.walletSettings.conversionInFiat = false;
        }

        if (this.walletsService.walletSettings.conversionInFiat) {
            this.walletsService.coefficientConversion = await this.ratesService.getRate({
                currencyFrom: this.currentWallet.currency,
                currencyTo: this.walletsService.walletSettings.currency,
            });

            this.walletsService.coefficientOriginalCurrencyConversion = this.walletsService.coefficientConversion;

            if (this.currentWallet.currency !== this.userService.userProfile.originalCurrency) {
                this.walletsService.coefficientOriginalCurrencyConversion = await this.ratesService.getRate({
                    currencyFrom: this.userService.userProfile.originalCurrency,
                    currencyTo: this.walletsService.walletSettings.currency,
                });
            }

            if (this.currentWallet.currency === 'EUR') {
                this.walletsService.coefficientConversionEUR = this.walletsService.coefficientConversion;
            } else if (this.userService.userProfile.originalCurrency === 'EUR') {
                this.walletsService.coefficientConversionEUR =
                    this.walletsService.coefficientOriginalCurrencyConversion;
            } else {
                this.walletsService.coefficientConversionEUR = await this.ratesService.getRate({
                    currencyFrom: 'EUR',
                    currencyTo: this.walletsService.walletSettings.currency,
                });
            }

        } else {
            this.walletsService.conversionReset();
        }

        this.userService.userInfo$.next(this.userService.userInfo);
        this.eventService.emit({name: MultiWalletEvents.CurrencyConversionChanged});
    }

    protected isNeedConversion(currency: string = this.currentWallet.currency): boolean {
        return !this.isFinance && this.walletsService.walletSettings?.conversionInFiat
            && currency !== this.walletsService.walletSettings?.currency;
    }
}
