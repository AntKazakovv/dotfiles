import {
    APP_INITIALIZER,
    Type,
    Provider,
    QueryList,
} from '@angular/core';
import {
    fromEvent,
    fromEventPattern,
    Observable,
} from 'rxjs';

import {NgTemplateNameDirective} from 'wlc-engine/modules/core/directives/template-name/template-name.directive';

import {
    get as _get,
    size as _size,
    each as _each,
    mergeWith as _mergeWith,
    isArray as _isArray,
    isUndefined as _isUndefined,
    keys as _keys,
} from 'lodash-es';

export class GlobalHelper {

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

    public static getTemplateByName(templatesList: QueryList<NgTemplateNameDirective>, name: string) {
        // console.log(templatesList);
        // const dir = templatesList.find((template: NgTemplateNameDirective) => template.name === name);
        // return dir ? dir.template : null;
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
    public static mergeConfig<T>(engineConfig: T , projectConfig: Partial<T>): T {
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
     * Note: Providers are bootstrapped before ApplicationRef is created so you cannot inject it during service creation.
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
        const inlineParams: any = {
            common: {},
        };

        _each(inputProperties, property => {
            if (!_isUndefined(_get(instance, property))) {
                inlineParams.common[property] = _get(instance, property);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : {common: {}};
    }

    /**
     * Converts string to snakeCase. One or multiple spaces are replaced with underscores, parentheses are removed.
     * @ngdoc method
     * @name toSnakeCase
     * @param {string} name - The string to convert.
     * @returns The snake cased string.
     */
    public static toSnakeCase(name: string): string {
        return name.toLowerCase().replace(/\s+|\s/g, '_').replace(/[()]/g, '');
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
}
