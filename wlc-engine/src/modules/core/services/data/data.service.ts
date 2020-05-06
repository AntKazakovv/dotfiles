import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/internal/operators';
import {Observable, Subject, of} from 'rxjs';
import {APP_ENVIRONMENT, IAppEnv} from 'tokens';
import {LanguageService} from '../../../locale/services/language/language.service';

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

type RestMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestParamsType = HttpParams | {[key: string]: string | string[]};

export interface IRequestMethod {
    name: string;
    system: string;
    url: string;
    type: RestMethodType;
    cache?: number;
    params?: RequestParamsType;
}

@Injectable()
export class DataService {

    public get flow(): Observable<IData> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IData> = new Subject<IData>();
    private socket: WebSocket;
    private apiList: {[key: string]: IRequestMethod} = {};

    constructor(
        private http: HttpClient,
        private language: LanguageService,
        @Inject(APP_ENVIRONMENT) protected env: IAppEnv,
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
        if (this.env.socket) {
            this.socketConnect();
        }
    }

    protected request$(method: IRequestMethod, params?: RequestParamsType): Observable<IData> {
        const requestParams = _assign(
            {
                lang: _get(this.language.getCurrentLanguage(), 'code', 'en'),
            },
            method.params,
            method.type === 'GET' ? params : {}
        );
        const requestBody = method.type !== 'GET' ? JSON.stringify(params) || '' : undefined;
        const url = _get(this.env, 'site', '') + '/' + method.url;
        return this.http.request(method.type, url,
            {
                params: requestParams,
                body: requestBody,
                withCredentials: true,
            })
            .pipe(
                map((data: any) => {
                    if (_get(data, 'status') && (_get(data, 'data') || _get(data, 'errors'))) {
                        return data as IData;
                    } else {
                        return (data as any).errors ?
                            {
                                status: 'error',
                                name: method.name,
                                system: method.system,
                                errors: data.errors as string[],
                            } : {
                                status: 'success',
                                name: method.name,
                                system: method.system,
                                data: data,
                            };
                    }
                }),
                tap((data: IData) => {
                    this.flow$.next(data);
                    if (method.type === 'GET' && method.cache > 0) {
                        // save to cache
                    }
                })
            );
    }

    private socketConnect(): void {
        this.socket = new WebSocket(this.env.socket);
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
