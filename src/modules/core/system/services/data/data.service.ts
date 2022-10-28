import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    HttpClient,
    HttpParams,
    HttpErrorResponse,
} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

import {
    Observable,
    Subject,
    of,
    from,
    interval,
    BehaviorSubject,
    Subscription,
    PartialObserver,
    throwError,
    firstValueFrom,
} from 'rxjs';
import {
    map,
    switchMap,
    tap,
    filter,
    catchError,
    retryWhen,
    mergeMap,
    delay,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _isString from 'lodash-es/isString';
import _isFunction from 'lodash-es/isFunction';
import _get from 'lodash-es/get';
import _has from 'lodash-es/has';
import _set from 'lodash-es/set';
import _reverse from 'lodash-es/reverse';
import _isArray from 'lodash-es/isArray';

import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    ILogObj,
    LogService,
} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ISocketsData} from 'wlc-engine/modules/core/system/interfaces';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {ConfigService} from 'wlc-engine/modules/core/system/services';

export interface IData<T = any> {
    status: 'success' | 'error';
    name: string;
    system: string;
    code?: number | string;
    errors?: string[];
    source?: string;
    data?: T;
}

export type RestMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type RequestParamsType = HttpParams | {[key: string]: string | string[] | any};

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
    /** number of retries and fallback url */
    retries?: {
        /** accept values in seconds for retries requests,
         * ex. [1000, 5000, 10000] will repeat request in 1, 5, 10 seconds */
        count: number[];
        /** if requests are failed then method will use this url */
        fallbackUrl?: string;
    },
    /** cache time in ms */
    cache?: number;
    /** request parameters */
    params?: RequestParamsType;
    /** period of automatically request */
    period?: number;
    /** preload name from inline preload script */
    preload?: string;
    /** method that transform request data */
    mapFunc?: (data: unknown) => unknown;
    onError?: (data: HttpErrorResponse) => void;
    /** don't use GET parameter lang for request */
    noUseLang?: boolean;
    /** event for data request*/
    events?: {
        success?: string;
        fail?: string;
    };
}

export interface IHookRequestData {
    request: IRequestMethod,
    params?: RequestParamsType,
}

interface IRegisteredMethod extends IRequestMethod {
    flow?: Observable<IData>;
    subject?: BehaviorSubject<IData>;
    intervalSubscribe?: Subscription;
}

interface ISocketQueue {
    requestId: number;
    method: string;
    params?: any;
}

@Injectable()
export class DataService {

    /** Observable flow of all api data */
    public get flow(): Observable<IData> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IData> = new Subject<IData>();
    private socket: WebSocket;
    private apiList: {[key: string]: IRegisteredMethod} = {};

    private urlPrefix = '/api/v1';

    private socketUrl = '';

