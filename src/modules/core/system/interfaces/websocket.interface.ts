import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import{TWSEndPoint} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';

export interface IWebSocketConfig {
    api?: string;
    server?: string;
    server2?: string;
    token?: string;
    reconnectInterval?: number;
    reconnectAttempts?: number;
}

export interface IWSRequestParams {
    endPoint: TWSEndPoint;
    system?: string;
    event: string;
}

export interface IWSMessage<T> {
    requestId?: number;
    method?: string;
    params?: T;
}

export interface IWSData {
    status?: string;
    system?: string;
    event?: string;
    data?: IIndexing<any>;
    code?: string;
}
