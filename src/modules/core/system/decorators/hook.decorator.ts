import _get from 'lodash-es/get';
import * as $config from 'wlc-config/index';

type THook = {
    module: string;
    class: string;
    method: string;
}

export function CustomHook(hook: THook) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const customHook: any =
            _get($config, `$hook.customHookConfig.${hook.module}.${hook.class}.${hook.method}`, null);
        const originalMethod: Function = descriptor.value;

        if (customHook) {
            descriptor.value = function (...args) {
                return customHook.call(this, originalMethod.bind(this), ...args);
            };
        }
    };
}

export function CustomAsyncHook(hook: THook) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const customHook: any =
            _get($config, `$hook.customHookConfig.${hook.module}.${hook.class}.${hook.method}`, null);
        const originalMethod: Function = descriptor.value;

        if (customHook) {
            descriptor.value = async function (...args) {
                return customHook.call(this, originalMethod.bind(this), ...args);
            };
        }
    };
}
