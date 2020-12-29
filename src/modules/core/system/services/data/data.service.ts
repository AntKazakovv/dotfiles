import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
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
} from 'rxjs';
import {
    map,
    switchMap,
    tap,
    filter,
    catchError,
} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {
    CachingService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {
    isString as _isString,
    get as _get,
    assign as _assign,
    isFunction as _isFunction,
    has as _has,
} from 'lodash';

import {ISocketsData} from 'wlc-engine/modules/core/system/interfaces';

export interface IData {
    status: 'success' | 'error';
    name: string;
    system: string;
    code?: string;
    errors?: string[];
    source?: string;
    data?: any;
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
    /** event for data request*/
    events?: {
        success?: string;
        fail?: string;
    }
}

interface IRegisteredMethod extends IRequestMethod {
    flow?: Observable<IData>;
    subject?: BehaviorSubject<IData>;
    intervalSubscribe?: Subscription;
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

    constructor(
        private injector: Injector,
        private http: HttpClient,
        private translate: TranslateService,
        private eventService: EventService,
        private cachingService: CachingService,
        private logService: LogService,
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
                tap(() => {
                    this.request$(this.apiList[name]).toPromise();
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
    public request<T>(request: string | IRequestMethod, params?: RequestParamsType): Promise<IData | T> {
        if (_isString(request)) {
            if (this.apiList[request]) {
                return this.request$<T>(this.apiList[request], params).toPromise();
            } else {
                return Promise.reject({
                    system: 'data',
                    name: request,
                    status: 'error',
                    code: '0.1.3',
                    errors: [
                        `Non configured request method ${request}`,
                    ],
                });
            }
        } else {
            return this.request$<T>(request, params).toPromise();
        }
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
            _isFunction(observer)
                ? {next: (response: IData) => {observer(response);}}
                : observer);
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

    public setSocketUrl(socketsData?: ISocketsData): void {
        if (this.socket) {
            this.socket.close();
        }

        //just for test
        socketsData.server = 'wss://wsqa.egamings.com/ws';

        this.socketUrl = `${socketsData.server}?token=${socketsData.token}&api=${socketsData.api}`;
        this.socketConnect();
    }

    protected init(): void {
        if (this.socketUrl) {
            this.socketConnect();
        }
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
        const requestBody = method.type !== 'GET' ? JSON.stringify(params) || '' : undefined;
        const url = method.fullUrl || this.urlPrefix + method.url;

        const preloadData$: Observable<IData> =
            (method.type === 'GET' && _has(globalThis.wlcPreload, method.preload))
                ? from(globalThis.wlcPreload[method.preload])
                : of(undefined);


        return preloadData$.pipe(
            switchMap((result: IData) => {
                if (result) {
                    return of(result);
                }
                return method.cache > 0 ? from(this.cachingService.unStashRequest<T>(url)) : of(undefined);
            }),
            switchMap((result: IData) => {
                return result
                    ? this.restoreCachedData(method, result)
                    : this.http.request<IData>(method.type, url, {
                        params: requestParams,
                        body: requestBody,
                        withCredentials: true,
                    }).pipe(catchError((error: HttpErrorResponse) => {
                        this.logService.sendLog(error.error || error);
                        if (method.events?.fail) {
                            this.eventService.emit({
                                name: method.events.fail,
                                data: error.error || error,
                            });
                        }
                        return throwError(error.error || error);
                    }));
            }),
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
                            errors: responseData.errors,
                        },
                    });
                    if (method.events?.fail) {
                        this.eventService.emit({
                            name: method.events.fail,
                            data: responseData.errors,
                        });
                    }
                    throwError(responseData.errors);
                }

                return responseData;
            }),
            tap((data: IData) => {
                this.flow$.next(data);
                method.subject?.next(data);

                if (method.type === 'GET' && method.cache > 0 && data.status === 'success' && data.source !== 'cache') {
                    this.cachingService.stashRequest<T>(url, data.data, method.cache);
                }
            }),
            map((data: any) => {
                if (data.status === 'success' && typeof method.mapFunc === 'function') {
                    data.data = method.mapFunc(data.data);
                }

                if (method.events?.success) {
                    this.eventService.emit({
                        name: method.events.success,
                        data,
                    });
                }
                return data;
            }),
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

    private restoreCachedData<T>(method: IRegisteredMethod, data: T): Observable<IData> {
        return of({
            status: 'success',
            name: method.name,
            system: method.name,
            source: 'cache',
            data,
        });
    }
}
