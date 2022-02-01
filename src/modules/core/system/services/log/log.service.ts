'use strict';

import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {StateService, UIRouter} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    logTypes,
    TLogMethods,
    ILogType,
} from 'wlc-engine/shared-lib/log-types';
import {
    IIndexing,
} from 'wlc-engine/modules/core';
import {IFlogData, WlcFlog} from 'wlc-engine/system/inline/_flog';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import _merge from 'lodash-es/merge';
import _intersection from 'lodash-es/intersection';

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
}

interface IWaitElementParams {
    selector: string;
    logObj: ILogObj;
    minHeight?: number;
    timeout?: number;
}

interface IDurationWaiter {
    cancel: () => void;
    resolve: () => void;
}

interface IRequestLog {
    coreLog: ILogObj;
    networkLog: ILogObj;
    from: IFromLog;
    responseData: IData | unknown;
}

@Injectable()
export class LogService {
    private Flog: WlcFlog = _get(this.window, 'WlcFlog', {}) as WlcFlog;

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouter,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
    }

    /**
     * Set duration waiter
     *
     * @param {ILogObj} log Log info
     * @param {number} threshold Thresold before send log
     * @returns {IDurationWaiter} Waiter
     */
    public durationWaiter(log: ILogObj, threshold: number = 30): IDurationWaiter {
        const init = () => {
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
                if (!log.data) {
                    log.data = {};
                }
                log.data.duration = (Date.now() - startTime) / 1000;
                this.sendLog(log);
            }, () => {
                clearInterval(timeoutHandler);
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
     * Set waiter, wich will send log after timeout
     *
     * @param {ILogObj} log Log info
     * @param {number} timeout Timeout in milliseconds
     * @returns {() => void} Handler to prevent send log
     */
    public waiter(log: ILogObj, timeout: number = 3000): (v?: unknown) => void {
        const start = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let res = (v?: unknown): void => {
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
            if (!element) {
                this.sendLog(params.logObj);
            } else {
                if (params.minHeight && element.getBoundingClientRect().height <= params.minHeight) {
                    this.sendLog(params.logObj);
                }
            }
        }, params.timeout || 5000);

        const destroyListener = this.router.transitionService.onStart({}, () => {
            stopTimeout();
        });

        const stopTimeout = () => {
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
    public sendLog(logObj: ILogObj): void {
        const defaultLog = _get(logTypes, logObj.code);
        if (!defaultLog) {
            // TODO Warning about empty code
            return;
        }

        const isMethod = (item: TLogMethods): boolean => {
            return !!_intersection(defaultLog.method, [item, 'all']).length;
        };

        _merge(logObj, defaultLog);
        logObj.level = logObj.level || 'log';

        if (
            this.Flog.enabled
            && (
                !defaultLog.method // Using Flog as a default log method
                || isMethod('flog')
            )
        ) {
            this.sendFlog(logObj);
        }
        if (
            isMethod('console')
            || (['error', 'fatal'].includes(defaultLog.level)
                && (
                    this.window['WLC_ENV']
                    || (!this.window['WLC_ENV'] && this.document.cookie.indexOf('flog=') !== -1)
                )
            )
        ) {
            // eslint-disable-next-line no-console
            console.error(`${logObj.code} ${logObj.level}:`, logObj);
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

    protected sendFlog(logObj: ILogObj): void {
        const _logObj: ILogObj = _cloneDeep(logObj);
        _logObj.flog = _logObj.flog || {};
        _logObj.flog.mobile = this.configService.get<boolean>('appConfig.mobile');

        switch (_get(_logObj, 'durationType')) {
            case 'fromStart':
                _logObj.flog.duration = (new Date().getTime() - this.Flog.startTime.getTime()) / 1000;
                break;
            default:
                break;
        }
        const flogData: IFlogData = {
            code: _logObj.code,
            level: _logObj.level,
            ..._get(_logObj, 'flog'),
        };
        if (logObj.from) {
            flogData.from = logObj.from;
        }
        if (logObj.data?.duration && !logObj.flog?.duration) {
            flogData.duration = logObj.data.duration;
        }
        this.Flog.send(flogData).finally();
    }
}