    private requestId: number = 0;
    private socketQueue: ISocketQueue[] = [];
    private socketOpen: boolean = false;

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private eventService: EventService,
        private cachingService: CachingService,
        private logService: LogService,
        private configService: ConfigService,
        private hooksService: HooksService,
        @Inject(WINDOW) private window: Window,
    ) {
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
            throw new Error(`registerMethod: url or fullUrl are necessary on ${name}`);
        }

        const registerMethod: IRegisteredMethod = _assign({}, method);
        registerMethod.subject = new BehaviorSubject<IData>(null);
        registerMethod.flow = registerMethod.subject.asObservable();
        if (registerMethod.period) {
            registerMethod.intervalSubscribe = interval(registerMethod.period).pipe(
                filter(() => {
                    return this.apiList[name].subject.observers.length > 0;
                }),
            ).pipe(
                tap(async () => {
                    try {
                        await this.request$(this.apiList[name]).toPromise();
                    } catch (error) {
                        //
                    }
                }),
            ).subscribe();
        }

        this.apiList[name] = registerMethod;
        return true;
    }

    /**
     * Make single request to api
     *
     * @param request {string | IRequestMethod} name registered api method (system/name) or request method object
     * @param params {RequestParamsType} params of request
     *
     * @return {Promise} result of api request
     */
    public async request<T>(request: string | IRequestMethod, params?: RequestParamsType): Promise<IData | T> {
        let requestMethod: IRequestMethod;
        if (_isString(request)) {
            if (this.apiList[request]) {
                requestMethod = this.apiList[request];
            } else {
                return Promise.reject({
                    system: 'data',
                    name: request,
                    status: 'error',
                    code: '0.0.16',
                    errors: [
                        `Non configured request method ${request}`,
                    ],
                });
            }
        } else {
            requestMethod = request;
        }

        const method = await this.hooksService.run<IHookRequestData>(
            'dataService:requestMethod',
            {
                request: requestMethod,
                params,
            },
        );

        return firstValueFrom(this.request$<T>(method.request, method.params));
    }

    /**
     * Subscribe to API method with observer
     *
     * @param requestName {string} name of registered method (system/name)
     * @param observer {(value: IData) => void | PartialObserver} observer to subscribe
     *
     * @return {Subscription} An Subscription to registered api method with observer
     */
    public subscribe(requestName: string, observer: ((value: IData) => void) | PartialObserver<IData>): Subscription {

        // may be need to auto register method?
        if (!_get(this.apiList, requestName)) {
            return;
        }

        return this.apiList[requestName].flow.subscribe(
            _isFunction(observer) ? {
                next: (response: IData) => {
                    observer(response);
                },
            } : observer);
    }

    /**
     * Reset API method
     *
     * @param requestName {string} name of registered method (system/name)
     */
    public reset(requestName: string): void {
        if (!_get(this.apiList, requestName)) {
            return;
        }
        this.apiList[requestName].subject.next(null);
    }

    /**
     * Get Observable of api method
     *
     * @param requestName {string} name of registered method (system/name)
     *
     * @return {Observable} An Observable of registered api method
     */
    public getMethodSubscribe(requestName: string): Observable<IData> {

        if (!_get(this.apiList, requestName)) {
            return;
        }
        return this.apiList[requestName].flow;
    }

    /**
     * Set socket url by socketsData from profile
     * @param socketsData
     */
    public setSocketUrl(socketsData?: ISocketsData): void {

        // TODO: just for test, remove after fundist & wlc_core release
        if (this.window.location.host.match(/localhost$/)
            || this.window.location.host.match(/^qa-/)
            || this.window.location.host.match(/qa\.egamings\.com$/)) {
            socketsData.server = 'wss://wsqa.egamings.com/ws';
        }

        const socketUrl = `${socketsData.server}?token=${socketsData.token}&api=${socketsData.api}`;

        if (this.socketUrl !== socketUrl) {
            if (this.socket) {
                this.socket.close();
            }

            this.socketUrl = socketUrl;
            this.socketConnect();
        }
    }

    /**
     * Request to the socket
     *
     * @param {string} method
     * @param {unknown} params
     *
     * @returns {number} requestId
     */
    public socketRequest(method: string, params?: unknown): number {
        const requestId = ++this.requestId;
        if (this.socketOpen) {
            this.socketRequest$(requestId, method, params);
        } else {
            this.addToSocketQueue(requestId, method, params);
        }
        return requestId;
    }

    /**
     * Close the socket
     */
    public closeSocket(): void {
        this.socket?.close();
        this.socketUrl = null;
    }

    /**
     * Add nonce to localstorage
     *
     *
     * @returns {void}
     */
    public setNonceToLocalStorage(): void {
        this.configService.set({
            name: 'X-Nonce',
            value: this.generateNonce(),
            storageType: 'localStorage',
        });
    }

    /**
     * Delete nonce from localstorage
     *
     * @returns {void}
     */
    public deleteNonceFromLocalStorage(): void {
        this.configService.set({
            name: 'X-Nonce',
            value: null,
            storageClear: 'localStorage',
        });
    }

    protected init(): void {
        if (this.socketUrl) {
            this.socketConnect();
        }
    }

    protected addToSocketQueue(requestId: number, method: string, params?: any) {
        this.socketQueue.push(
            {
                requestId,
                method,
                params,
            },
        );
    }

    protected processSocketQueue() {
        while (this.socketQueue.length) {
            const request = this.socketQueue.shift();
            this.socketRequest$(request.requestId, request.method, request.params);
        }
    }

    protected socketRequest$(requestId: number, method: string, params?: any): void {
        this.socket.send(JSON.stringify({
            requestId, method, params,
        }));
    }

    protected request$<T>(method: IRegisteredMethod, params?: RequestParamsType): Observable<IData | T> {
        if (!method.url && !method.fullUrl) {
            throw new Error(`request$: url or fullUrl are necessary on ${method.system}/${method.name}`);
        }

        const requestParams = _assign(
            {lang: this.translate.currentLang || 'en'},
            method.params,
            method.type === 'GET' ? params : {},
        );

        if (method.noUseLang) {
            delete requestParams.lang;
        }

        const requestBody = method.type !== 'GET' ? this.checkFormData(params) || '' : undefined;

        const url = method.fullUrl || this.urlPrefix + method.url;
        const cacheUrl = requestParams.lang ? `${url}|${requestParams.lang}` : url;

        const preloadData$: Observable<unknown> =
            (this.isRequestPreloaded(method))
                ? from(this.window.wlcPreload[method.preload])
                : of(undefined);
        if (!method.retries?.count) {
            _set(method, 'retries.count', [3000, 1000]);
        } else {
            method.retries.count = _reverse(method.retries.count);
        }
        let countLength = method.retries.count.length;
        let notCacheStaticData = true;

        return preloadData$.pipe(
            switchMap((result: IData) => {
                if (result) {
                    const items = result.data || result;
                    if (method.cache > 0) {
                        this.cachingService.set<T>(cacheUrl, items, false, method.cache, true);
                    }
                    return of(items);
                }
                return method.cache > 0 ? from(this.cachingService.get<T>(cacheUrl)) : of(undefined);
            }),
            switchMap((result: IData) => {
                return result
                    ? this.restorePreloadedData(method, result)
                    : this.httpRequest(method, url, requestParams, requestBody).pipe(
                        retryWhen((err: Observable<HttpErrorResponse>) => err.pipe(
                            mergeMap((error: HttpErrorResponse): Observable<HttpErrorResponse | never> => {
                                if (error.status.toString().startsWith('5') && countLength > 0) {
                                    countLength--;
                                    notCacheStaticData = true;
                                    return of(error).pipe(delay(method.retries.count[countLength]));
                                }

                                return throwError(error);
                            }),
                        ))).pipe(catchError((error: HttpErrorResponse): Observable<IData | never> => {

                        if (_isFunction(method.onError)) {
                            method.onError(error);
                        }

                        if (method.retries?.fallbackUrl) {
                            notCacheStaticData = false;
                            this.sendLog('0.0.14', method, error.message || error.status);

                            return this.httpRequest(
                                method,
                                method.retries.fallbackUrl,
                                requestParams,
                                requestBody,
                            ).pipe(
                                catchError((e: HttpErrorResponse): Observable<never> => {
                                    this.emitRequestFail('0.0.15', method, e);
                                    return throwError(e.error || e);
                                }),
                            );
                        }

                        this.emitRequestFail('0.0.15', method, error);
                        const errData: IData = {
                            name: method.name,
                            system: method.system,
                            status: 'error',
                            code: error.status,
                            errors: error.error,
                        };
                        this.flow$.next(errData);
                        method.subject?.next(errData);
                        return throwError(error.error || error);
                    }));
            }),
            map((data: IData): IData => {
                let responseData: IData;

                if (_get(data, 'status') && (_get(data, 'data') || _get(data, 'errors'))) {
                    responseData = data;
                    responseData.system = data.system || method.system;
                    responseData.name = data.name || method.name;
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
                    this.emitRequestFail('0.0.12', method, responseData.errors);
                    this.flow$.next(responseData);
                    method.subject.next(responseData);
                    throwError(responseData.errors);
                }
                return responseData;
            }),
            tap((data: IData) => {
                this.flow$.next(data);
                method.subject?.next(data);

                if (method.type === 'GET'
                    && method.cache > 0
                    && data.status === 'success'
                    && data.source !== 'cache'
                    && notCacheStaticData) {
                    this.cachingService.set<T>(cacheUrl, data.data, false, method.cache);
                }
            }),
            switchMap((data: IData) => {
                return from(new Promise(async (done) => {
                    if (data.status === 'success' && _isFunction(method.mapFunc)) {
                        data.data = method.mapFunc(data.data);

                        if (_isFunction(data.data?.then)) {
                            data.data = await data.data;
                        }
                    }

                    if (method.events?.success) {
                        this.eventService.emit({
                            name: method.events.success,
                            data,
                        });
                    }
                    done(data);
                }) as Promise<IData>);
            }),
        );
    }

    protected emitRequestFail(code: string, method: IRegisteredMethod, error: HttpErrorResponse | string[]): void {
        this.sendLog(code, method, _isArray(error) ? error : error.message);
        if (method.events?.fail) {
            this.eventService.emit({
                name: method.events.fail,
                data: _isArray(error) ? error : (error.error || error),
            });
        }
    }

    protected sendLog(code: string, method: IRegisteredMethod, error: unknown): void {
        const logObj: ILogObj = {
            code,
            flog: {
                request: `${method.system}.${method.name}`,
                errors: (typeof error === 'string') ? error : JSON.stringify(error),
            },
            from: {
                service: 'DataService',
                method: 'request$',
            },
        };

        this.logService.sendLog(logObj);
    }

    /**
     * Generate nonce string to idificate session
     *
     * @returns {string} nonce string
     */
    private generateNonce(): string {
        const inOptions: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let nonce: string = '';

        for (let i = 0; i < 16; i++) {
            nonce += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        }

        return nonce;
    }

    private isRequestPreloaded(method: IRegisteredMethod): boolean {
        return method.type === 'GET'
            && _has(this.window.wlcPreload, method.preload)
            && _get(this.window.wlcPreload, `${method.preload}['fulfilled']`, true);
    }

    private socketConnect(): void {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = () => {
            this.socketOpen = true;
            this.eventService.emit({
                name: 'SOCKET_CONNECT',
                status: 'success',
            });
            this.processSocketQueue();
            this.setSocketHandlers();
        };
    }

    private setSocketHandlers(): void {
        this.socket.addEventListener('close', () => {
            this.socketOpen = false;
            this.socket = null;
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
        this.socketUrl && setTimeout(() => {
            this.socketConnect();
        }, 5000);
    }

    private onSocketMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data);
            data.name = `${data.system}-${data.event}`;
            data.system = 'socket';
            this.flow$.next(data);
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

    private restorePreloadedData<T>(method: IRegisteredMethod, data: T): Observable<IData> {
        return of({
            status: 'success',
            name: method.name,
            system: method.name,
            source: 'cache',
            data,
        });
    }

    private checkFormData(params: RequestParamsType): string | FormData {
        if (params instanceof FormData) {
            return params;
        }
        return JSON.stringify(params);
    }

    private httpRequest(
        method: IRegisteredMethod,
        url: string,
        requestParams: {lang: string} & RequestParamsType,
        requestBody: string | FormData,
    ): Observable<IData> {
        return this.http.request<IData>(method.type, url, {
            params: requestParams,
            body: requestBody,
            withCredentials: true,
        });
    }
}
