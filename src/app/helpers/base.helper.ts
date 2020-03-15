'use strict';

import {
    get as _get,
    sortBy as _sortBy,
    size as _size,
    reverse as _reverse,
    isArray as _isArray,
    each as _each,
} from 'lodash';

export class Helper {

    public static sortByOrder<T>(items: T[], order: any[], attr?: string): T[] {

        if (!_size(items)) {return []; }

        if (!_size(order)) {return items; }

        const orderReverse = _reverse(order.slice());

        return items.sort((a: T, b: T): number => {
            if (attr) {
                return orderReverse.indexOf(b[attr]) - orderReverse.indexOf(a[attr]);
            } else {
                return orderReverse.indexOf(b) - orderReverse.indexOf(a);
            }
        });
    }

    public static runCallback(context: any, callback: any, callbackArgs: any[]): void {
        callbackArgs = callbackArgs || [];
        if (typeof callback === 'function') {
            callback.apply(context, callbackArgs);
        } else if (_isArray(callback)) {
            callback.forEach((item: any) => {
                if (typeof item === 'function') {
                    item.apply(context, callbackArgs);
                }
            });
        }
    }

    public static setCookie(name: string, value: string, days?: number): void {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires = ' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    public static getCookie(name: string): string {
        const nameEQ: string = name + '=',
            ca = document.cookie.split(';');

        for (let c of ca) {
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return;
    }

    public static deleteCookie(name: string): void {
        this.setCookie(name, '', -1);
    }

    public static guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    public static touchSupported(): boolean {

        return ('ontouchstart' in window ||
            is_touch_by_match_media() ||
            document.documentElement.ontouchmove ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            typeof window.ontouchstart !== 'undefined' ||
            'createTouch' in document ||
            window.navigator && window.navigator.msPointerEnabled && window['MSGesture']) ? true : false;

        function is_touch_by_match_media(): boolean {
            if (!window.matchMedia) {
                return false;
            }

            const prefixes: string[] = ' -webkit- -moz- -o- -ms- '.split(' ');
            const mq = (query: string): boolean => {
                return window.matchMedia(query).matches;
            };
            const query: string = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');

            return (mq(query) || window.matchMedia('only handheld')) ? true : false;
        }

    }
}
