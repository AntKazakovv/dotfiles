import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    HttpClient,
    HttpParams,
    HttpErrorResponse,
    HttpHeaders,
    HttpResponse,
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
    timer,
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
import _reduce from 'lodash-es/reduce';

import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    ILogObj,
    LogService,
} from 'wlc-engine/modules/core/system/services/log/log.service';

import {
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';

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
    headers?: HttpHeaders;
}

export type RestMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ICacheOptions {
    /** Generate cache key using request params */
    includeRequestParams?: boolean;
    /** Cache key for save date */
    key?: string;
}

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
    cacheOptions?: ICacheOptions;
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
    /** request without credential */
    withoutCredential?: boolean;
    /** api version */
    apiVersion?: keyof typeof urlPrefixApi;
}

export const dataServiceHooks: IIndexing<string> = {
    requestData: 'dataService:requestMethod',
    requestSuccess: 'requestSuccess@DataService',
};

export interface IHookRequestData {
    request: IRequestMethod,
    params?: RequestParamsType,
}

interface IRegisteredMethod extends IRequestMethod {
    flow?: Observable<IData>;
    subject?: BehaviorSubject<IData>;
    intervalSubscribe?: Subscription;
}

interface IErrorReplacerParams {
    text: string;
    supportEmail?: boolean;
}

const urlPrefixApi = {
    1: '/api/v1',
    2: '/api/v2',
} satisfies Record<number, string>;

/**
 * Error replacer object, where:
 *
 * {key} - string, exact match with first string in error array
 * {value} - replace params:
 *     `text` - string, new text of the error;
 *     `supportEmail` - boolean, if `true` add support email ($base.contacts.email) to the end of the text.
 */
export type TErrorReplacerMap = Record<string, IErrorReplacerParams>;

@Injectable()
export class DataService {

    /** Observable flow of all api data */
    public get flow(): Observable<IData> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IData> = new Subject<IData>();
    private apiList: {[key: string]: IRegisteredMethod} = {};
    private pendingRequests: Map<string, Promise<unknown>> = new Map();
    private errorReplacerMap!: TErrorReplacerMap;

    constructor(
        private http: HttpClient,
        private translateService: TranslateService,
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
            dataServiceHooks.requestData,
            {
                request: requestMethod,
                params,
            },
        );

        const requestKey = `${method.request.url || method.request.fullUrl}|${JSON.stringify(method.params || {})}`;
        const pendingRequest = this.pendingRequests.get(requestKey) as Promise<IData | T>;

        if (pendingRequest) {
            return pendingRequest;
        }

        const requestPromise = firstValueFrom(this.request$<T>(method.request, method.params));
        this.pendingRequests.set(requestKey, requestPromise);

        requestPromise.finally(() => {
            this.pendingRequests.delete(requestKey);
        });

        return requestPromise;
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

    protected async init(): Promise<void> {
        await this.configService.ready;
        this.errorReplacerMap = this.configService.get<TErrorReplacerMap>('$base.errorsReplacerMap');
    }

    private cacheUrlWithParams(cacheUrl: string, params: RequestParamsType): string {
        let preparedParams: string[];
        if (params instanceof HttpParams) {
            const keys: string[] = params.keys();
            preparedParams = _reduce(keys, (result, key) => {
                const value = params.get(key);
                result.push(`${key}=${value}`);
                return result;
            }, []);
        } else {
            preparedParams = Object.entries(params).map(item => item.join('='));
        }

        return cacheUrl + '|' + preparedParams.join('&');
    }

