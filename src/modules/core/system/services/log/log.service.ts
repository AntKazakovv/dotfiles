'use strict';

import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {StateService, UIRouter} from '@uirouter/core';
import {
    ConfigService,
    logTypes,
    TLogMethods,
    ILogType,
} from 'wlc-engine/modules/core';
import {WlcFlog} from 'wlc-engine/system/inline/_flog';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import _merge from 'lodash-es/merge';

export interface ILogObj<T = any> extends ILogType {
    code: string;
    data?: T;
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

@Injectable()
export class LogService {
    private Flog: WlcFlog = _get(window, 'WlcFlog', {}) as WlcFlog;

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouter,
        @Inject(DOCUMENT) protected document: HTMLDocument,
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
                window.removeEventListener('onbeforeunload', waiter.resolve);
                window.removeEventListener('pagehide', waiter.resolve);
            });

            timeoutHandler = window.setTimeout(() => {
                resolveFunc(log);
            }, timeout);

            window.addEventListener('onbeforeunload', waiter.resolve);
            window.addEventListener('pagehide', waiter.resolve);
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
            let res = (v: unknown) => {
            };
            new Promise((resolve, reject) => {
                res = resolve;
                setTimeout(() => {
                    reject(log);
                }, timeout);
            }).then(null, (result) => {
                this.sendLog(result);
            });
            window.addEventListener('onbeforeunload', res);
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

        const destroyListener = this.router.transitionService.onStart({}, (transition) => {
            stopTimeout();
        });

        const stopTimeout = () => {
            clearTimeout(timeoutHandler);
            destroyListener();
            window.removeEventListener('onbeforeunload', stopTimeout);
        };
        window.addEventListener('onbeforeunload', stopTimeout);
        return stopTimeout;
    }

    /**
     * Log error
     *
     * @param {ILogObj} logObj Log info
     */
    public sendLog(logObj: ILogObj): void {
        const defaultLog = _get(logTypes, logObj.code),
            isMethod = (item: TLogMethods) => defaultLog.method?.includes(item);
        if (!defaultLog) {
            // TODO Warning about empty code
            return;
        }
        _merge(logObj, defaultLog);
        logObj.level = logObj.level || 'log';
        // Using Flog as default log method
        // eslint-disable-next-line sonarjs/no-collapsible-if
        if (!defaultLog.method || isMethod('flog') || isMethod('all')) {
            if (this.Flog.enabled) {
                this.sendFlog(logObj);
            }
        }
        if (isMethod('console') || isMethod('all')) {
            this.consoleLog(logObj);
        }
    }

    protected sendFlog(logObj: ILogObj): void {
        const _logObj: ILogObj = _cloneDeep(logObj);
        _set(_logObj, 'data.mobile', this.configService.get<boolean>('appConfig.mobile'));

        switch (_get(_logObj, 'durationType')) {
            case 'fromStart':
                _logObj.data.duration = (new Date().getTime() - this.Flog.startTime.getTime()) / 1000;
                break;
            default:
                break;
        }

        this.Flog.send({
            code: _logObj.code,
            level: _logObj.level,
            ..._get(_logObj, 'data', {}),
        }).finally();
    }

    protected consoleLog(logObj: ILogObj): void {
        // eslint-disable-next-line no-console
        console.log(`Log ${logObj.code}:`, logObj);
    }
}
