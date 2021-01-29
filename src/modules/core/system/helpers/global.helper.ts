import {QueryList} from '@angular/core';
import {NgTemplateNameDirective} from 'wlc-engine/modules/core/directives/template-name/template-name.directive';

import {
    get as _get,
    size as _size,
    each as _each,
    mergeWith as _mergeWith,
    isArray as _isArray,
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
}
