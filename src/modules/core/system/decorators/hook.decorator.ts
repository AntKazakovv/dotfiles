import _get from 'lodash-es/get';
import * as $config from 'wlc-config/index';

export function CustomHook(moduleName: string, methodName: string) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const customHook: any = _get($config, `$hook.customHookConfig.${moduleName}.${methodName}`, null);
        const originalMethod: Function = descriptor.value;

        if (customHook) {
            descriptor.value = function (...args) {
                return customHook.call(this, originalMethod.bind(this), ...args);
            };
        }
    };
}

export function CustomAsyncHook(moduleName: string, methodName: string) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const customHook: any = _get($config, `$hook.customHookConfig.${moduleName}.${methodName}`, null);
        const originalMethod: Function = descriptor.value;

        if (customHook) {
            descriptor.value = async function (...args) {
                return customHook.call(this, originalMethod.bind(this), ...args);
            };
        }
    };
}
