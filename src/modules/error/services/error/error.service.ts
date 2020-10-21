'use strict';

import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService, UIRouter} from '@uirouter/core';
import {Location} from '@angular/common';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/interfaces';
import {errorTypes} from 'wlc-engine/modules/error/config/error-types';

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
} from 'lodash';

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

export interface IErrorMessage {
    title?: string;
    textData?: string | string[];
    errorCode?: string;
    wlcElement?: string;
    toState?: string;
    stateParams?: any;
    tag?: string;
    type?: string;
}

interface IErrorPageNotFound {
    toState?: string;
    fromState?: string;
    stateParams?: any;
    caller?: string;
    errorType?: string;
}

interface IWaitElementParams {
    selector: string;
    logObj: ILogObj;
    minHeight?: number;
    timeout?: number;
}

// @TODO after creating of Modals
// interface IModalScope extends IScope {
//     title?: string;
//     errors?: string[];
//     tag?: string;
//     type?: string;
//     go?(toState: string, stateParams: {[key: string]: any}): Promise<any>;
// }

interface IDurationWaiter {
    cancel: () => void;
    resolve: () => void;
}

@Injectable()
export class ErrorService {
    private Sentry = window['Sentry'];
    private Flog = _get(window, 'WlcFlog', {});

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouter,
        private location: Location,
    ) {
    }

    /**
     * Set duration waiter
     *
     * @param {ILogObj} error Error info
     * @param {number} threshold Thresold before send log
     * @returns {IDurationWaiter} Waiter
     */
    public durationWaiter(error: ILogObj, threshold: number = 30): IDurationWaiter {
        const init = () => {
            threshold = _get(errorTypes[error.code], 'threshold', threshold);

            const startTime = Date.now(),
                timeout = threshold * 1000;

            let resolveFunc: (value?: any) => void,
                rejectFunc: (reason?: any) => void,
                timeoutHandler: number;

            const waiter: IDurationWaiter = {
                cancel: () => {
                    rejectFunc(error);
                },
                resolve: () => {
                    resolveFunc(error);
                }
            };

            new Promise((resolve, reject) => {
                resolveFunc = resolve;
                rejectFunc = reject;
            }).then(() => {
                if (!error.data) {
                    error.data = {};
                }
                error.data.duration = (Date.now() - startTime) / 1000;
                this.logError(error);
            }, () => {
                clearInterval(timeoutHandler);
                window.removeEventListener('onbeforeunload', waiter.resolve);
                window.removeEventListener('pagehide', waiter.resolve);
            });

            timeoutHandler = window.setTimeout(() => {
                resolveFunc(error);
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
     * @param {ILogObj} error Error info
     * @param {number} timeout Timeout in milliseconds
     * @returns {() => void} Handler to prevent send log
     */
    public waiter(error: ILogObj, timeout: number = 3000): () => void {
        const start = () => {
            let res = () => {
            };
            new Promise((resolve, reject) => {
                res = resolve;
                setTimeout(() => {
                    reject(error);
                }, timeout);
            }).then(null, (result) => {
                this.logError(result);
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
                this.logError(params.logObj);
            } else {
                if (params.minHeight && element.getBoundingClientRect().height <= params.minHeight) {
                    this.logError(params.logObj);
                }
            }
        }, params.timeout || 5000);

        const destroyListener =this.router.transitionService.onStart({}, (transition) => {
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
     * Cause the situation 'Page not found'
     *
     * @param {IErrorPageNotFound} data
     * @param {string} errorCode
     */
    public pageNotFound(data: IErrorPageNotFound, errorCode = '6.0.0'): void {
        const params = _extend({
            message: gettext('Could not find a state associated with url') + ` "${this.location.path}"`,
            title: gettext('Page not found')
        }, data);
        const errorData: ILogObj = {
            code: errorCode,
            data: _extend({
                caller: 'unknown',
                errorType: 'common',
                requestUrl: this.location.path
            }, data),
            name: errorTypes[errorCode].name,
            tags: {
                type: errorTypes[errorCode].type,
                group: errorTypes[errorCode].group
            },
        };
        this.logError(errorData);
        this.stateService.go('app.error', params);
    }

    /**
     * Log error
     *
     * @param {ILogObj} logObj Log info
     */
    public logError(logObj: ILogObj): void {
        logObj.level = logObj.level || 'error';
        logObj.logger = 'javascript';

        if (errorTypes[logObj.code]) {
            logObj.name = errorTypes[logObj.code].name;
            logObj.level = errorTypes[logObj.code].level || logObj.level;
            logObj.tags = {
                type: errorTypes[logObj.code].type,
                group: errorTypes[logObj.code].group || 'default'
            };
            if (errorTypes[logObj.code].createTicket) {
                logObj.tags.createTicket = true;
            }
        }

        if (!logObj.data) {
            logObj.data = {};
        }
        this.log(logObj);
    }


    /**
     *  @TODO after creating of Modals
     *
     * Show error modal
     *
     * @param {string[] | string | IErrorMessage | errorCode: string} errorData ErrorData
     * @param {string} title title
     * @param {string} toState toState
     * @param {any} stateParams stateParams
     * @param {string} tag tag
     * @param {string} type type
     * @returns {IModalInstanceService} IModalInstanceService
     *
     * @description
     *
     * show modal with error
     *
     * @example
     * <pre>
     *  errorService.showModal('0.1.1');
     *  errorService.showModal('Error Message', 'Error Title', 'app.home', {});
     *  errorService.showModal({
     *      title: 'Error Title',
     *      textData: 'Error Message',
     *      tag: 'modal_error_tag',
     *      type: 'error'
     *  });
     * </pre>
     */
    // public showModal(
    //     errorData?: string[] | string | IErrorMessage,
    //     title?: string,
    //     toState?: string,
    //     stateParams?: any,
    //     tag?: string,
    //     type?: string
    // ): IModalInstanceService {
    //     const $scope: IModalScope = this.$rootScope.$new();
    //
    //     $scope.tag = tag || 'modal_error';
    //     $scope.type = type || 'error';
    //
    //     if (_isString(errorData)) {
    //
    //         if (errorTypes[errorData]) {
    //             $scope.title = errorTypes[errorData].name || title || this.gettextCatalog.getString('Error!');
    //             $scope.errors = [errorTypes[errorData].description];
    //             $scope.tag = _toLower(errorTypes[errorData].type) || 'modal_error';
    //             $scope.type = errorTypes[errorData].level || 'modal_error';
    //         } else {
    //             $scope.title = title || this.gettextCatalog.getString('Error!');
    //             $scope.errors = this.prepareErrorData(errorData);
    //         }
    //     } else if (_isArray(errorData)) {
    //         $scope.title = title || this.gettextCatalog.getString('Error!');
    //         $scope.errors = this.prepareErrorData(errorData);
    //     } else {
    //         toState = _get(errorData, 'toState');
    //         stateParams = _get(errorData, 'stateParams');
    //
    //         if (_get(errorData, 'errorCode') && errorTypes[errorData.errorCode]) {
    //             $scope.title = errorTypes[errorData.errorCode].name;
    //             $scope.errors = [errorTypes[errorData.errorCode].description];
    //
    //             $scope.tag = _toLower(_get(errorTypes[errorData.errorCode], 'tag',
    //                 `modal_error_${errorData.errorCode}`.replace('.', '-')));
    //             $scope.type = _get(errorTypes[errorData.errorCode], 'type', 'error');
    //         }
    //
    //         $scope.title = _get(errorData, 'title', $scope.title) || this.gettextCatalog.getString('Error!');
    //         $scope.errors = this.prepareErrorData(_get(errorData, 'textData', $scope.errors));
    //         $scope.tag = _toLower(_get(errorData, 'tag', $scope.tag)) || 'modal_error';
    //         $scope.type = _toLower(_get(errorData, 'type', $scope.type)) || 'error';
    //     }
    //
    //     const options = _extend({scope: $scope}, this.wlcModalRegistryProvider.get('errorModal'));
    //     const modal: IModalInstanceService = this.ModalService.showDialog(options) as IModalInstanceService;
    //
    //     modal.result.finally(() => {
    //         if (toState) {
    //             this.$state.go(toState, stateParams);
    //         }
    //     });
    //     return modal;
    // }

    /**
     * Prepare log info
     *
     * @param {ILogObj} logObj Log info
     */
    protected log(logObj: ILogObj): void {
        _set(logObj, 'data.mobile', this.configService.appConfig.mobile);

        if (this.Flog.enabled) {
            const code = _get(logObj, 'code', '0');
            const codeData = _get(errorTypes, code, null);

            if (_get(codeData, 'method') === 'Flog' || _get(codeData, 'method') === 'Both') {
                const codeName = _get(errorTypes, [code, 'name'], 'unknown error');
                const data = {
                    error: codeName,
                    data: _get(logObj, 'data', {})
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
        if (_get(window, 'wlcSentryConfig.isInstall')) {
            const tags: IIndexing<string> = _extend(logObj.tags || {},
                (logObj.code) ? {code: logObj.code} : {},
                (logObj.logger) ? {logger: logObj.logger} : {});
            const extData: IIndexing<any> = _extend(_isObject(logObj.data) ? logObj.data : {data: logObj.data});
            this.sentryLog(tags, extData, logObj.name, logObj.level);
        }
    }

    /**
     * Prepare error data
     *
     * @param {string[] | string} errorData
     * @returns {string[]}
     */
    protected prepareErrorData(errorData: string[] | string): string[] {
        const result: string[] = [];
        if (_isArray(errorData)) {
            _forEach(errorData, (value: string): void => {
                if (_isString(value)) {
                    result.push(value);
                }
            });
        } else if (_isString(errorData)) {
            result.push(errorData);
        } else {
            result.push(this.translateService.instant(gettext('Something went wrong. Please try again later.')));
        }
        return _map(result, (message) => message.replace(/<[^>]+>/g, ''));
    }

    /**
     * Send sentry log
     *
     * @param {any} tags Tags
     * @param {any} extData Additional data
     * @param {string} name Log name
     * @param {string} level Log level
     */
    protected sentryLog(
        tags: IIndexing<string>,
        extData: IIndexing<any>,
        name: string,
        level: string,
    ): void {
        this.Sentry.withScope((scope) => {
            scope.setTags(tags);
            scope.setExtras(extData);
            scope.setUser({
                // @TODO After creating of UserService
                id: -1,
                //id: this.UserService.isAuthenticated() ? this.UserService.userProfile.idUser || 0 : '-1',
                country: this.configService.appConfig.siteconfig.country,
            });
            this.Sentry.captureMessage(name, this.Sentry.Severity.fromString(level || 'info'));
        });
    }
}
