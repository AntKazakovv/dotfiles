'use strict';

import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService, UIRouter} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {logTypes} from 'wlc-engine/modules/core/system/config/log-types';
import {SentryService} from 'wlc-engine/modules/core/system/services';

import {
    get as _get,
    set as _set,
    find as _find,
    findIndex as _findIndex,
    map as _map,
    reduce as _reduce,
    concat as _concat,
    isArray as _isArray,
    forEach as _forEach,
    isObject as _isObject,
    isString as _isString,
    extend as _extend,
} from 'lodash-es';

interface ILogTags {
    type: string;
    group?: string;
    project?: string;
    createTicket?: boolean;
}

export interface ILogObj {
    code: string;
    name?: string;
    data?: any;
    tags?: ILogTags;
    level?: string;
    logger?: string;
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
    private Flog = _get(window, 'WlcFlog', {});

    constructor(
        private configService: ConfigService,
        private sentryService: SentryService,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouter,
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
    public waiter(log: ILogObj, timeout: number = 3000): () => void {
        const start = () => {
            let res = () => {
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
            const element = document.querySelector(params.selector);
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
        logObj.level = logObj.level || 'error';
        logObj.logger = 'javascript';

        if (logTypes[logObj.code]) {
            logObj.name = logTypes[logObj.code].name;
            logObj.level = logTypes[logObj.code].level || logObj.level;
            logObj.tags = {
                type: logTypes[logObj.code].type,
                group: logTypes[logObj.code].group || 'default',
            };
            if (logTypes[logObj.code].createTicket) {
                logObj.tags.createTicket = true;
            }
        }

        if (!logObj.data) {
            logObj.data = {};
        }
        this.log(logObj);
    }

    /**
     * Prepare log info and send
     *
     * @param {ILogObj} logObj Log info
     */
    protected log(logObj: ILogObj): void {
        _set(logObj, 'data.mobile', this.configService.get<boolean>('appConfig.mobile'));

        if (this.Flog.enabled) {
            const code = _get(logObj, 'code', '0');
            const codeData = _get(logTypes, code, null);

            if (_get(codeData, 'method') === 'Flog' || _get(codeData, 'method') === 'Both') {
                const codeName = _get(logTypes, [code, 'name'], 'unknown error');
                const data = {
                    error: codeName,
                    data: _get(logObj, 'data', {}),
                };
                switch (_get(codeData, 'level', 'log')) {
                    case 'log':
                        this.Flog.log(code, data).finally();
                        break;
                    case 'error':
                        this.Flog.error(code, data).finally();
                        break;
                    case 'fatal':
                        this.Flog.fatal(code, data).finally();
                        break;
                }
                this.Flog.log(code, data).finally();
            }
        }
        if (this.sentryService.isInstall) {
            const tags: IIndexing<string> = _extend(logObj.tags || {},
                (logObj.code) ? {code: logObj.code} : {},
                (logObj.logger) ? {logger: logObj.logger} : {});
            const extData: IIndexing<any> = _extend(_isObject(logObj.data) ? logObj.data : {data: logObj.data});

            this.sentryService.sendMessage({
                tags: tags,
                level: logObj.level,
                message: logObj.name,
                data: extData,
                userInfo: {
                    // @TODO After creating of UserService
                    id: '-1',
                    //id: this.UserService.isAuthenticated() ? this.UserService.userProfile.idUser || 0 : '-1',
                    country: this.configService.get<string>('appConfig.siteconfig.country'),
                },
            });
        }
    }

}
