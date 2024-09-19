import {Injectable} from '@angular/core';

import _toNumber from 'lodash-es/toNumber';

import {
    DataService,
    EventService,
    IData,
    InjectionService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    ICreatedWallet,
    ISelectedWallet,
    MultiWalletEvents,
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletsService {

    private userService: UserService;

    constructor(
        private dataService: DataService,
        private logService: LogService,
        private injectionService: InjectionService,
        private eventService: EventService,
    ) {
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
