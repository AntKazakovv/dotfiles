'use strict';

import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UIRouter} from '@uirouter/core';

import {Subject} from 'rxjs';
import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import _intersection from 'lodash-es/intersection';
import _merge from 'lodash-es/merge';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    consoleLogProdCookie,
    defaultConsoleLogLevels,
    defaultLogLevel,
    defaultLogMethods,
    ILogType,
    logTypes,
    TLogMethods,
} from 'wlc-engine/modules/core/system/config/log-types';
import {IIndexing} from 'wlc-engine/modules/core';
import {IFlogData, WlcFlog} from 'wlc-engine/system/inline/_flog';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

export interface IFromLog {
    service?: string;
    method?: string;
    model?: string;
    parentModel?: string;
    helper?: string;
    component?: string;
    pipe?: string;
    directive?: string;
    interceptor?: string;
}

export type TLogObjFlog = IIndexing<string | number | boolean>;

export interface ILogObj<T = any> extends ILogType {
    code: string;
    data?: T;
    flog?: TLogObjFlog;
    from?: IFromLog;
    isSiteCached?: boolean;
    siteOpenedFromHome?: boolean;
}

export interface IWaitElementParams {
    selector: string;
    logObj: ILogObj;
    minHeight?: number;
    timeout?: number;
}

export interface IDurationWaiter {
    cancel: () => void;
    resolve: () => void;
}

export type TWaiter = (v?: unknown) => void;

interface IRequestLog {
    coreLog: ILogObj;
    networkLog: ILogObj;
    from: IFromLog;
    responseData: IData | unknown;
}

@Injectable()
export class LogService {
    public sendLog$: Subject<IFlogData> = new Subject<IFlogData>();

    private isGamesCached: boolean = false;
    private Flog: WlcFlog = _get(this.window, 'WlcFlog', {}) as WlcFlog;

    constructor(
        private configService: ConfigService,
        private router: UIRouter,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    /**
     * Set duration waiter
     *
     * @param {ILogObj} log Log info
     * @param {number} threshold Thresold before send log
     * @returns {IDurationWaiter} Waiter
     */
    public durationWaiter(log: ILogObj, threshold: number = 30): IDurationWaiter {
        const init = (): IDurationWaiter => {
            threshold = _get(logTypes[log.code], 'threshold', threshold);

            const startTime = Date.now(),
                timeout = threshold * 1000;

            let resolveFunc: (value?: any) => void,
                rejectFunc: (reason?: any) => void,
                timeoutHandler: number;

            const waiter: IDurationWaiter = {
                cancel: () => {
                    rejectFunc(log);
                },
                resolve: () => {
                    resolveFunc(log);
                },
            };

            new Promise((resolve, reject) => {
                resolveFunc = resolve;
                rejectFunc = reject;
            }).then(() => {
                clearTimeout(timeoutHandler);
                if (!log.data) {
                    log.data = {};
                }
                log.data.duration = (Date.now() - startTime) / 1000;
                this.sendLog(log);
            }, () => {
                clearTimeout(timeoutHandler);
                this.window.removeEventListener('onbeforeunload', waiter.resolve);
                this.window.removeEventListener('pagehide', waiter.resolve);
            });

            timeoutHandler = this.window.setTimeout(() => {
                resolveFunc(log);
            }, timeout);

            this.window.addEventListener('onbeforeunload', waiter.resolve);
            this.window.addEventListener('pagehide', waiter.resolve);
            return waiter;
        };
        return init();
    }

    /**
     * Set waiter, which will send log after timeout
     *
     * @param {ILogObj} log Log info
     * @param {number} timeout Timeout in milliseconds
     * @returns {() => void} Handler to prevent send log
     */
    public waiter(log: ILogObj, timeout: number = 3000): TWaiter {
        const start = (): TWaiter => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let res: TWaiter = (v?: unknown): void => {
            };
            new Promise((resolve, reject) => {
                res = resolve;
                setTimeout(() => {
                    reject(log);
                }, timeout);
            }).then(null, (result) => {
                this.sendLog(result);
            });
            this.window.addEventListener('onbeforeunload', res);
            return res;
        };
        return start();
    }

