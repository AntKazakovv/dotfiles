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
import {FormControl} from '@angular/forms';

import {StateService} from '@uirouter/core';
import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';
import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import {
    first,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    GlobalHelper,
    ICheckboxCParams,
    ICurrency,
    IIndexing,
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
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet/system/helpers/wallet.helper';

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
    public isShowWalletsWithZeroBalances: boolean = false;
    public toggleBtn: ICheckboxCParams = {
        name: 'hideZeroBalances',
        type: 'toggle',
        control: new FormControl(this.isShowWalletsWithZeroBalances),
        onChange: (checked: boolean): void => {
            this.onChangeShowingZeroBalances(checked);
        },
    };
    public isFinance: boolean;

    private searchQuery: string = '';

    constructor(
        @Inject('injectParams') protected injectParams: Params.WalletsParams,
        protected override cdr: ChangeDetectorRef,
        protected userService: UserService,
        protected override configService: ConfigService,
        protected stateService: StateService,
        protected eventService: EventService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isFinance = this.$params.themeMod === 'finances';
        if (this.$params.themeMod) {
            this.addModifiers(this.$params.themeMod);
        }

        this.initWalletSelector();
    }

    public onSelectWallet(item: IWallet): void {
        this.currentWallet = WalletHelper.createCurrentWallet(this.userService.userInfo.wallets, item.currency);

        this.changeWalletEmit.emit({
            walletCurrency: this.currentWallet.currency,
            walletId: this.currentWallet.walletId ?? null,
        });
        this.isOpened = false;
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
        this.userService.updateProfile({extProfile: userProfile.extProfile}, {updatePartial: true});
    }

    public onOpen(): void {
        this.searchQuery = '';
        this.isShowNotFound = false;
        this.isOpened = !this.isOpened;
        this.filterWallets();
        this.cdr.markForCheck();
    }

    public getIconUrl(currency: string): string {
        const path: string = `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
        return GlobalHelper.proxyUrl(path);
    }

    public setSearchQuery($event: string): void {
        this.searchQuery = $event;
        this.filterWallets();
        this.isShowNotFound = $event && !this.walletList.length;
        this.cdr.markForCheck();
    }

    public clickOutside(): void {
        this.isOpened = false;
    }

    public toDeposit(): void {
        this.stateService.go(this.$params.depositBtnParams.common.sref);
    }

    private initWalletSelector(): void {

        this.userService.userInfo$.pipe(
            first((v) => !!v),
            takeUntil(this.$destroy))
            .subscribe((userInfo: UserInfo) => {
                if (userInfo) {
                    this.currentWallet =
                        WalletHelper.createCurrentWallet(userInfo.wallets, this.userService.userProfile.currency);
                    if (!this.currentWallet?.walletId && this.$params.hideWalletsWithZeroBalance) {
                        this.filterWallets();
                        this.currentWallet = this.walletList[0];
                    }
                    UserInfo.currency = this.userService.userProfile.currency;
                    this.isShowWalletSelector = true;
                    this.currentWalletEmit.emit({
                        walletCurrency: this.currentWallet.currency,
                        walletId: this.currentWallet.walletId ?? null,
                    });
                    this.cdr.markForCheck();
                }
            });

        this.userService.userInfo$.pipe(
            takeUntil(this.$destroy))
            .subscribe((userInfo: UserInfo) => {
                if (userInfo) {
                    this.currentWallet.balance = userInfo.getWalletBalance(this.currentWallet.currency).toFixed(2);
                    this.cdr.markForCheck();
                }
            });
    }

    private onChangeShowingZeroBalances(checked: boolean): void {
        this.isShowWalletsWithZeroBalances = checked;
        this.filterWallets();
        this.isShowNotFound = this.searchQuery && !this.walletList.length;
        this.cdr.markForCheck();
    }

    private createWalletsArray(): void {
        const wallets: IWalletObj = _assign({}, this.userService.userInfo.wallets);
        const currencies: IIndexing<ICurrency> = this.configService.get('appConfig.siteconfig.currencies');
        this.walletList = [];
        for (const index in currencies) {
            const currency: string = currencies[index].Name;
            let wallet: IWallet = wallets[currency];

            if (!wallet && !this.$params.hideWalletsWithZeroBalance) {
                wallets[currency] = {
                    currency: currency,
                    balance: '0',
                };
                wallet = wallets[currency];
            }
            if (wallet) {
                wallet.balance = _toNumber(wallet.balance).toFixed(2);
                this.walletList.push(wallet);
            }
        }
    }

    private filterWallets(): void {
        this.createWalletsArray();
        const searchCondition = (currency: IWallet): boolean =>
            currency.currency.toLowerCase().includes(this.searchQuery.toLowerCase());
        const zeroBalanceCondition: boolean =
            (this.isShowWalletsWithZeroBalances && !this.searchQuery.length) || this.$params.hideWalletsWithZeroBalance;
        this.walletList = zeroBalanceCondition
            ? this.sortWallets(
                _filter(this.walletList, (currency: IWallet) => searchCondition(currency)
                    && (currency.currency === this.currentWallet.currency || currency.balance !== '0.00'),
                ),
            ) : this.sortWallets(_filter(this.walletList, (currency: IWallet) => searchCondition(currency)));
    }

    private sortWallets(wallets: IWallet[]): IWallet[] {
        return _orderBy(
            wallets,
            ['isReal', 'walletId', 'currency'], ['desc', 'asc'],
        ).sort((currency: IWallet) => currency.currency === this.currentWallet.currency ? -1 : 1);
    }
}
