import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, tap, switchMap} from 'rxjs/internal/operators';
import {Observable, Subject, of, from} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {
    isString as _isString,
    get as _get,
    assign as _assign,
} from 'lodash';

export interface IData {
    status: 'success' | 'error';
    name: string;
    system: string;
    code?: string;
    errors?: string[];
    data?: any;
}

export type RestMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type RequestParamsType = HttpParams | {[key: string]: string | string[]};

export interface IRequestMethod {
    name: string;
    system: string;
    url: string;
    type: RestMethodType;
    cache?: number;
    params?: RequestParamsType;
    preload?: string;
    mapFunc?: (data: IData) => any;
}

@Injectable()
export class DataService {

    public get flow(): Observable<IData> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IData> = new Subject<IData>();
    private socket: WebSocket;
    private apiList: {[key: string]: IRequestMethod} = {};

    private socketUrl = '';

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
    ) {
        this.init();
    }

    public registerMethod(method: IRequestMethod): boolean {
        const name = `${method.system}/${method.name}`;
        if (_get(this.apiList, name)) {
            return false;
        }
        this.apiList[name] = method;
        return true;
    }

    public request(request: string | IRequestMethod, params?: RequestParamsType): Observable<IData> {
        if (_isString(request)) {
            if (this.apiList[request]) {
                return this.request$(this.apiList[request], params);
            } else {
                return of({
                    system: 'data',
                    name: request,
                    status: 'error',
                    code: '0.1.3',
                    errors: [
                        `Non configured request method ${request}`,
                    ]
                });
            }
        } else {
            return this.request$(request, params);
        }
    }

    protected init(): void {
        if (this.socketUrl) {
            this.socketConnect();
        }
    }

    protected request$(method: IRequestMethod, params?: RequestParamsType): Observable<IData> {
        const requestParams = _assign(
            {
                lang: this.translate.currentLang || 'en'
            },
            method.params,
            method.type === 'GET' ? params : {}
        );
        const requestBody = method.type !== 'GET' ? JSON.stringify(params) || '' : undefined;
        const url = method.url;

        return (
            (method.preload
                && method.type === 'GET'
                && (window as any).wlcPreload?.hasOwnProperty(method.preload)) ?
                from((window as any).wlcPreload[method.preload] as Promise<IData>) :
                this.http.request<IData>(method.type, url,
                    {
                        params: requestParams,
                        body: requestBody,
                        withCredentials: true,
                    })
        ).pipe(
            map((data: IData) => {
                if (_get(data, 'status') && (_get(data, 'data') || _get(data, 'errors'))) {
                    return data;
                } else {
                    return data.errors ?
                        {
                            status: 'error',
                            name: method.name,
                            system: method.system,
                            errors: data.errors as string[],
                        } : {
                            status: 'success',
                            name: method.name,
                            system: method.system,
                            data,
                        };
                }
            }),
            tap((data: IData) => {
                this.flow$.next(data);
                if (method.type === 'GET' && method.cache > 0 && data.status === 'success') {
                    // save to cache
                }
            }),
            map((data: any) => {
                if (data.status === 'success' && typeof method.mapFunc === 'function') {
                    data.data = method.mapFunc(data.data);
                }
                return data;
            })
        );
    }

    private socketConnect(): void {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = () => {
            this.setSocketHandlers();
        };
    }

    private setSocketHandlers(): void {
        this.socket.addEventListener('close', () => {
            this.onSocketClose();
        });
        this.socket.addEventListener('message', (event: MessageEvent) => {
            this.onSocketMessage(event);
        });
        this.socket.addEventListener('error', (event: Event) => {
            this.onSocketError(event);
        });
    }

    private onSocketClose(): void {
        setTimeout(() => {
            this.socketConnect();
        }, 5000);
    }

    private onSocketMessage(event: MessageEvent): void {
        try {
            this.flow$.next(JSON.parse(event.data));
        } catch (error) {
            this.flow$.next({
                system: 'websocket',
                name: 'error',
                status: 'error',
                code: '0.1.1',
                errors: error,
            });
        }
    }

    private onSocketError(event: Event): void {
        this.flow$.next({
            system: 'websocket',
            name: 'error',
            status: 'error',
            code: '0.1.2',
            data: event,
        });
    }
}
