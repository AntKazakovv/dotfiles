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
    events?: string[];
    system?: string;
    eventFilterFunc?: (message: IWSConsumerData) => boolean;
}

export interface IWSMessage<T> {
    requestId?: number;
    method?: string;
    params?: T;
}

export interface IWSConsumerData<T = any> {
    status?: string;
    system?: string;
    event?: string;
    data?: T;
    code?: string;
}
