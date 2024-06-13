import {Injectable} from '@angular/core';

import {
    BehaviorSubject,
    Subscription,
} from 'rxjs';

import {
    ConfigService,
    DataService,
    IData,
    LogService,
    ModalService,
    WebsocketService,
} from 'wlc-engine/modules/core';
import {IWSConsumerData} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';
import {
    ILocalJackpot,
    IWSDataJackpotWon,
    ILocalJackpotsData,
} from 'wlc-engine/modules/local-jackpots/system/interfaces/local-jackpots.interface';

@Injectable({
    providedIn: 'root',
})
export class LocalJackpotsService {

    private localJackpotsWSSub: Subscription;

    constructor(
        private dataService: DataService,
        private logService: LogService,
        private webSocketService: WebsocketService,
        private configService: ConfigService,
        private modalService: ModalService,
    ) {
        this.init();
    }

    public async getJackpots(userCurrency: string): Promise<ILocalJackpot[]> {
        try {
            return (await this.dataService.request<IData<ILocalJackpotsData>>('local-jackpots/jackpots', {
                currency: userCurrency,
            })).data?.data;
        } catch (error) {
            this.logService.sendLog({code: '30.0.0', data: error});
        }
    }

    private init(): void {
        this.registerMethod();
        this.setSubscriptions();
    }

    private setWebSocketConnect(): void {
        this.localJackpotsWSSub = this.webSocketService.getMessages({
            endPoint: 'wsc2', events: [WebSocketEvents.RECEIVE.LOCAL_JACKPOTS],
        }).subscribe((data: IWSConsumerData<IWSDataJackpotWon>) => {
            this.modalService.showModal('localJackpotWon', {amountWon: data.data.AmountConverted});
        });
    }

    private setSubscriptions(): void {
        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .subscribe((isAuth: boolean) => {
                if (isAuth) {
                    this.setWebSocketConnect();
                } else {
                    this.localJackpotsWSSub.unsubscribe();
                }
            });
    }

    private registerMethod(): void {
        this.dataService.registerMethod({
            name: 'jackpots',
            system: 'local-jackpots',
            url: '/appearance/jackpots',
            type: 'GET',
            apiVersion: 2,
        });
    }
}
