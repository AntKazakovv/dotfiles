import {GlobalDeps} from 'wlc-engine/modules/app/app.module';
import {IReplaceHook} from 'wlc-engine/modules/core';

export function CustomHook(moduleName: string, methodName: string) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const params: string = `customHookConfig.${moduleName}.${methodName}`;
        const customHooks: IReplaceHook = GlobalDeps.configService.get(params);
        const originalMethod = descriptor.value;

        if (customHooks) {
            if (customHooks.replace) {
                descriptor.value = customHooks['replace'];
            } else if (customHooks.final) {
                descriptor.value = function (...args) {
                    originalMethod.apply(this, args);
                    customHooks['final']();
                };
            }
        }
    };
}
