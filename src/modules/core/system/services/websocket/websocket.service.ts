import {
    Injectable,
} from '@angular/core';

import {
    Observable,
    merge,
    EMPTY,
    from,
} from 'rxjs';
import {
    catchError,
    filter,
    retry,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import {
    WebSocketSubject,
    WebSocketSubjectConfig,
    webSocket,
} from 'rxjs/webSocket';

import {
    IWSMessage,
    IWebSocketConfig,
    IWSRequestParams,
    IWSConsumerData,
} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';
import {
    EventService,
    IEvent,
} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {PragmaticLiveData} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';

export type TWSEndPoint = string | 'wsc2' | 'pragmatic';
export type TWSMessage = IWSConsumerData | PragmaticLiveData;

/** This object contains a match between the name of the event
 *  from websocket and endpoint from the rest api,
 *  which reserves data in case when the websocket does not work
 *  example:
 *  'UserInfo': 'user/userInfo',
*/

export const WSToRestAPIReserve: IIndexing<string> = {

};

export const WebSocketEvents: IIndexing<IIndexing<string>> = {
    RECEIVE: {
        LATEST_BETS: 'publicgameaction',
        STREAMWHEEL: 'streamwheel',
        LOYALTY_GET: 'loyalty.loyalty.get',
        LOYALTY_UPDATE: 'updateloyalty',
        LOYALTY_USERINFO: 'UserInfo',
        USER: 'funcore.wlcinfo.user',
        USER_BALANCE: 'userbalance',
        ACHIEVEMENTS: 'achievementsloyalty',
        LOCAL_JACKPOTS: 'userjackpot',
        QUESTS: 'questsloyalty',
        LAST_WITHDRAW: 'userpayment',
    },
    SEND: {
        LOYALTY: 'loyalty.loyalty.get',
        USER_INFO: 'funcore.wlcinfo.user',
        USER_PAYMENT: 'funcore.userpayment',
    },
};

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {

    private readonly endPointToConfig: Map<string, IWebSocketConfig> = new Map();
    private readonly endPointToWebsocket: Map<string, WebSocketSubject<IIndexing<any>>> = new Map();
    private isRestApiWork: boolean = false;

    constructor(
        private eventService: EventService,
        private dataService: DataService,
    ) {
        this.setSubscribes();
    }

    /**
     * Return websocket or Rest api Observable with message by event name
     *
     * @param {IWSRequestParams} params
     *
     * @returns {Observable} data
     */
    public getMessages<T extends TWSMessage>(params: IWSRequestParams): Observable<T> {
        this.createSocket(params.endPoint);
        if (this.endPointToWebsocket.has(params.endPoint)) {
            return this.endPointToWebsocket.get(params.endPoint).pipe(
                filter((message: IWSConsumerData) => {

                    if (message.event && message.status !== 'error') {
                        return params.events.includes(message.event)
                            && (params.eventFilterFunc ? params.eventFilterFunc(message) : true);
                    } else {
                        return true;
                    }
                }),
                retry(
                    {
                        count: ((this.endPointToConfig.get(params.endPoint).reconnectAttempts) || 3),
                        delay: ((this.endPointToConfig.get(params.endPoint).reconnectInterval) || 2000),
                    },
                ),
                catchError((error, caught) => {
                    return merge(caught, this.activateRestApi(params.events).pipe(catchError(() => EMPTY)));
                }),
                tap((message: IWSConsumerData) => {
                    if (!message.code && this.isRestApiWork) {
                        this.isRestApiWork = false;
                    }
                }),
            ) as Observable<T>;
        } else {
            return this.eventService.filter({name: 'SOCKET_CONNECT', status: 'success'}).pipe(
                filter((msg) => msg.data === params.endPoint),
                take(1),
                switchMap(() => this.getMessages(params) as Observable<T>),
            );
        }
    }

    /**
     * Send message to websocket
     *
     * @param {TWSEndPoint} endPoint
     * @param {method} string
     *
     * @returns {void}
     */
    public sendToWebsocket(endPoint: TWSEndPoint, method?: string, payload?: unknown): number {
        const requestId = this.getId();
        const data: IWSMessage<unknown> = method ? {requestId, method} : payload;

        if (this.endPointToWebsocket.has(endPoint)) {
            this.endPointToWebsocket.get(endPoint).next({...data});
        }
        return requestId;
    }

    /**
     * Add socket config from restApi query to Map
     *
     * @param {TWSEndPoint} endPoint
     * @param {IWebSocketConfig} config
     *
     * @returns {void}
     */
    public addWsEndPointConfig(endPoint: TWSEndPoint, config: IWebSocketConfig): void {
        if (!this.endPointToConfig.has(endPoint)) {
            this.endPointToConfig.set(endPoint, config);
            this.createSocket(endPoint);
        }
    }

    /**
     * Check connection in map
     *
     * @param {TWSEndPoint} endPoint
     *
     * @returns {boolean}
     */
    public hasSocketConnection(endPoint: TWSEndPoint): boolean {
        return this.endPointToWebsocket.has(endPoint);
    }

    /**
     * Create new websocket connection and add to Map
     *
     * @param {TWSEndPoint} endPoint
     *
     * @returns {void}
     */
    private createSocket(endPoint: TWSEndPoint): void {
        if (!this.endPointToWebsocket.has(endPoint) && this.endPointToConfig.has(endPoint)) {
            this.endPointToWebsocket.set(endPoint, this.getSocket(this.endPointToConfig.get(endPoint)));

            this.eventService.emit({
                name: 'SOCKET_CONNECT',
                data: endPoint,
                status: 'success',
            });
        }
    }

    private setSubscribes(): void {
        this.eventService.filter([
            {name: 'LOGIN'},
            {name: 'LOGOUT'}])
            .subscribe({
                next: (event: IEvent<unknown>) => {
                    if (event.name === 'LOGOUT') {
                        this.endPointToWebsocket.forEach((ws: WebSocketSubject<IIndexing<any>>) => ws.complete());
                    }

                    this.endPointToConfig.clear();
                    this.endPointToWebsocket.clear();
                },
            });
    }

    private getSocket(wsConfig: IWebSocketConfig): WebSocketSubject<unknown> {
        return webSocket(this.getConfigWebSocket(wsConfig));
    }

    private getConfigWebSocket(wsConfig: IWebSocketConfig): WebSocketSubjectConfig<unknown> {
        return {
            url: `${wsConfig?.server2}` +
            (wsConfig?.token ? `?token=${wsConfig?.token}` : '') +
            (wsConfig?.api ? `&api=${wsConfig?.api}` : ''),
        };
    }

    private activateRestApi(events: string[]): Observable<any> {
        this.isRestApiWork = true;
        return this.getReserveMsgFromRestApi(events);
    }

    private getReserveMsgFromRestApi(events: string[]): Observable<unknown> {
        return WSToRestAPIReserve[events[0]] ? from(this.dataService.request(WSToRestAPIReserve[events[0]])): EMPTY;
    }

    private getId(): number {
        let i: string;
        i = Math.random()
            .toString()
            .substring(2, 10);
        return +i;
    }
}
