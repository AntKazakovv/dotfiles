import {Injectable} from '@angular/core';
import {
    DataService,
    EventService,
    IData,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {ICreatedWallet} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletsService {

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
    ) {}

    public async addWallet(currency: string): Promise<string> {
        try {

            const response: IData<ICreatedWallet> = await this.dataService.request({
                name: 'addWallet',
                system: 'user',
                url: '/wallets',
                type: 'POST',
            }, {currency});

            return response.data.walletId;
        } catch (error) {

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Failed to create a wallet'),
                    message: error.errors ?? gettext('Something went wrong. Please try again later.'),
                    wlcElement: 'notification_creating-wallet-error',
                },
            });

            this.logService.sendLog({code: '23.0.0', data: error});
        }
    }
}