    /**
     * Wait for element
     *
     * @param {IWaitElementParams} params Params for wait
     * @returns {() => void} Handler to prevent send log
     */
    public waitForElement(params: IWaitElementParams): () => void {
        const timeoutHandler = setTimeout(() => {
            const element = this.document.querySelector(params.selector);
            if (!element ||
                (params.minHeight && params.minHeight > element.getBoundingClientRect().height)
            ) {
                this.sendLog(params.logObj);
            }
        }, params.timeout || 5000);

        const destroyListener = this.router.transitionService.onStart({}, () => {
            stopTimeout();
        });

        const stopTimeout = (): void => {
            clearTimeout(timeoutHandler);
            destroyListener();
            this.window.removeEventListener('onbeforeunload', stopTimeout);
        };
        this.window.addEventListener('onbeforeunload', stopTimeout);
        return stopTimeout;
    }

    /**
     * Send log
     *
     * @param {ILogObj} logObj Log info
     */
    public sendLog(logObj: ILogObj, useAdvancedMetrics?: boolean): void {
        const defaultLog = _get(logTypes, logObj.code);
        if (!defaultLog) {
            // TODO Warning about empty code
            return;
        }

        const isMethod = (item: TLogMethods): boolean => {
            return !!_intersection(resultLog.method, [item, 'all']).length;
        };

        const resultLog: ILogObj = _cloneDeep(logObj);

        _merge(resultLog, defaultLog);
        resultLog.level = resultLog.level || defaultLogLevel;
        resultLog.method = resultLog.method || defaultLogMethods;

        if (useAdvancedMetrics && this.configService.get('$base.monitoring.loggingLoadedSections.use')) {
            const siteOpenedFromHomePage = this.configService.get(
                {name: 'siteOpenedFromHomePage', storageType: 'localStorage'},
            );

            Object.assign(resultLog, {
                isSiteCached: this.isGamesCached,
                siteOpenedFromHome: siteOpenedFromHomePage,
            });

            if (!resultLog.durationType) {
                resultLog.durationType = 'fromStart';
            }
        }

        if (this.Flog.enabled && isMethod('flog')) {
            this.sendFlog(resultLog);
        }
        if (
            isMethod('console')
            || (defaultConsoleLogLevels.includes(resultLog.level)
                && (
                    this.window['WLC_ENV']
                    || (!this.window['WLC_ENV'] && this.document.cookie.includes(consoleLogProdCookie))
                )
            )
        ) {
            console.error(`${resultLog.code} ${resultLog.level}:`, resultLog);
        }
    }

    public sendRequestLog(params: IRequestLog): void {
        let logObj: ILogObj;
        if (_get(params.responseData, 'status') === 'error') {
            logObj = _merge<ILogObj, Partial<ILogObj>>(
                params.coreLog,
                {
                    from: params.from,
                    flog: {message: (_get(params.responseData, 'errors', ''))},
                },
            );
        } else {
            logObj = _merge<ILogObj, Partial<ILogObj>>(params.networkLog, {from: params.from});
        }
        this.sendLog(logObj);
    }

    private init(): void {
        this.isGamesCached = !!this.window.localStorage.getItem(
            `ngx-webstorage|/api/v1/games|${this.configService.get<string>('appConfig.language') || 'en'}`,
        );

        setTimeout(() => {
            if (this.configService.get('$base.monitoring.loggingLoadedFullSite')) {
                this.window.onload = () => {
                    this.sendLog({
                        code: '33.0.0',
                        isSiteCached: this.isGamesCached,
                    });
                };
            }
        });
    }

    private sendFlog(logObj: ILogObj): void {
        const resultLog: ILogObj = _cloneDeep(logObj);
        resultLog.flog = resultLog.flog || {};
        resultLog.flog.mobile = this.configService.get<boolean>('appConfig.mobile');

        switch (_get(resultLog, 'durationType')) {
            case 'fromStart':
                resultLog.flog.duration = (new Date().getTime() - this.Flog.startTime.getTime()) / 1000;
                break;
            default:
                break;
        }

        const flogData: IFlogData = {
            code: resultLog.code,
            level: resultLog.level,
            ..._get(resultLog, 'flog'),
        };

        if (typeof (resultLog.isSiteCached) !== 'undefined') {
            flogData.isSiteCached = resultLog.isSiteCached;
        }

        if (typeof (resultLog.siteOpenedFromHome) !== 'undefined') {
            flogData.siteOpenedFromHome = resultLog.siteOpenedFromHome;
        }

        if (resultLog.from) {
            flogData.from = resultLog.from;
        }
        if (resultLog.data?.duration && !resultLog.flog?.duration) {
            flogData.duration = resultLog.data.duration;
        }

        if (this.sendLog$.observers.length) {
            this.sendLog$.next(flogData);
        }

        this.Flog.send(flogData).finally();
    }
}