    protected request$<T>(method: IRegisteredMethod, params?: RequestParamsType): Observable<IData | T> {
        if (!method.url && !method.fullUrl) {
            throw new Error(`request$: url or fullUrl are necessary on ${method.system}/${method.name}`);
        }

        const requestParams = _assign(
            {lang: this.translateService.currentLang || this.configService.get<string>('appConfig.language') || 'en'},
            method.params,
            method.type === 'GET' ? params : {},
        );

        if (method.noUseLang) {
            delete requestParams.lang;
        }

        const requestBody = method.type !== 'GET' ? this.checkFormData(params) || '' : undefined;

        const url = method.fullUrl || urlPrefixApi[method.apiVersion ?? 1] + method.url;
        let cacheUrl = requestParams.lang ? `${url}|${requestParams.lang}` : url;

        if (method.cacheOptions?.key) {
            cacheUrl = method.cacheOptions.key;
        }

        if (method.cacheOptions?.includeRequestParams && params) {
            cacheUrl = this.cacheUrlWithParams(cacheUrl, params);
        }

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
        let jwtRetriesCount = 1;
        let concurentRequestRetriesCount = 2;
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

                                if (error.status === 401
                                    && this.configService.get<boolean>('$base.site.useJwtToken')
                                ) {
                                    if (jwtRetriesCount > 0) {
                                        jwtRetriesCount--;

                                        const jwtRefreshToken: string = this.configService.get({
                                            name: 'jwtAuthRefreshToken',
                                            storageType: 'localStorage',
                                        });

                                        if (jwtRefreshToken) {

                                            return from(this.request({
                                                name: 'refreshJwtToken',
                                                system: 'user',
                                                url: '/auth/refreshToken',
                                                type: 'PUT',
                                                events: {
                                                    success: 'REFRESH_JWT_TOKEN',
                                                    fail: 'REFRESH_JWT_TOKEN_ERROR',
                                                },
                                            }, {token: jwtRefreshToken})).pipe(
                                                catchError((error) => {
                                                    if (error.errors?.includes('Concurent request')
                                                        && concurentRequestRetriesCount > 0
                                                    ) {
                                                        concurentRequestRetriesCount--;
                                                        jwtRetriesCount++;
                                                        return timer(500);
                                                    }

                                                    this.logService.sendLog({
                                                        code: '1.2.6.1',
                                                        flog: {
                                                            authToken: this.configService.get({
                                                                name: 'jwtAuthToken',
                                                                storageType: 'localStorage',
                                                            }),
                                                            refreshToken: this.configService.get({
                                                                name: 'jwtAuthRefreshToken',
                                                                storageType: 'localStorage',
                                                            }),
                                                        },
                                                    });
                                                    this.configService.updateJwtTokens(null, null);
                                                    this.eventService.emit({name: 'FORCE_LOGOUT'});
                                                    return throwError(error);
                                                }),
                                                map(() => error),
                                            );
                                        }
                                    }

                                    this.logService.sendLog({
                                        code: '1.2.6.2',
                                        flog: {
                                            authToken: this.configService.get({
                                                name: 'jwtAuthToken',
                                                storageType: 'localStorage',
                                            }),
                                            refreshToken: this.configService.get({
                                                name: 'jwtAuthRefreshToken',
                                                storageType: 'localStorage',
                                            }),
                                        },
                                    });
                                    this.configService.updateJwtTokens(null, null);
                                    this.eventService.emit({name: 'FORCE_LOGOUT'});
                                }
                                return throwError(error);
                            }),
                        )))
                        .pipe(catchError((error: HttpErrorResponse): Observable<HttpResponse<IData | never>> => {
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

                            this.replaceErrors(error);

                            const errData: IData = {
                                name: method.name,
                                system: method.system,
                                status: 'error',
                                code: error.status,
                                errors: error.error,
                            };
                            this.flow$.next(errData);
                            method.subject?.next(errData);
                            return throwError(errData.errors || error);
                        }));
            }),
            map((response: IData | HttpResponse<IData>): IData => {
                let data: IData;

                if (response instanceof HttpResponse && response.body) {
                    data = response.body;
                } else if ((response as IData).data) {
                    data = (response as IData).data;
                }

                let responseData: IData;

                if (_get(data, 'status') && (_get(data, 'data') || _get(data, 'errors'))) {
                    responseData = data;
                    responseData.system = data.system || method.system;
                    responseData.name = data.name || method.name;
                    responseData.headers = response.headers;
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
                            headers: response.headers,
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

                    data = await this.hooksService.run<IData>(dataServiceHooks.requestSuccess, data);

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
    ): Observable<HttpResponse<IData>> {
        return this.http.request<IData>(method.type, url, {
            params: requestParams,
            body: requestBody,
            withCredentials: !method.withoutCredential,
            observe: 'response',
        });
    }

    private replaceErrors(errResponse: HttpErrorResponse): void {
        let errorText!: IErrorReplacerParams;

        if (Array.isArray(errResponse.error?.errors)
            && (errorText = this.errorReplacerMap[errResponse.error.errors[0]])) {
            errResponse.error.errors = [this.createErrorMessage(errorText)];
        }
    };

    private createErrorMessage(replacer: IErrorReplacerParams): string {
        return this.translateService.instant(replacer.text)
            + (replacer.supportEmail
                ? ' ' + this.wrapEmail(this.configService.get('$base.contacts.email')) : '');
    }

    private wrapEmail(email: string): string {
        return `<a target="_blank" href="mailto:${email}">${email}</a>`;
    };
}
