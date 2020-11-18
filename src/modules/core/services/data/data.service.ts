import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {
    Observable,
    Subject,
    of,
    from,
    timer,
    BehaviorSubject,
    Subscription,
    PartialObserver,
    throwError,
} from 'rxjs';
import {
    map,
    tap,
    filter,
    catchError,
} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {LogService} from 'wlc-engine/modules/core/services';

import {
    isString as _isString,
    get as _get,
    assign as _assign,
    isFunction as _isFunction,
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
    /** name of method */
    name: string;
    /** system of method */
    system: string;
    /** api url */
    url?: string;
    /** full api url */
    fullUrl?: string;
    /** type of http request */
    type: RestMethodType;
    /** cache time in ms */
    cache?: number;
    /** request parametrs */
    params?: RequestParamsType;
    /** period of automatical request */
    period?: number;
    /** preload name from inline preload script */
    preload?: string;
    /** method that transform request data */
    mapFunc?: (data: IData) => unknown;
}

interface IRegistredMethod extends IRequestMethod {
    flow?: Observable<IData>;
    subject?: BehaviorSubject<IData>;
    intervalSubcribe?: Subscription;
}

@Injectable()
export class DataService {

    /** Observable flow of all api data */
    public get flow(): Observable<IData> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IData> = new Subject<IData>();
    private socket: WebSocket;
    private apiList: {[key: string]: IRegistredMethod} = {};

    private urlPrefix = '/api/v1';

    private socketUrl = '';
    private logService: LogService;

    constructor(
        private injector: Injector,
        private http: HttpClient,
        private translate: TranslateService,
    ) {
        setTimeout(() => {
            this.logService = injector.get(LogService);
        }, 0);
        this.init();
    }

    /**
     * Register api method
     *
     * @param method {IRequestMethod} method object to register in service
     *
     * @return {boolean} result of method registration
     */
    public registerMethod(method: IRequestMethod): boolean {
        const name = `${method.system}/${method.name}`;
        if (_get(this.apiList, name)) {
            return false;
        }

        if (!method.url && !method.fullUrl) {
            throw new Error(`registerMethod: url or fullUrl are nessesery on ${name}`);
        }

        const registedMethod: IRegistredMethod = _assign({}, method);
        registedMethod.subject = new BehaviorSubject<IData>(null);
        registedMethod.flow = registedMethod.subject.asObservable();
        if (registedMethod.period) {
            registedMethod.intervalSubcribe = timer(0, registedMethod.period).pipe(
                filter(() => {
                    return this.apiList[name].subject.observers.length > 0;
                })
            ).pipe(
                tap(() => {
                    this.request$(this.apiList[name]).toPromise();
                })
            ).subscribe();
        }

        this.apiList[name] = registedMethod;
        return true;
    }

    /**
     * Make single request to api
     *
     * @param request {string | IRequestMethod} name registred api method (system/name) or request method object
     * @param params {RequestParamsType} params of request
     *
     * @return {Promise} result of api request
     */
    public request(request: string | IRequestMethod, params?: RequestParamsType): Promise<IData> {
        if (_isString(request)) {
            if (this.apiList[request]) {
                return this.request$(this.apiList[request], params).toPromise();
            } else {
                return Promise.reject({
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
            return this.request$(request, params).toPromise();
        }
    }

    /**
     * Subscribe to API method with observer
     *
     * @param requestName {string} name of registred method (system/name)
     * @param observer {(value: IData) => void | PartialObserver} observer to subscribe
     *
     * @return {Subscription} An Subscription to registred api method with observer
     */
    public subscribe(requestName: string, observer: ((value: IData) => void) | PartialObserver<IData>): Subscription {

        // may be need to auto register method?
        if (!_get(this.apiList, requestName)) {
            return;
        }

        return this.apiList[requestName].flow.subscribe(
            _isFunction(observer)
                ? {next: (response: IData) => {observer(response)}}
                : observer
        );
    }

    /**
     * Get Observable of api method
     *
     * @param requestName {string} name of registred method (system/name)
     *
     * @return {Observable} An Observable of registred api method
     */
    public getMethodSubscribe(requestName: string): Observable<IData> {

        if (!_get(this.apiList, requestName)) {
            return;
        }
        return this.apiList[requestName].flow;
    }

    protected init(): void {
        if (this.socketUrl) {
            this.socketConnect();
        }
    }

    protected request$(method: IRegistredMethod, params?: RequestParamsType): Observable<IData> {

        if (!method.url && !method.fullUrl) {
            throw new Error(`request$: url or fullUrl are nessesery on ${method.system}/${method.name}`);
        }

        const requestParams = _assign(
            {
                lang: this.translate.currentLang || 'en'
            },
            method.params,
            method.type === 'GET' ? params : {}
        );
        const requestBody = method.type !== 'GET' ? JSON.stringify(params) || '' : undefined;
        const url = method.fullUrl || this.urlPrefix + method.url;

        return (
            (method.preload
                && method.type === 'GET'
                && (window as any).wlcPreload?.hasOwnProperty(method.preload)) ?
                from((window as any).wlcPreload[method.preload] as Promise<IData>) :
                this.http.request<IData>(
                    method.type,
                    url,
                    {
                        params: requestParams,
                        body: requestBody,
                        withCredentials: true,
                    }
                )
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        this.logService.sendLog(error.error || error);
                        return throwError(error.error || error);
                    })
                )
        ).pipe(
            map((data: IData): IData => {
                let responseData: IData;

                if (_get(data, 'status') && (_get(data, 'data') || _get(data, 'errors'))) {
                    responseData = data;
                } else {
                    responseData = data.errors ?
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

                if (responseData.errors) {
                    this.logService.sendLog({
                        code: '0.0.12',
                        data: {
                            errors: responseData.errors
                        }
                    });
                    throwError(responseData.errors)
                }

                return responseData;
            }),
            tap((data: IData) => {
                this.flow$.next(data);
                method.subject?.next(data);
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
