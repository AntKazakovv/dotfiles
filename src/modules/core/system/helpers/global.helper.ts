import {
    APP_INITIALIZER,
    Type,
    Provider,
} from '@angular/core';
import {
    fromEvent,
    fromEventPattern,
    Observable,
} from 'rxjs';
import {
    DateTime,
    DateTimeOptions,
} from 'luxon';

import {
    IComponentParams,
    IDisplayConfig,
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {ConfigService} from 'wlc-engine/modules/core';
import {sanitizeHTMLTags} from 'wlc-engine/modules/core/constants/regexp.constants';
import {environment} from 'wlc-engine/system/environments/environment';

import _size from 'lodash-es/size';
import _each from 'lodash-es/each';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _mergeWith from 'lodash-es/mergeWith';
import _isUndefined from 'lodash-es/isUndefined';
import _keys from 'lodash-es/keys';
import _reduce from 'lodash-es/reduce';
import _assign from 'lodash-es/assign';
import _reverse from 'lodash-es/reverse';
import _replace from 'lodash-es/replace';

interface IParams extends IComponentParams<string, string, string> {
    noContent?: IIndexing<INoContentCParams> | IIndexing<IIndexing<INoContentCParams>>,
}

export class GlobalHelper {
    public static mobileAppConfig: TMobileApp = environment.mobileApp;

    public static mobileAppApiUrl: string = environment.mobileApp?.apiUrl;

    // eslint-disable-next-line no-restricted-globals
    public static mobileAppIosPlatform: boolean = window.cordova?.platformId === 'ios';

    // eslint-disable-next-line no-restricted-globals
    public static mobileAppAndroidPlatform: boolean = window.cordova?.platformId === 'android';

    // eslint-disable-next-line no-restricted-globals
    public static mobileAppBrowserPlatform: boolean = window.cordova?.platformId === 'browser';

    public static gettext<T>(content: T): T {
        return content;
    }

    public static getTemplates(templates: string[]): string {
        return ((): string => {
            return templates.join('');
        })();
    }

    public static deepFreeze<T>(target: T): T {
        Object.freeze(target);

        Object.getOwnPropertyNames(target).forEach((prop: string): void => {
            if (target.hasOwnProperty(prop)
                && target[prop] !== null
                && (typeof target[prop] === 'object' || typeof target[prop] === 'function')
                && !Object.isFrozen(target[prop])
            ) {
                this.deepFreeze(target[prop]);
            }
        });

        return target;
    }

    public static randomNumber(min: number, max: number): number {
        return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    }

    public static getModalMessages(errors: string[], title?: string): string[] {
        const messages = title ? [title] : [];
        if (errors) {
            _each(errors, (error: string) => {
                messages.push(error);
            });
        }
        return messages;
    }

    /**
     * Sort items by number value of their some property
     *
     * @param {T[]} items Items for sort.
     * @param {string} attr Property of item with number value.
     * @param {boolean} orderByAsc Sort ascending.
     * @returns {T[]} Sorted items
     */
    public static sortByNumber<T>(items: T[], attr: string, orderByAsc = true): T[] {
        if (!_size(items) || !attr) {
            return items;
        }
        return items.sort((a: T, b: T): number => {
            return orderByAsc ? _get(a, attr, 0) - _get(b, attr, 0) : _get(b, attr, 0) - _get(a, attr, 0);
        });
    }

    /**
     * Sort items by order of their some property
     *
     * @param {T[]} items Items for sort.
     * @param {A[]} order Order for sorting.
     * @param {string} attr Get access for object props if it is necessary.
     * @returns {T[]} Sorted items
     */
    public static sortByOrder<T, A>(items: T[] = [], order: A[], attr?: string): T[] {
        if (!_size(items) || !_size(order)) {
            return items;
        }

        const orderReverse = _reverse(order.slice());

        return items.sort((a: T | A, b: T | A): number => {
            if (attr) {
                b = _get(b, attr);
                a = _get(a, attr);
            }
            return orderReverse.indexOf(b as A) - orderReverse.indexOf(a as A);
        });
    }


    public static getOwnProperty(object: any, key: string): any {
        return Object.getOwnPropertyDescriptor((object).__proto__, key);
    }

    /**
     * @ngdoc method
     * @name mergeConfig
     * @param {T} engineConfig default module config
     * @param {T} projectConfig custom project config
     * @returns {T} merged config
     * @description
     *
     * prepare module config helper
     */
    public static mergeConfig<T>(engineConfig: T, projectConfig: Partial<T>): T {
        return _mergeWith(engineConfig, projectConfig, (objValue, srcValue) => {
            if (_isArray(objValue)) {
                return srcValue;
            }
        });
    }

    /**
     * @description
     *
     * Bootstraps given providers on app init.
     *
     * Note: You still have to provide it in providers.
     *
     * Note: Providers are bootstrapped before ApplicationRef is created
     * so you cannot inject it during service creation.
     *
     * **TRY TO AVOID IT**
     *
     * @param providers providers that should be bootstrapped
     */
    public static bootstrapProviders(...providers: Type<unknown>[]): Provider {
        return {
            provide: APP_INITIALIZER,
            useFactory: () => () => null,
            deps: providers,
            multi: true,
        };
    }

    public static parseHtmlSafely(htmlTemplate: string): string {
        const html = new DOMParser().parseFromString(htmlTemplate, 'text/html');

        return new XMLSerializer().serializeToString(html);
    }

    /**
     * @ngdoc method
     * @name prepareParams
     * @param {unknown} instance of class
     * @param {string[]} inputProperties array of @Input properties
     * @returns {T} inline params
     * @description
     *
     * prepare component params
     */
    public static prepareParams<T>(instance: unknown, inputProperties: string[] = []): T {
        const inlineParams: any = _mergeWith({
            common: {},
        }, instance['inlineParams'] || {});

        _each(inputProperties, property => {
            if (!_isUndefined(_get(instance, property))) {
                inlineParams.common[property] = _get(instance, property);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    /**
     * Converts string to snakeCase. One or multiple spaces are replaced with underscores, parentheses are removed.
     * @ngdoc method
     * @name toSnakeCase
     * @param {string} name - The string to convert.
     * @returns The snake cased string.
     */
    public static toSnakeCase(name: string): string {
        return name.toLowerCase().replace(/[^\dA-z]/ig, '_');
    }

    /**
     * Creates cross browser mediaQuery observer. (fix for old safari. addListener is deprecated!!)
     * @param mql - MediaQueryList
     * @returns observable media query
     */
    public static mediaQueryObserver(mql: MediaQueryList): Observable<MediaQueryListEvent> {
        return mql.addEventListener ? fromEvent<MediaQueryListEvent>(mql, 'change') :
            fromEventPattern<MediaQueryListEvent>(
                mql.addListener.bind(mql),
                mql.removeListener.bind(mql),
            );
    }

    /**
     * Return true if list of elements has resize display params
     *
     * @param elementList - List of elements with display params
     * @returns boolean flag
     */
    public static hasDisplayResize<T>(elementList: ({display?: IDisplayConfig} & T)[]): boolean {
        return _reduce(elementList, (res, element): boolean => {
            return res || (!!element.display?.after || !!element.display?.before);
        }, false);
    }

    /**
     * Override list of elements with usettled before/after display params
     *
     * @param elementList - List of elements with display params
     */
    public static overrideDisplayResize<T>(elementList: ({display?: IDisplayConfig} & T)[]): void {
        _each(elementList, (component, key) => {
            if (_isUndefined(component.display?.before)) {
                _assign(elementList[key].display, {before: 999999999});
            }

            if (_isUndefined(component.display?.after)) {
                _assign(elementList[key].display, {after: 0});
            }
        });
    }
    /**
     * Return true if list of elements has auth display params
     *
     * @param elementList - List of elements with display params
     * @returns boolean flag
     */
    public static hasDisplayAuth<T>(elementList: ({display?: IDisplayConfig} & T)[]): boolean {
        return _reduce(elementList, (res, element): boolean => {
            return res || !_isUndefined(element.display?.auth);
        }, false);
    }

    /**
     * Escapes the input string
     * @param {string} source
     * @return shielding source string
     */
    public static shieldingString(source: string): string {
        return source.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
    }

    /**
     * Gets config from config service for no-content component and merge it with params from layouts
     * @returns {INoContentCParams}
     */
    public static getNoContentParams(
        params: IParams,
        componentClass: string,
        configService: ConfigService,
        useTypeForGettingProps?: boolean,
    ): INoContentCParams {
        const settingsFromParams: INoContentCParams = _get(params.noContent, params.theme);
        const defaultSettings = configService.get(`$${params.moduleName}.components.${params.componentName}.noContent`);

        return _assign(
            {
                parentComponentClass: componentClass,
                theme: params.theme,
                themeMod: params.themeMod,
            },
            (useTypeForGettingProps ? _get(defaultSettings, params.type) : defaultSettings)['default'],
            (useTypeForGettingProps ? _get(defaultSettings, params.type) : defaultSettings)[params.theme],
            (settingsFromParams ? settingsFromParams : {}),
        );
    }

    /**
     * Set file extension
     *
     * @param {string} filePath File path
     * @param {string} extension File extension
     * @returns {string} File path with the specified extension
     */
    public static setFileExtension(filePath: string, extension: string): string {
        return filePath.replace(/\.[\da-z]+$/i, '') + `.${extension}`;
    }

    /**
     * Checking the opening of a site in an iframe
     *
     * @returns {boolean} Result of checking
     */
    public static isIframe(window: Window): boolean {
        return window !== window.top || window !== window.parent || document !== top.document;
    }

    /**
     * Returns the time relative to the current time zone
     *
     * @param date {string}
     * @param from {'ISO' | 'SQL'} recording format
     * @param toFormat {string} in what recording format should I remake
     * @param options {DateTimeOptions}
     * @returns {string} local time
     */
    public static toLocalTime(
        date: string,
        from: 'ISO' | 'SQL',
        toFormat: string,
        options: DateTimeOptions = {zone: 'utc'},
    ): string {
        switch(from) {
            case 'ISO':
                return DateTime.fromISO(date, options).toLocal().toFormat(toFormat);
            case 'SQL':
                return DateTime.fromSQL(date, options).toLocal().toFormat(toFormat);
        }
    }

    /**
     * Change url if used mobileApp and url is relative
     *
     * @returns {string} Url for request
     */
    public static proxyUrl(url: string): string {
        if (!url) {
            return '';
        }
        if (!GlobalHelper.mobileAppApiUrl || url.indexOf('/') !== 0 || url.indexOf('app-static/') >= 0) {
            return url;
        }
        return GlobalHelper.mobileAppApiUrl + url;
    }

    public static proxyLinks(content: string): string {
        if (!GlobalHelper.mobileAppApiUrl) {
            return content;
        }
        return content.replace(/\/(gstatic|static)/g, GlobalHelper.mobileAppApiUrl + '/' + '$1');
    }

    /**
     * Used mobile app or not
     *
     * @returns {boolean} True if used mobile app
     */
    public static isMobileApp(): boolean {
        return !!environment.mobileApp;
    }

    public static appLockScreenOrientation(lockType: OrientationLockType): void {
        if (GlobalHelper.isMobileApp()) {
            // @ts-ignore
            screen.orientation.lock(lockType);
        }
    }

    public static appUnlockScreenOrientation(): void {
        if (GlobalHelper.isMobileApp()) {
            // @ts-ignore
            screen.orientation.unlock();
        }
    }

    public static mobileAppPlatform(): string {
        // @ts-ignore
        return cordova.platformId;
    }

    public static openBrowserLinkFromMobileApp(url: string): void {
        // @ts-ignore
        cordova.InAppBrowser.open(
            url,
            '_system',
            'location=no',
        );
    }

    /**
     * Get GET params of url path if url path have ?message or ?error
     *
     * @param {string} url Url path
     * @returns {IIndexing<string>} GET params of url
     */
    public static parseUrlMessageOrError(url: string): IIndexing<string> {
        if (url.includes('message') || url.includes('error')) {
            const getParams = {};
            const values: string[] = url.split('?')?.[1]?.split('&') || [];

            if (values.length) {
                for (const value of values) {
                    const parts: string[] = value.split('=');
                    getParams[parts[0]] = parts[1];
                }
                return getParams;
            }
        }
    }

    /**
     * Delete all html tags from string
     *
     * @param {string} text
     *
     * @returns {string}
     */
    public static deleteHTMLTags(text: string): string {
        return _replace(text, sanitizeHTMLTags, '');
    }
}
