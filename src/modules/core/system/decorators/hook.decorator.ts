import _has from 'lodash-es/has';

import {GlobalDeps} from 'wlc-engine/modules/app/app.module';
import {IReplaceHook} from 'wlc-engine/modules/core';

export function CustomHook(module: string, method: string) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const params: string = `\$${module}.customHooks.${method}`;
        const customHooks: IReplaceHook = GlobalDeps.configService.get(params);
        const originalMethod = descriptor.value;

        if (customHooks) {
            if (_has(customHooks, 'replace')) {
                descriptor.value = customHooks['replace'];
            } else if (_has(customHooks, 'final')) {
                descriptor.value = function (...args) {
                    originalMethod.apply(this, args);
                    customHooks['final']();
                };
            }
        }
    };
};
