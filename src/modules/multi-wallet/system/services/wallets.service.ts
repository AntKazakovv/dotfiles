import {Injectable} from '@angular/core';

import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

import {
    DataService,
    EventService,
    GlobalHelper,
    IData,
    IIndexing,
    InjectionService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    ICreatedWallet,
    ICurrencyFilter,
    ISelectedWallet,
    IWallet,
    IWalletsSettings,
    MultiWalletEvents,
} from 'wlc-engine/modules/multi-wallet';

@Injectable({
    providedIn: 'root',
})
export class WalletsService {
    public coefficientOriginalCurrencyConversion: number = 1;
    public coefficientConversion: number = 1;
    public coefficientConversionEUR: number = 1;
    public conversionCurrency: string;
    public rates: IIndexing<number> = {};
    public currencies: ICurrencyFilter[];
    public walletSettings: IWalletsSettings;

    public readyMultiWallet: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolveMultiWallet = resolve;
    });
    public $resolveMultiWallet: () => void;

    private userService: UserService;

    constructor(
        private dataService: DataService,
        private logService: LogService,
        private injectionService: InjectionService,
        private eventService: EventService,
    ) {
    }

    public createCurrentWallet(
        wallets: IIndexing<IWallet>,
        currency: string,
        displayName: string,
    ): IWallet {
        let currentWallet: IWallet = _assign({}, wallets)[currency];

        if (!currentWallet) {
            currentWallet = {
                currency: currency,
                balance: '0',
                availableWithdraw: '0',
            };
        }
        currentWallet.balance = _toNumber(currentWallet.balance).toFixed(2);
        currentWallet.displayName = displayName;
        return currentWallet;
    }

    public conversionReset(): void {
        this.coefficientConversion = 1;
        this.coefficientOriginalCurrencyConversion = 1;
        this.coefficientConversionEUR = 1;
        this.conversionCurrency = null;
    }

    public getCurrencyIconUrl(currency: string): string {
        return GlobalHelper.proxyUrl(`/wlc/icons/currencies/${currency.toLowerCase()}.svg`);
    }

    public async addWallet(currency: string): Promise<string> {
        try {

            const response: IData<ICreatedWallet> = await this.dataService.request({
                name: 'addWallet',
                system: 'multi-wallet',
                url: '/wallets',
                type: 'POST',
            }, {currency});
            this.userService ??= await this.injectionService
                .getService<UserService>('user.user-service');

            if (this.userService.userProfile.currency === currency) {
                await this.userService.updateProfile(
                    {
                        extProfile: {
                            currentWallet: {
                                walletCurrency: currency,
                                walletId: _toNumber(response.data.walletId),
                            },
                        },
                    },
                    {updatePartial: true},
                );
            }
            this.eventService.emit(
                {
                    name: MultiWalletEvents.CreateWallet,
                    data: {
                        walletCurrency: currency,
                        walletId: _toNumber(response.data.walletId),
                    } as ISelectedWallet,
                },
            );

            return response.data.walletId;
        } catch (error) {

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Failed to create a wallet'),
                    message: error.errors ?? gettext('Something went wrong. Please try again later'),
                    wlcElement: 'notification_creating-wallet-error',
                },
            });

            this.logService.sendLog({code: '23.0.0', data: error});
        }
    }
}
